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
        expect(b.webhook_url).toContain("token=");
        return res.end(JSON.stringify({ message: "ok", pix_code: "00020126PIXCOPIAECOLA", identifier: "tx-1" }));
      }
      if (req.url === "/api/partner/v1/transaction/tx-1") return res.end(JSON.stringify({ data: { reference_id: "tx-1", status } }));
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
      client: { name: "Ana", cpf: "12345678909", phone: "11999999999", email: "aluno@eduvia.com.br" },
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
    expect(sp.webhookChargeId({ data: { id: "tx-9", status: "completed" } })).toBe("tx-9");
    expect(sp.webhookChargeId({ identifier: "tx-8" })).toBe("tx-8");
    expect(sp.webhookChargeId(null)).toBeNull();
  });
});
