// Pagamento por Pix com a SyncPay: o site cria a cobrança, mostra o QR Code e libera o plano quando o Pix cai.
// Configuração (Render → Environment): SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET (obrigatórias)
// e, se a SyncPay indicar outro endereço, SYNCPAY_API_BASE.
// Segurança: o aviso (webhook) da SyncPay nunca libera o plano sozinho; o site sempre confere o status
// da cobrança direto na API antes de liberar.
import { createHmac } from "node:crypto";

const base = () => (process.env.SYNCPAY_API_BASE || "https://api.syncpayments.com.br").replace(/\/+$/, "");

export function syncpayConfigured() {
  return !!(process.env.SYNCPAY_CLIENT_ID?.trim() && process.env.SYNCPAY_CLIENT_SECRET?.trim());
}

/** Token secreto que vai no endereço do aviso (webhook): só a SyncPay conhece o endereço completo. */
export function webhookToken() {
  const secret = process.env.SYNCPAY_WEBHOOK_SECRET || process.env.BETTER_AUTH_SECRET || "dev-secret";
  return createHmac("sha256", secret).update("syncpay-webhook").digest("hex").slice(0, 32);
}

let token: { value: string; until: number } | null = null;

/** Token de acesso (vale por um tempo; renovado sozinho). */
async function accessToken(): Promise<string> {
  if (token && token.until > Date.now() + 60_000) return token.value;
  const res = await fetch(`${base()}/api/partner/v1/auth-token`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ client_id: process.env.SYNCPAY_CLIENT_ID?.trim(), client_secret: process.env.SYNCPAY_CLIENT_SECRET?.trim() }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const value = String(body.access_token ?? body.token ?? (body.data as Record<string, unknown> | undefined)?.access_token ?? "");
  if (!res.ok || !value) throw new Error(`SyncPay: não autorizou (${res.status} ${JSON.stringify(body).slice(0, 200)})`);
  const expiresIn = Number(body.expires_in) || 3000;
  const expiresAt = typeof body.expires_at === "string" ? Date.parse(body.expires_at) : NaN;
  token = { value, until: Number.isFinite(expiresAt) ? expiresAt : Date.now() + expiresIn * 1000 };
  return value;
}

async function call(path: string, init: { method: "GET" | "POST"; body?: unknown }) {
  const send = async () =>
    fetch(`${base()}${path}`, {
      method: init.method,
      headers: { "content-type": "application/json", accept: "application/json", authorization: `Bearer ${await accessToken()}` },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(30_000),
    });
  let res = await send();
  if (res.status === 401) {
    token = null; // token venceu antes da hora: pega outro e tenta de novo
    res = await send();
  }
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(`SyncPay ${path}: ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

/** Procura um campo em vários nomes possíveis (a resposta pode vir direto ou dentro de "data"). */
function pick(body: Record<string, unknown>, keys: string[]): string | null {
  for (const src of [body, body.data as Record<string, unknown> | undefined]) {
    if (!src || typeof src !== "object") continue;
    for (const k of keys) {
      const v = (src as Record<string, unknown>)[k];
      if (typeof v === "string" && v) return v;
      if (typeof v === "number") return String(v);
    }
  }
  return null;
}

export type PixCharge = { id: string; pixCode: string };

/** Cria a cobrança Pix. Valor em centavos. */
export async function createPix(input: {
  valueCents: number;
  description: string;
  webhookUrl: string;
  client: { name: string; cpf: string; phone: string; email: string };
}): Promise<PixCharge> {
  const body = await call("/api/partner/v1/cash-in", {
    method: "POST",
    body: {
      amount: Math.round(input.valueCents) / 100,
      description: input.description,
      webhook_url: input.webhookUrl,
      client: { name: input.client.name, cpf: input.client.cpf, email: input.client.email, phone: input.client.phone },
    },
  });
  const id = pick(body, ["identifier", "id", "transaction_id", "reference_id"]);
  const pixCode = pick(body, ["pix_code", "pixCode", "qr_code", "qrcode", "copy_paste", "emv", "payload"]);
  if (!id || !pixCode) throw new Error(`SyncPay: resposta sem Pix (${JSON.stringify(body).slice(0, 300)})`);
  return { id, pixCode };
}

export type PixStatus = "paid" | "pending" | "failed";

/** Situação da cobrança, direto na API (é o que vale para liberar o plano). */
export async function pixStatus(id: string): Promise<PixStatus> {
  const body = await call(`/api/partner/v1/transaction/${encodeURIComponent(id)}`, { method: "GET" });
  return normalizeStatus(pick(body, ["status", "situation", "state"]));
}

export function normalizeStatus(raw: string | null): PixStatus {
  const s = (raw ?? "").toLowerCase();
  if (/^(completed|paid|approved|confirmed|success|succeeded|paid_out|concluido|concluída|pago|aprovado)$/.test(s)) return "paid";
  if (/(fail|cancel|expired|refund|chargeback|med|recus|estorn)/.test(s)) return "failed";
  return "pending";
}

/** Identificador da cobrança num aviso (webhook) da SyncPay. */
export function webhookChargeId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  return pick(payload as Record<string, unknown>, ["identifier", "id", "transaction_id", "reference_id", "idTransaction"]);
}
