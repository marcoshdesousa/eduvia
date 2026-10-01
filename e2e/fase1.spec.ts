import { expect, test, type Page } from "@playwright/test";
import { EDITAL, makeStudyPdf } from "./fixtures";
import { signUp } from "./helpers";

const uid = Date.now().toString(36);

async function waitMaterialsReady(page: Page, count: number) {
  await expect(page.getByText("Pronto", { exact: true })).toHaveCount(count, { timeout: 90_000 });
}

test("fluxo completo: cadastro, preparação, material, plano, sessão, banco de erros", async ({ page }) => {
  const handle = `aluno.${uid}`;
  await signUp(page, { name: "Aluno Teste", handle });
  await expect(page.getByText("Vamos começar?")).toBeVisible();

  // @ repetido é recusado em tempo real
  const other = await page.context().browser()!.newPage();
  await other.goto("/cadastro");
  await other.locator("#handle").fill(handle);
  await expect(other.getByText("Esse @ já está em uso.")).toBeVisible();
  await other.close();

  // nova preparação: estudo livre, 15 min por dia, todos os dias
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Biologia celular");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "15 min", exact: true }).click();
  for (const d of ["Dom", "Sáb"]) await page.locator("label", { hasText: d }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);

  // envio de PDF → processamento → pronto
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "biologia.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(8) });
  await waitMaterialsReady(page, 1);

  // plano gerado com sessões de 15 min
  await page.getByRole("link", { name: "Plano", exact: true }).click();
  await expect(page.getByText("Hoje")).toBeVisible();
  await expect(page.getByText(/15 min/).first()).toBeVisible();
  await page.getByRole("link", { name: "Estudar" }).first().click();

  // o aluno escolhe quanto tempo tem (5 a 45 min)
  await expect(page.getByText("Quanto tempo você tem agora?")).toBeVisible();
  await page.getByRole("radio", { name: "10 min" }).click();
  await page.getByRole("button", { name: "Começar sessão de 10 min" }).click();

  // sessão: texto → recuperação ativa → questões → concluir
  await expect(page.getByRole("button", { name: /Já li|Continuar/ })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Destaques")).toBeVisible();
  // cronômetro do tempo escolhido e aviso de conteúdo pronto
  await expect(page.getByText(/Sei que pode parecer muito ou pouco tempo/)).toBeVisible();
  await expect(page.getByText(/A IA terminou de criar o seu conteúdo/)).toBeVisible();
  await page.getByRole("button", { name: /Já li|Continuar/ }).click();
  const recall = page.getByPlaceholder("Escreva com suas palavras o que você lembra...");
  while (await recall.count()) {
    await recall.first().fill("Não sei direito, algo sobre células");
    await page.getByRole("button", { name: "Enviar resposta" }).first().click();
    await expect(page.getByText("Resposta-modelo").first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  // responde todas as objetivas escolhendo sempre a primeira alternativa (gera acertos e erros)
  const cards = page.locator("[data-question]");
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  for (let i = 0; i < total; i++) {
    const card = cards.nth(i);
    await card.locator("button").first().click();
    await card.getByRole("button", { name: "Responder" }).click();
    await expect(card.getByText("Explicação:")).toBeVisible();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Concluir sessão" }).click();
  await expect(page.getByText("Sessão concluída!")).toBeVisible();
  await expect(page.getByText(/Você escolheu 10 min e terminou em|Você focou por/)).toBeVisible();
  await expect(page.getByText(/Sei que pode parecer muito ou pouco tempo/)).toHaveCount(0);

  // início mostra progresso e sequência
  await page.goto("/inicio");
  await expect(page.getByText("O que fazer hoje")).toBeVisible();
  await expect(page.getByText(/1\/\d+ sessões/)).toBeVisible();
  // sequência estilo Duolingo: foguinho aceso depois de estudar hoje
  await expect(page.getByRole("region", { name: "Sequência de estudo" })).toContainText("1dia seguido");
  await expect(page.getByText("dia seguido")).toBeVisible();
  await expect(page.getByText(/Foguinho aceso!/)).toBeVisible();

  // banco de erros tem as questões erradas
  await page.goto("/revisoes?filtro=erros");
  await expect(page.getByText(/Errou 1x/).first()).toBeVisible();

  // exportação de dados (LGPD)
  const res = await page.request.get("/api/account/export");
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).user.handle).toBe(handle);
});

test("concurso: edital obrigatório define disciplinas e banca", async ({ page }) => {
  await signUp(page, { name: "Concurseira", handle: `concurso.${uid}` });
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Concurso público/ }).click();
  await page.getByLabel("Nome da preparação").fill("Concurso Teste");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page.getByText(/Envie o/)).toBeVisible();

  await page.locator('input[type="file"]:not([multiple])').setInputFiles({ name: "edital.txt", mimeType: "text/plain", buffer: Buffer.from(EDITAL) });
  await waitMaterialsReady(page, 1);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "apostila.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(4) });
  await waitMaterialsReady(page, 2);

  await page.reload();
  await expect(page.getByText("Banca: FGV")).toBeVisible();
  await page.getByRole("link", { name: "Assuntos" }).click();
  await expect(page.getByRole("heading", { name: "Biologia" })).toBeVisible();
  await expect(page.getByText(/Fotossíntese/).first()).toBeVisible();
});
