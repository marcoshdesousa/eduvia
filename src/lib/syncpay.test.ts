import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// SyncPay simulada: token, criar Pix e consultar status.
const calls: string[] = [];
let status = "pending";
let server: Server;

beforeAll(async () => {
  server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      calls.push(`${req.method} ${req.url} ${req.headers.authorization ?? ""}`);
      res.setHeader("content-type", "application/json");
      if (req.url === "/api/partner/v1/auth-token") {
        const b = JSON.parse(body);
        if (b.client_id !== "cid" || b.client_secret !== "csecret") return res.writeHead(401).end("{}");
        return res.end(JSON.stringify({ access_token: "tok123", token_type: "Bearer", expires_in: 3600 }));
      }
      if (req.headers.authorization !== "Bearer tok123") return res.writeHead(401).end("{}");
      if (req.url === "/api/partner/v1/cash-in") {
        const b = JSON.parse(body);
        expect(b.amount).toBe(9.9);
        expect(b.client.cpf).toBe("12345678909");
        expect(b.client.phone).toBe("11999999999"); // sem o 55
        expect(b.webhook_url).toContain("token=");
        return res.end(JSON.stringify({ message: "ok", pix_code: "00020126PIXCOPIAECOLA", identifier: "tx-1" }));
      }
      if (req.url === "/api/partner/v2/transactions/tx-1")
        return res.end(JSON.stringify({ data: { transaction: { id: "tx-1", status, paid_at: status === "completed" ? "2026-10-05T12:00:00Z" : null } } }));
      res.writeHead(404).end("{}");
    });
  });
  await new Promise<void>((r) => server.listen(0, r));
  process.env.SYNCPAY_API_BASE = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  process.env.SYNCPAY_CLIENT_ID = "cid";
  process.env.SYNCPAY_CLIENT_SECRET = "csecret";
});
afterAll(() => server.close());

describe("SyncPay (Pix)", () => {
  it("pega o token, cria o Pix e consulta o status", async () => {
    vi.resetModules();
    const sp = await import("./syncpay");
    expect(sp.syncpayConfigured()).toBe(true);
    const pix = await sp.createPix({
      valueCents: 990,
      description: "Eduvia - plano Pro",
      webhookUrl: `https://eduvia.app/api/webhooks/syncpay?token=${sp.webhookToken()}`,
      client: { name: "Ana", cpf: "12345678909", phone: "+55 (11) 99999-9999", email: "aluno@eduvia.com.br" },
    });
    expect(pix).toEqual({ id: "tx-1", pixCode: "00020126PIXCOPIAECOLA" });
    expect(await sp.pixStatus("tx-1")).toBe("pending");
    status = "completed";
    expect(await sp.pixStatus("tx-1")).toBe("paid");
    // o token é reaproveitado (um pedido de token só)
    expect(calls.filter((c) => c.includes("auth-token"))).toHaveLength(1);
  });
  it("entende os nomes de status e o aviso (webhook)", async () => {
    const sp = await import("./syncpay");
    expect(sp.normalizeStatus("PAID_OUT")).toBe("paid");
    expect(sp.normalizeStatus("completed")).toBe("paid");
    expect(sp.normalizeStatus("pending")).toBe("pending");
    expect(sp.normalizeStatus("failed")).toBe("failed");
    expect(sp.normalizeStatus("refunded")).toBe("failed");
    expect(sp.webhookChargeIds({ data: { id: "tx-9", status: "completed" } })).toEqual(["tx-9"]);
    expect(sp.webhookChargeIds({ identifier: "tx-8" })).toEqual(["tx-8"]);
    const uuid = "0d6f4a5e-1b2c-4d3e-8f90-123456789abc";
    expect(sp.webhookChargeIds({ event: "cashin.update", data: { transaction: { identifier: uuid } } })).toEqual([uuid]);
    expect(sp.webhookChargeIds(null)).toEqual([]);
  });
});
