import { expect, test } from "@playwright/test";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

test("praticar: teste rápido do ENEM, banco de erros, simulado por área, redação, professor e limites do Grátis", async ({ page }) => {
  test.setTimeout(240_000);
  const handle = `pratica.${uid}`;
  await signUp(page, { name: "Aluno Pratica", handle });

  // ── Teste rápido: questões reais do ENEM, 10 perguntas, 1 min cada
  await page.goto("/praticar");
  await page.getByRole("link", { name: /Teste rápido/ }).click();
  await expect(page.getByLabel("Nome do teste")).toHaveValue("Teste 1");
  await page.getByLabel("Nome do teste").fill("Meu primeiro teste");
  await page.getByLabel("Área").selectOption("matematica");
  await page.getByRole("radio", { name: "10", exact: true }).click();
  await page.getByRole("radio", { name: "1 min" }).click();
  await page.getByRole("button", { name: "Começar teste rápido" }).click();
  await expect(page).toHaveURL(/\/teste-rapido\/[^/]+$/, { timeout: 60_000 });
  await expect(page.getByText(/Pergunta 1 de 10/)).toBeVisible();
  const run = await sql<{ questionIds: string[] }>(`SELECT g."questionIds" FROM "GameRun" g JOIN "user" u ON u.id = g."userId" WHERE u.handle = $1`, [handle]);
  expect(run[0].questionIds.every((id) => /^enem-\d{4}-/.test(id))).toBe(true);
  const again = page.getByRole("link", { name: "Criar outro teste rápido" });
  for (let i = 0; i < 60 && !(await again.isVisible()); i++) {
    await page.locator("[data-option='1']:enabled").click({ timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  await expect(again).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Meu primeiro teste · 10 perguntas/)).toBeVisible();

  // ── Banco de erros
  await page.goto("/revisoes?filtro=erros");
  await expect(page.getByText("Resposta certa:").first()).toBeVisible();
  await page.getByRole("button", { name: "Entender a resposta certa" }).first().click();
  await expect(page.locator(".prose-study").first()).toBeVisible({ timeout: 30_000 });

  // ── Simulado ENEM de uma área (Matemática: 45 questões)
  await page.goto("/simulados/novo");
  await expect(page).toHaveURL(/\/simulados\/enem/);
  await page.getByRole("button", { name: /Matemática/ }).first().click();
  await expect(page.getByText(/45 questões · 150 min/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Começar simulado" }).click();
  await page.locator("[data-option='0']").click();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Entregar prova" }).click();
  await expect(page.getByText("Matemática e suas Tecnologias").first()).toBeVisible({ timeout: 60_000 });

  // ── Redação (tema do ENEM)
  await page.goto("/redacao/nova");
  await expect(page.getByText("Tema sorteado")).toBeVisible();
  await page.getByRole("radio", { name: "10 min" }).click();
  await page.getByRole("button", { name: /Começar a escrever/ }).click();
  const texto =
    "A educação é essencial para o desenvolvimento do país , e a gente vamos discutir isso. " +
    "haviam muitas escolas sem internet no interior, o que prejudica os alunos. ".repeat(3) +
    "Por isso, o governo deve investir em conectividade e formação de professores, pra que todos aprendam. ".repeat(3);
  await page.getByLabel("Seu texto").fill(texto);
  await page.getByRole("button", { name: "Enviar para correção" }).click();
  await expect(page.getByText("Critérios")).toBeVisible({ timeout: 60_000 });

  // ── Professor IA (sobre o ENEM, sem escolher preparação)
  await page.goto("/professor");
  await page.getByLabel("Mensagem").fill("O que é a fotossíntese?");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/Modo de demonstração|fotoss/i).last()).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/professor\?t=/);

  // ── Desempenho
  await page.goto("/desempenho");
  await expect(page.getByText("Acerto geral")).toBeVisible();

  // ── No Grátis: 1 simulado e 1 redação por mês (este aluno já fez os dele)
  await sql(`DELETE FROM "Subscription" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/simulados/enem");
  await page.getByRole("button", { name: /Matemática/ }).first().click();
  await expect(page.getByText(/Você já usou 1 simulado deste mês no plano Grátis/)).toBeVisible();
  await page.goto("/redacao/nova?tipo=portugues");
  await page.getByRole("button", { name: /Começar a escrever/ }).click();
  await page.getByLabel("Seu texto").fill(texto);
  await page.getByRole("button", { name: "Enviar para correção" }).click();
  await expect(page.getByText(/Você já usou 1 redação corrigida deste mês no plano Grátis/)).toBeVisible();
  await page.goto("/descanse");
  await expect(page.getByRole("heading", { name: "Hora de descansar" })).toBeVisible();
});
