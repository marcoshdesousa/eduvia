import { expect, test } from "@playwright/test";
import pg from "pg";

const uid = Date.now().toString(36);
const DB = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/eduvia";
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || "dev-webhook-token";

async function query<T>(sql: string, params: unknown[]) {
  const c = new pg.Client({ connectionString: DB });
  await c.connect();
  const r = await c.query(sql, params);
  await c.end();
  return r.rows as T[];
}

// Requer o app sem ASAAS_API_KEY (provedor simulado) e com ASAAS_WEBHOOK_TOKEN definido.
test("assinatura: Pix, confirmação, webhook idempotente e cancelamento", async ({ page }) => {
  const handle = `assinante.${uid}`;
  await page.goto("/cadastro");
  await page.getByLabel("Nome", { exact: true }).fill("Assinante Teste");
  await page.getByLabel("E-mail", { exact: true }).fill(`${handle}@teste.dev`);
  await page.getByLabel("Senha").fill("senha-segura-123");
  await page.locator("#handle").fill(handle);
  await expect(page.getByText("Disponível!")).toBeVisible();
  await page.getByLabel("Data de nascimento").fill("1992-07-20");
  await page.locator('input[name="terms"]').check();
  await page.getByRole("button", { name: /Criar conta/ }).click();
  await expect(page).toHaveURL(/\/inicio/);

  await page.goto("/assinatura");
  await expect(page.getByText("Teste grátis", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Mensal/ }).click();
  await page.getByLabel("CPF ou CNPJ").fill("12345678900");
  await page.getByRole("button", { name: "Gerar Pix" }).click();
  await expect(page.getByText("CPF ou CNPJ inválido.")).toBeVisible();
  await page.getByLabel("CPF ou CNPJ").fill("52998224725");
  await expect(page.getByLabel("CPF ou CNPJ")).toHaveValue("529.982.247-25");
  await page.getByRole("button", { name: "Gerar Pix" }).click();

  await expect(page).toHaveURL(/\/assinatura\/pagamento\//);
  await expect(page.getByLabel("Pix copia e cola")).toHaveValue(/SIMULADO/);
  await page.getByRole("button", { name: /Simular pagamento/ }).click();
  await expect(page.getByText("Pagamento confirmado!")).toBeVisible();

  await page.goto("/assinatura");
  await expect(page.getByText("Assinatura ativa")).toBeVisible();
  await expect(page.getByText("Pago", { exact: true })).toBeVisible();

  // webhook: evento repetido não estende o período duas vezes
  const [row] = await query<{ providerPaymentId: string; providerSubscriptionId: string; end: Date }>(
    `SELECT p."providerPaymentId", s."providerSubscriptionId", s."currentPeriodEnd" AS end
       FROM "Payment" p JOIN "Subscription" s ON s.id = p."subscriptionId" JOIN "user" u ON u.id = s."userId"
      WHERE u.handle = $1`,
    [handle],
  );
  const event = {
    id: `evt_${uid}`,
    event: "PAYMENT_RECEIVED",
    payment: { id: row.providerPaymentId, subscription: row.providerSubscriptionId, status: "RECEIVED", billingType: "PIX", value: 15, dueDate: "2026-10-01", paymentDate: "2026-10-01" },
  };
  const unauthorized = await page.request.post("/api/webhooks/asaas", { data: event });
  expect(unauthorized.status()).toBe(401);
  for (let i = 0; i < 2; i++) {
    const res = await page.request.post("/api/webhooks/asaas", { data: event, headers: { "asaas-access-token": WEBHOOK_TOKEN } });
    expect(res.ok()).toBeTruthy();
  }
  const [after] = await query<{ end: Date }>(
    `SELECT s."currentPeriodEnd" AS end FROM "Subscription" s JOIN "user" u ON u.id = s."userId" WHERE u.handle = $1`,
    [handle],
  );
  expect(new Date(after.end).getTime()).toBe(new Date(row.end).getTime());

  // cancelamento mantém o acesso até o fim do período
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Cancelar assinatura" }).click();
  await expect(page.getByText(/Renovação cancelada/)).toBeVisible();
  await expect(page.getByText("Reativar ou trocar de plano")).toBeVisible();
});
