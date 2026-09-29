import { expect, test, type Page } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

async function prepWithMaterial(page: Page, title: string) {
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill(title);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "biologia.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(12) });
  await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 90_000 });
}

test("fase 2: jogo, simulado, redação, professor e desempenho", async ({ page }) => {
  test.setTimeout(240_000);
  const handle = `fase2.${uid}`;
  await signUp(page, { name: "Aluno Fase Dois", handle });
  await prepWithMaterial(page, "Biologia");

  // ── Jogo da cobrinha
  await page.goto("/praticar");
  await page.getByRole("link", { name: /Jogos/ }).click();
  await page.getByRole("link", { name: "Jogar" }).click();
  await page.getByLabel("Erros permitidos").selectOption("1");
  await page.getByRole("button", { name: "Começar" }).click();
  await expect(page.getByRole("img", { name: /A cobra está/ })).toBeVisible({ timeout: 60_000 });
  // responde sempre a 2ª alternativa até o jogo acabar (erro, cobra ou fim das perguntas)
  const result = page.getByText(/pontos · recorde/);
  for (let i = 0; i < 60 && !(await result.isVisible()); i++) {
    await page.locator("[data-option='1']:enabled").click({ timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await expect(result).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Tempo médio")).toBeVisible();

  // ── Simulado
  await page.goto("/simulados/novo");
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "Montar simulado" }).click();
  await page.getByRole("button", { name: "Começar simulado" }).click({ timeout: 90_000 });
  await expect(page.getByText(/Questão 1 de/)).toBeVisible();
  const total = await page.getByRole("button", { name: /Ir para a questão/ }).count();
  for (let i = 0; i < total; i++) {
    await page.getByRole("button", { name: `Ir para a questão ${i + 1}`, exact: true }).click();
    await page.locator("[data-option='0']").click();
  }
  await expect(page.getByText(`Respondidas: ${total}/${total}`)).toBeVisible();
  await page.getByRole("button", { name: "Entregar prova" }).click();
  await expect(page.getByText("Gabarito comentado")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Desempenho por disciplina")).toBeVisible();
  await expect(page.getByText("Nota", { exact: true })).toBeVisible();

  // ── Redação
  await page.goto("/redacao/nova");
  await page.getByRole("button", { name: "Sugerir" }).click();
  await expect(page.locator("#theme")).not.toHaveValue("");
  const texto =
    "A educação é essencial para o desenvolvimento do país , e a gente vamos discutir isso. " +
    "haviam muitas escolas sem internet no interior, o que prejudica os alunos. ".repeat(3) +
    "Por isso, o governo deve investir em conectividade e formação de professores, pra que todos aprendam. ".repeat(3);
  await page.getByLabel("Seu texto").fill(texto);
  await page.getByRole("button", { name: "Enviar para correção" }).click();
  await expect(page.getByText("Critérios")).toBeVisible({ timeout: 60_000 });
  await expect(page.locator("mark").first()).toBeVisible();
  await page.locator("mark").first().click();
  await expect(page.getByText("Pontos fortes")).toBeVisible();

  // ── Professor IA
  await page.goto("/professor");
  await page.getByLabel("Mensagem").fill("O que é a fotossíntese?");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/Modo de demonstração|fotoss/i).last()).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/professor\?t=/);
  await page.reload();
  await expect(page.locator("p:visible", { hasText: "O que é a fotossíntese?" }).first()).toBeVisible();

  // ── Desempenho
  await page.goto("/desempenho");
  await expect(page.getByText("Acerto geral")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Por disciplina" })).toBeVisible();
  await expect(page.getByText(/questões respondidas/)).toBeVisible();

  // ── Sem assinatura (plano Grátis): simulado bloqueado; limite do dia de redação leva ao "Descanse"
  await sql(`DELETE FROM "Subscription" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/simulados/novo");
  await page.getByRole("button", { name: "Montar simulado" }).click();
  await expect(page.getByText(/Simulados não fazem parte do plano Grátis/)).toBeVisible();
  await page.goto("/redacao/nova");
  await page.locator("#theme").fill("Tema livre");
  await page.getByLabel("Seu texto").fill(texto);
  await page.getByRole("button", { name: "Enviar para correção" }).click();
  await expect(page.getByText(/limite de hoje: 1 redação/)).toBeVisible();
  await page.getByRole("link", { name: "Ver sugestões para descansar" }).click();
  await expect(page.getByRole("heading", { name: "Hora de descansar" })).toBeVisible();
  await expect(page.getByText("Ler o seu PDF")).toBeVisible();
  await expect(page.getByText("Fazer revisões")).toBeVisible();
});
