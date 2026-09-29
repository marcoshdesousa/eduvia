import { expect, test } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

// Requer BILLING_ENFORCED diferente de "false" no servidor.
test("teste grátis → modo limitado → admin libera o plano", async ({ page, browser }) => {
  const handle = `aluno.pago.${uid}`;
  await signUp(page, { name: "Aluno Pagante", handle });

  // modo teste: aviso no topo e link para o WhatsApp com a mensagem pronta
  await expect(page.getByText(/Modo teste: faltam/)).toBeVisible();
  await page.getByRole("link", { name: "Assinar plano" }).click();
  await expect(page).toHaveURL(/\/assinatura/);
  const wa = page.getByRole("link", { name: /Assinar pelo WhatsApp/ }).last();
  const href = await wa.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(decodeURIComponent(href!)).toContain(`@${handle}`);

  // cria uma preparação e encerra o teste
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Primeira");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);
  await sql(`UPDATE "user" SET "trialEndsAt" = now() - interval '1 minute' WHERE handle = $1`, [handle]);

  // modo limitado: aviso, sem envio de materiais, sem segunda preparação
  await page.reload();
  await expect(page.getByText(/Teste encerrado — modo limitado/)).toBeVisible();
  await expect(page.getByText(/Assine um plano para enviar novos materiais/)).toBeVisible();
  const blocked = await page.request.post("/api/materials", { data: { preparationId: "x", filename: "a.pdf", size: 10 } });
  expect(blocked.status()).toBe(402);
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Segunda");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page.getByText(/No modo limitado você pode ter 1 preparação/)).toBeVisible();

  // admin confirma o pagamento e libera o plano mensal
  const admin = await (await browser.newContext()).newPage();
  await signUp(admin, { name: "Admin Teste", handle: `admin.${uid}` });
  await sql(`UPDATE "user" SET "isAdmin" = true WHERE handle = $1`, [`admin.${uid}`]);
  await admin.goto(`/admin?q=${handle}`);
  admin.on("dialog", (d) => d.accept());
  await admin.getByRole("button", { name: "+ Mensal" }).click();
  await expect(admin.getByText(/Mensal até/)).toBeVisible();

  // aluno volta a ter tudo liberado
  await page.goto("/assinatura");
  await expect(page.getByText("Plano Mensal", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/modo limitado/)).toHaveCount(0);
  const prep = await sql<{ id: string }>(`SELECT p.id FROM "Preparation" p JOIN "user" u ON u.id = p."userId" WHERE u.handle = $1`, [handle]);
  await page.goto(`/preparacoes/${prep[0].id}?aba=materiais`);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "aula.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(2) });
  await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 60_000 });

  // não-admin não acessa /admin
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/inicio/);
});
