import { expect, test } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

// Requer BILLING_ENFORCED diferente de "false" no servidor.
test("teste grátis → plano Grátis → admin libera o plano", async ({ page, browser }) => {
  const handle = `aluno.pago.${uid}`;
  await signUp(page, { name: "Aluno Pagante", handle });

  // modo teste: aviso no topo e link para o WhatsApp com a mensagem pronta
  await expect(page.getByText(/Modo teste: faltam/)).toBeVisible();
  await page.getByRole("link", { name: "Assinar plano" }).click();
  await expect(page).toHaveURL(/\/assinatura/);
  const wa = page.getByRole("link", { name: /Assinar Completo pelo WhatsApp/ });
  const href = await wa.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(decodeURIComponent(href!)).toContain(`@${handle}`);
  expect(decodeURIComponent(href!)).toContain("plano Completo mensal");
  await page.getByRole("tab", { name: "Semanal" }).click();
  await expect.poll(async () => decodeURIComponent((await wa.getAttribute("href"))!)).toContain("plano Completo semanal");

  // cria uma preparação e encerra o teste
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Primeira");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);
  await sql(`UPDATE "user" SET "trialEndsAt" = now() - interval '1 minute' WHERE handle = $1`, [handle]);

  // plano Grátis: aviso, sem envio de materiais, sem segunda preparação
  await page.reload();
  await expect(page.getByText(/Teste encerrado — plano Grátis/)).toBeVisible();
  await expect(page.getByText(/não inclui envio de materiais/)).toBeVisible();
  const blocked = await page.request.post("/api/materials", { data: { preparationId: "x", filename: "a.pdf", size: 10 } });
  expect(blocked.status()).toBe(402);
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Segunda");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page.getByText(/Seu plano Grátis permite 1 preparação/)).toBeVisible();

  // admin confirma o pagamento e libera o plano Completo mensal
  const admin = await (await browser.newContext()).newPage();
  await signUp(admin, { name: "Admin Teste", handle: `admin.${uid}` });
  await sql(`UPDATE "user" SET "isAdmin" = true WHERE handle = $1`, [`admin.${uid}`]);
  await admin.goto(`/admin?q=${handle}`);
  admin.on("dialog", (d) => d.accept());
  await admin.getByLabel("Plano").selectOption("completo");
  await admin.getByLabel("Período").selectOption("MONTH");
  await admin.getByRole("button", { name: "Liberar" }).click();
  await expect(admin.getByText(/Completo mensal até/)).toBeVisible();
  await admin.goto("/admin?aba=planos");
  await expect(admin.getByRole("button", { name: "Salvar" }).first()).toBeVisible();
  await admin.goto("/admin?aba=custos");
  await expect(admin.getByText(/Custo de IA/i).first()).toBeVisible();

  // aluno volta a ter tudo liberado
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Completo")).toBeVisible();
  await expect(page.getByText(/Teste encerrado/)).toHaveCount(0);
  const prep = await sql<{ id: string }>(`SELECT p.id FROM "Preparation" p JOIN "user" u ON u.id = p."userId" WHERE u.handle = $1`, [handle]);
  await page.goto(`/preparacoes/${prep[0].id}?aba=materiais`);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "aula.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(2) });
  await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 60_000 });

  // não-admin não acessa /admin
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/inicio/);
});
