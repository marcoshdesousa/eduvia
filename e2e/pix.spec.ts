import { devices, expect, test, type Browser, type Page } from "@playwright/test";
import { PASSWORD, signUp, sql } from "./helpers";

// Pix de ponta a ponta com uma SyncPay simulada. Só roda com SYNCPAY_E2E=<endereço da SyncPay simulada>
// (o servidor precisa estar com SYNCPAY_API_BASE apontando para ela).
const mock = process.env.SYNCPAY_E2E;
test.skip(!mock, "precisa da SyncPay simulada (SYNCPAY_E2E)");

const uid = Date.now().toString(36);
const { defaultBrowserType: _a, ...iphone } = devices["iPhone 13"];
const { defaultBrowserType: _b, ...desktop } = devices["Desktop Chrome"];

async function payPix(page: Page, button: RegExp) {
  await page.getByRole("button", { name: button }).first().click();
  const modal = page.getByRole("dialog", { name: "Pagamento por Pix" });
  await expect(modal.getByAltText("QR Code do Pix")).toBeVisible();
  await expect(modal.getByLabel("Pix copia e cola")).toHaveValue(/^00020126PIX/);
  await fetch(`${mock}/_pay_last`); // "o aluno pagou no banco"
  await expect(modal.getByText("Pagamento confirmado!")).toBeVisible({ timeout: 20_000 });
}

async function newPage(browser: Browser, device: object) {
  return (await browser.newContext({ ...device, locale: "pt-BR", timezoneId: "America/Sao_Paulo" })).newPage();
}

test("Pix: admin, aluno no teste (iPhone), conta antiga vencida (computador) e renovação", async ({ page, browser }) => {
  // administrador (Android): o Pix aparece também
  await signUp(page, { name: "Admin Pix", handle: `admin.pix.${uid}`, plan: "gratis" });
  await sql(`UPDATE "user" SET "isAdmin" = true WHERE handle = $1`, [`admin.pix.${uid}`]);
  await page.goto("/assinatura");
  for (const plan of ["Pro", "Avançado", "Ilimitado"]) await expect(page.getByRole("button", { name: `Assinar ${plan} com Pix` })).toBeVisible();
  await expect(page.getByText(/WhatsApp/)).toHaveCount(0);

  // aluno no teste grátis, no iPhone: paga e o plano libera sozinho
  const ip = await newPage(browser, iphone);
  await signUp(ip, { name: "Aluno iPhone", handle: `aluno.iphone.${uid}`, plan: "gratis" });
  await ip.goto("/assinatura");
  await payPix(ip, /Assinar Pro com Pix/);
  await ip.reload();
  await expect(ip.getByText(/Ativo até/)).toBeVisible();
  await expect(ip.getByText("Seu plano: Pro")).toBeVisible();

  // conta antiga (criada há 2 meses, plano venceu): entra no computador, paga e volta a estudar
  const oldHandle = `aluno.antigo.${uid}`;
  const tmp = await newPage(browser, desktop);
  await signUp(tmp, { name: "Aluno Antigo", handle: oldHandle });
  await tmp.context().close();
  await sql(`UPDATE "user" SET "createdAt" = now() - interval '60 days', "trialEndsAt" = now() - interval '57 days' WHERE handle = $1`, [oldHandle]);
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() - interval '2 days' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [oldHandle]);
  const pc = await newPage(browser, desktop);
  await pc.goto("/entrar");
  await pc.getByLabel("CPF ou @").fill(`@${oldHandle}`);
  await pc.getByLabel("Senha").fill(PASSWORD);
  await pc.getByRole("button", { name: "Entrar" }).click();
  await expect(pc).toHaveURL(/\/assinatura/);
  await expect(pc.getByText(/Seu plano Pro venceu/).first()).toBeVisible();
  await payPix(pc, /Renovar Pro com Pix/);
  await pc.goto("/inicio");
  await expect(pc).toHaveURL(/\/inicio/);

  // renovação: vence amanhã → janela ao abrir o site, paga ali mesmo e soma 30 dias
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`, [`aluno.iphone.${uid}`]);
  const ip2 = await ip.context().newPage();
  await ip2.goto("/inicio");
  const popup = ip2.getByRole("dialog", { name: "Renovar plano" });
  await expect(popup).toBeVisible();
  await payPix(ip2, /Renovar Pro com Pix/);
  await expect(popup).toHaveCount(0, { timeout: 10_000 });
  const [row] = (await sql<{ days: number }>(
    `SELECT round(extract(epoch from ("currentPeriodEnd" - now())) / 86400) AS days FROM "Subscription" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`,
    [`aluno.iphone.${uid}`],
  )) as unknown as { days: number }[];
  expect(Number(row.days)).toBe(31);
});
