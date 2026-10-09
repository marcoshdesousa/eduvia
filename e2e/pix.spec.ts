import { createHash } from "node:crypto";
import { devices, expect, test, type Browser, type Page } from "@playwright/test";
import { signUp, sql } from "./helpers";
import { randomCpf } from "./fixtures";

// Pix de ponta a ponta com uma SyncPay simulada. Só roda com SYNCPAY_E2E=<endereço da SyncPay simulada>
// (o servidor precisa estar com SYNCPAY_API_BASE apontando para ela).
const mock = process.env.SYNCPAY_E2E;
test.skip(!mock, "precisa da SyncPay simulada (SYNCPAY_E2E)");

const uid = Date.now().toString(36);
const { defaultBrowserType: _a, ...iphone } = devices["iPhone 13"];
const { defaultBrowserType: _b, ...desktop } = devices["Desktop Chrome"];
const cpfHash = (cpf: string) => createHash("sha256").update(`eduvia-promo:${cpf}`).digest("hex");

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

const activeDays = async (handle: string) =>
  sql<{ planSlug: string; days: string }>(
    `SELECT "planSlug", round(extract(epoch from ("currentPeriodEnd" - now())) / 86400)::text AS days FROM "Subscription" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE' AND "currentPeriodEnd" > now()`,
    [handle],
  );
const lastPix = async () =>
  (await sql<{ valueCents: number; promo: boolean; referral: boolean }>(`SELECT "valueCents", promo, referral FROM "Payment" WHERE "billingType" = 'PIX' ORDER BY "createdAt" DESC LIMIT 1`))[0];

test("Pix: Básico, subir para o Completo (preço cheio, promoção), renovação e plano liberado pelo admin", async ({ browser }) => {
  // aluno no Grátis, no iPhone: paga o Básico e o plano libera sozinho
  const handle = `aluno.iphone.${uid}`;
  const ip = await newPage(browser, iphone);
  await signUp(ip, { name: "Aluno iPhone", handle, plan: "gratis" });
  await ip.goto("/assinatura");
  await expect(ip.getByRole("button", { name: "Assinar o Básico com Pix" })).toBeVisible();
  await expect(ip.getByRole("button", { name: "Assinar o Completo com Pix" })).toBeVisible();
  await expect(ip.getByLabel("Promoção do plano Básico")).toHaveCount(0);
  await payPix(ip, /Assinar o Básico com Pix/);
  await ip.reload();
  await expect(ip.getByText("Seu plano: Básico")).toBeVisible();
  await expect(ip.getByText(/Seu plano · até/)).toBeVisible();
  await expect(ip.getByRole("button", { name: /Básico com Pix/ })).toHaveCount(0);

  // sobe para o Completo depois de 10 dias: paga o preço do Completo (14,90 na promoção), sem desconto pelos dias
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '20 days 1 hour' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`, [handle]);
  await ip.reload();
  await expect(ip.getByLabel("Mudar para o plano Completo").getByText(/você paga R\$\s14,90/)).toBeVisible();
  await payPix(ip, /Mudar para o Completo com Pix/);
  expect(await lastPix()).toMatchObject({ valueCents: 1490, promo: true });
  await ip.reload();
  await expect(ip.getByText("Seu plano: Completo")).toBeVisible();
  const subs = await activeDays(handle);
  expect(subs).toHaveLength(1);
  expect(subs[0]).toMatchObject({ planSlug: "completo", days: "30" });
  // o Básico fica indisponível até o Completo acabar
  await expect(ip.getByLabel("Básico indisponível").getByText(/Disponível para trocar de plano em \d{2}\/\d{2}/)).toBeVisible();
  // 1 mês do Completo pago com promoção: o próximo é o 2º de 3
  await expect(ip.getByLabel("Promoção do plano Completo").getByText(/Você está no 2º de 3 meses com promoção/)).toBeVisible();
  const [{ cpf }] = await sql<{ cpf: string }>(`SELECT cpf FROM "user" WHERE handle = $1`, [handle]);
  const [used] = await sql<{ uses: number }>(`SELECT uses FROM "PromoUse" WHERE "cpfHash" = $1 AND "planSlug" = 'completo'`, [cpfHash(cpf)]);
  expect(Number(used.uses)).toBe(1);

  // renovação: vence amanhã → janela ao abrir o site, paga ali mesmo e soma 30 dias
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`, [handle]);
  const ip2 = await ip.context().newPage();
  await ip2.goto("/inicio");
  const popup = ip2.getByRole("dialog", { name: "Renovar plano" });
  await expect(popup).toBeVisible();
  await payPix(ip2, /Renovar Completo com Pix/);
  await expect(popup).toHaveCount(0, { timeout: 10_000 });
  expect((await activeDays(handle))[0].days).toBe("31");

  // com os 3 meses de promoção usados pelo CPF, volta ao preço normal
  await sql(`UPDATE "PromoUse" SET uses = 3 WHERE "cpfHash" = $1 AND "planSlug" = 'completo'`, [cpfHash(cpf)]);
  await ip2.goto("/assinatura");
  await expect(ip2.getByLabel("Promoção do plano Completo")).toHaveCount(0);

  // plano liberado pelo admin: renova pelo Pix, mas com o preço normal (sem promoção)
  const manualHandle = `aluno.manual.${uid}`;
  const mp = await newPage(browser, desktop);
  await signUp(mp, { name: "Aluno Manual", handle: manualHandle, plan: "gratis" });
  await sql(
    `INSERT INTO "Subscription" (id, "userId", "planSlug", provider, status, interval, "billingType", "currentPeriodEnd", "updatedAt")
     SELECT 'man_' || id, id, 'completo', 'manual', 'ACTIVE', 'MONTH', 'MANUAL', now() + interval '1 day', now() FROM "user" WHERE handle = $1`,
    [manualHandle],
  );
  await sql(
    `INSERT INTO "Payment" (id, "subscriptionId", "providerPaymentId", status, "billingType", "valueCents", "dueDate", "paidAt", "updatedAt")
     SELECT 'pm_' || id, 'man_' || id, 'manual_e2e_' || id, 'PAID', 'MANUAL', 1990, now(), now(), now() FROM "user" WHERE handle = $1`,
    [manualHandle],
  );
  await mp.goto("/assinatura");
  await expect(mp.getByLabel("Promoção do plano Completo")).toHaveCount(0);
  await payPix(mp, /Renovar Completo com Pix/);
  expect(await lastPix()).toMatchObject({ valueCents: 1990, promo: false });
});

test("Indicação: 3 pessoas com o código liberam R$ 7,90; depois 1 nova libera R$ 9,90; cada CPF conta uma vez", async ({ browser }) => {
  test.setTimeout(240_000);
  const handle = `indica.${uid}`;
  const me = await newPage(browser, desktop);
  await signUp(me, { name: "Quem Indica", handle, plan: "gratis" });
  await me.goto("/assinatura");
  const card = me.getByLabel("Plano Indicação");
  const code = (await card.getByLabel("Seu código de indicação").innerText()).trim();
  expect(code).toMatch(/^\d{6}$/);
  await expect(card.getByText("0 de 3 indicações")).toBeVisible();
  await expect(card.getByRole("button", { name: /Indicação com Pix/ })).toHaveCount(0);

  // código errado no cadastro é recusado
  const wrong = await newPage(browser, desktop);
  await wrong.goto("/cadastro?cupom=000001");
  await expect(wrong.getByLabel("Código de indicação (opcional)")).toHaveValue("000001");
  await wrong.context().close();

  // 3 pessoas criam a conta com o código (uma pelo link, as outras digitando)
  const cpfs: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const p = await newPage(browser, iphone);
    const cpf = randomCpf();
    cpfs.push(cpf);
    if (i === 1) {
      await p.goto(`/cadastro?cupom=${code}`);
      await expect(p.getByLabel("Código de indicação (opcional)")).toHaveValue(code);
      await p.context().close();
      const q = await newPage(browser, iphone);
      await signUp(q, { name: `Amigo ${i}`, handle: `amigo${i}.${uid}`, plan: "gratis", coupon: code, cpf });
      await q.context().close();
    } else {
      await signUp(p, { name: `Amigo ${i}`, handle: `amigo${i}.${uid}`, plan: "gratis", coupon: code, cpf });
      await p.context().close();
    }
  }
  await me.reload();
  await expect(card.getByText("3 de 3 indicações")).toBeVisible();
  await payPix(me, /Liberar o plano Indicação com Pix/);
  expect(await lastPix()).toMatchObject({ valueCents: 790, referral: true });
  await me.reload();
  await expect(me.getByText("Seu plano: Indicação")).toBeVisible();
  // tudo liberado (igual ao Completo)
  await me.goto("/enem/portugues");
  await expect(me.getByText(/Bloqueada: faz parte do plano/)).toHaveCount(0);

  // depois de usar: precisa de 1 indicação nova (as antigas não contam) e custa R$ 9,90
  await me.goto("/assinatura");
  await expect(card.getByText(/Indique mais 1 pessoa e pague R\$\s9,90/)).toBeVisible();
  await expect(card.getByText("0 de 1 indicação")).toBeVisible();

  // o mesmo CPF não conta de novo: a conta do amigo 3 é apagada e criada de novo com o código
  await sql(`DELETE FROM "user" WHERE handle = $1`, [`amigo3.${uid}`]);
  const again = await newPage(browser, iphone);
  await signUp(again, { name: "Amigo 3 de novo", handle: `amigo3b.${uid}`, plan: "gratis", coupon: code, cpf: cpfs[2] });
  await again.context().close();
  await me.reload();
  await expect(card.getByText("0 de 1 indicação")).toBeVisible();

  // uma pessoa nova: libera a renovação por R$ 9,90 (perto de vencer)
  const fresh = await newPage(browser, iphone);
  await signUp(fresh, { name: "Amigo 4", handle: `amigo4.${uid}`, plan: "gratis", coupon: code });
  await fresh.context().close();
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1) AND status = 'ACTIVE'`, [handle]);
  await me.reload();
  await expect(card.getByText("1 de 1 indicação")).toBeVisible();
  await payPix(me, /Renovar Indicação com Pix/);
  expect(await lastPix()).toMatchObject({ valueCents: 990, referral: true });
  expect((await activeDays(handle))[0]).toMatchObject({ planSlug: "indicacao", days: "31" });
});
