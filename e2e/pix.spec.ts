import { createHash } from "node:crypto";
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
  // promoção dos 3 primeiros meses no Avançado e no Ilimitado
  await expect(page.getByLabel("Promoção do plano Avançado").getByText(/14,90 nos 3 primeiros meses\. Depois, R\$\s19,90/)).toBeVisible();
  await expect(page.getByLabel("Promoção do plano Ilimitado").getByText(/29,90 nos 3 primeiros meses\. Depois, R\$\s34,90/)).toBeVisible();
  await expect(page.getByLabel("Promoção do plano Pro")).toHaveCount(0);
  await expect(page.getByText(/WhatsApp/)).toHaveCount(0);

  // aluno no teste grátis, no iPhone: paga e o plano libera sozinho
  const ip = await newPage(browser, iphone);
  await signUp(ip, { name: "Aluno iPhone", handle: `aluno.iphone.${uid}`, plan: "gratis" });
  await ip.goto("/assinatura");
  await payPix(ip, /Assinar Pro com Pix/);
  await ip.reload();
  await expect(ip.getByText(/Ativo até/)).toBeVisible();
  await expect(ip.getByText("Seu plano: Pro")).toBeVisible();
  // com plano ativo: o próprio plano não aparece para pagar (só "Seu plano"); os maiores dá para trocar
  await expect(ip.getByText(/Seu plano · até/)).toBeVisible();
  await expect(ip.getByRole("button", { name: /Pro com Pix/ })).toHaveCount(0);
  await expect(ip.getByRole("button", { name: "Trocar para o Avançado com Pix" })).toBeVisible();
  await expect(ip.getByRole("button", { name: "Trocar para o Ilimitado com Pix" })).toBeVisible();

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

  // troca de plano: usou 10 dias do Pro (sobram 20) e troca para o Avançado com desconto por dia
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '20 days 1 hour' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`, [`aluno.iphone.${uid}`]);
  await ip2.goto("/assinatura");
  const box = ip2.getByLabel("Troca para o plano Avançado");
  await expect(box.getByText("Trocar do Pro para o Avançado")).toBeVisible();
  await expect(box.getByText(/Desconto: 20 dias não usados do Pro/)).toBeVisible();
  await expect(box.getByText(/6,60/)).toBeVisible(); // 9,90 ÷ 30 × 20
  await expect(box.getByText(/8,30/)).toBeVisible(); // Avançado na promoção (14,90) − 6,60
  await payPix(ip2, /Trocar para o Avançado com Pix/);
  await ip2.reload();
  await expect(ip2.getByText("Seu plano: Avançado")).toBeVisible();
  // 1 mês do Avançado pago: o próximo é o 2º de 3 com promoção
  await expect(ip2.getByLabel("Promoção do plano Avançado").getByText(/Você está no 2º de 3 meses com promoção/)).toBeVisible();
  // agora o Pro (mais barato) fica indisponível até o Avançado acabar
  const proCard = ip2.getByLabel("Pro indisponível");
  await expect(proCard.getByText("Indisponível")).toBeVisible();
  await expect(proCard.getByText(/Disponível para trocar de plano em \d{2}\/\d{2}/)).toBeVisible();
  await expect(ip2.getByRole("button", { name: /Pro com Pix/ })).toHaveCount(0);
  const subs = await sql<{ planSlug: string; days: number }>(
    `SELECT "planSlug", round(extract(epoch from ("currentPeriodEnd" - now())) / 86400) AS days FROM "Subscription" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`,
    [`aluno.iphone.${uid}`],
  );
  expect(subs).toHaveLength(1);
  expect(subs[0].planSlug).toBe("avancado");
  expect(Number(subs[0].days)).toBe(30);
  const [last] = await sql<{ valueCents: number; creditCents: number }>(`SELECT "valueCents", "creditCents" FROM "Payment" WHERE "billingType" = 'PIX' ORDER BY "createdAt" DESC LIMIT 1`);
  expect(last).toMatchObject({ valueCents: 830, creditCents: 660 });

  // a promoção fica guardada pelo CPF: com os 3 meses do Avançado usados, ele volta ao preço normal
  const [{ cpf }] = await sql<{ cpf: string }>(`SELECT cpf FROM "user" WHERE handle = $1`, [`aluno.iphone.${uid}`]);
  const cpfHash = createHash("sha256").update(`eduvia-promo:${cpf}`).digest("hex");
  const [used] = await sql<{ uses: number }>(`SELECT uses FROM "PromoUse" WHERE "cpfHash" = $1 AND "planSlug" = 'avancado'`, [cpfHash]);
  expect(Number(used.uses)).toBe(1); // pagou 1 mês com promoção
  await sql(`UPDATE "PromoUse" SET uses = 3 WHERE "cpfHash" = $1 AND "planSlug" = 'avancado'`, [cpfHash]);
  await ip2.reload();
  await expect(ip2.getByLabel("Promoção do plano Avançado")).toHaveCount(0);
  await expect(ip2.getByLabel("Promoção do plano Ilimitado")).toBeVisible(); // a do Ilimitado continua

  // plano liberado pelo admin: renova pelo Pix, mas com o preço normal (sem promoção)
  const manualHandle = `aluno.manual.${uid}`;
  const mp = await newPage(browser, desktop);
  await signUp(mp, { name: "Aluno Manual", handle: manualHandle, plan: "gratis" });
  await sql(
    `INSERT INTO "Subscription" (id, "userId", "planSlug", provider, status, interval, "billingType", "currentPeriodEnd", "updatedAt")
     SELECT 'man_' || id, id, 'avancado', 'manual', 'ACTIVE', 'MONTH', 'MANUAL', now() + interval '1 day', now() FROM "user" WHERE handle = $1`,
    [manualHandle],
  );
  await sql(
    `INSERT INTO "Payment" (id, "subscriptionId", "providerPaymentId", status, "billingType", "valueCents", "dueDate", "paidAt", "updatedAt")
     SELECT 'pm_' || id, 'man_' || id, 'manual_e2e_' || id, 'PAID', 'MANUAL', 1990, now(), now(), now() FROM "user" WHERE handle = $1`,
    [manualHandle],
  );
  await mp.goto("/assinatura");
  await expect(mp.getByRole("button", { name: "Renovar Avançado com Pix" })).toBeVisible();
  await expect(mp.getByLabel("Promoção do plano Avançado")).toHaveCount(0);
  await payPix(mp, /Renovar Avançado com Pix/);
  const [manualPay] = await sql<{ valueCents: number; promo: boolean }>(
    `SELECT "valueCents", promo FROM "Payment" WHERE "billingType" = 'PIX' ORDER BY "createdAt" DESC LIMIT 1`,
  );
  expect(manualPay).toMatchObject({ valueCents: 1990, promo: false });
});
