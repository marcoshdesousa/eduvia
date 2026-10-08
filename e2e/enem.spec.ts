import { expect, test, type Page } from "@playwright/test";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

/**
 * Responde o quiz da aula aberta (as de escrever primeiro, depois as de marcar): certas ou erradas (`wrong`),
 * consultando o gabarito no banco. Começa logo depois do texto da aula.
 */
async function answerAll(page: Page, wrong = false) {
  await page.getByRole("button", { name: /Já li|Continuar/ }).first().click();
  // cada etapa mostra as perguntas dela (primeiro as de escrever, depois as de marcar)
  const onScreen = async () => {
    await expect(page.locator("[data-question]").first()).toBeAttached();
    const ids = await page.locator("[data-question]").evaluateAll((els) => els.map((e) => e.getAttribute("data-question")!));
    const qs = await sql<{ id: string; type: string; correctAnswer: string }>(`SELECT id, type, "correctAnswer" FROM "Question" WHERE id = ANY($1)`, [ids]);
    const byId = new Map(qs.map((q) => [q.id, q]));
    return ids.map((id) => byId.get(id)!);
  };
  let qs = await onScreen();
  const open = qs.filter((q) => q.type === "OPEN_RECALL").map((q) => q.id);
  if (open.length) {
    for (const q of qs) {
      const card = page.locator(`[data-question="${q.id}"]`);
      await card.locator("textarea").fill(wrong ? "não sei" : q.correctAnswer);
      await card.getByRole("button", { name: "Enviar resposta" }).click();
      await expect(card.getByText("Resposta-modelo")).toBeVisible();
    }
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(`[data-question="${open[0]}"]`)).toHaveCount(0);
    qs = await onScreen();
  }
  const choice = qs.map((q) => q.id);
  for (const q of qs) {
    const card = page.locator(`[data-question="${q.id}"]`);
    const right = Number(q.correctAnswer);
    // o cronômetro fixo no topo pode cobrir a alternativa: clica direto no elemento
    await card.locator("button").nth(wrong ? (right + 1) % 5 : right).dispatchEvent("click");
    await card.getByRole("button", { name: "Responder" }).dispatchEvent("click");
    await expect(card.getByText(wrong ? /Errou/ : "Acertou")).toBeVisible();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  return { open, choice };
}

test("Estudar ENEM: aulas com quiz e 75%, refazer, banco de erros e simulado do 2º dia", async ({ page }) => {
  const handle = `aluno.enem.${uid}`;
  await signUp(page, { name: "Aluno ENEM", handle });

  // o menu leva direto ao Estudar ENEM
  await page.getByRole("link", { name: "Estudar", exact: true }).click();
  await expect(page).toHaveURL(/\/enem$/);
  await expect(page.getByText("Como estudar aqui")).toBeVisible();
  await expect(page.getByRole("link", { name: "Matéria Redação" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Estudar geral" })).toBeVisible();
  await page.getByRole("link", { name: "Matéria Língua Portuguesa" }).click();
  await expect(page.getByText("Bloqueada: tire 75% na aula anterior").first()).toBeVisible();

  // aula 1: texto + quiz; errando tudo, não passa
  await page.getByRole("link", { name: "Começar" }).first().click();
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await expect(page.getByRole("heading", { name: "Interpretação de texto: como o ENEM pergunta" })).toBeVisible();
  await expect(page.getByText("Ler é a habilidade mais cobrada do ENEM")).toBeVisible();
  const first = await answerAll(page, true);
  expect(first.choice).toHaveLength(5);
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
  await expect(page.getByText("Quase lá! Você ainda não passou nesta aula.")).toBeVisible();

  // refazer: acertando tudo, passa e libera a próxima
  await page.getByRole("button", { name: /Reestudar e refazer a aula/ }).click();
  await page.getByRole("button", { name: /Refazer em \d+ min/ }).click();
  await answerAll(page);
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
  await expect(page.getByText("Aula aprovada! Próxima aula liberada.")).toBeVisible();
  await page.getByRole("link", { name: "Próxima aula" }).click();
  await expect(page.getByRole("heading", { name: "Gêneros textuais e tipos de texto" })).toBeVisible();
  await page.goto("/enem/portugues");
  await expect(page.getByText(/Melhor nota: 100%/)).toBeVisible();
  await expect(page.getByText("Aprovada")).toBeVisible();

  // Redação: quiz próprio (5 de marcar + 1 de escrever, corrigida pela IA) e atividade de redação
  await page.goto("/enem/redacao");
  await page.getByRole("link", { name: "Começar" }).first().click();
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await expect(page.getByRole("heading", { name: "Como é a redação do ENEM" })).toBeVisible();
  await expect(page.getByText(/5 perguntas de marcar e 1 de escrever/)).toHaveCount(0);
  const quiz = await answerAll(page);
  expect(quiz.choice).toHaveLength(5);
  expect(quiz.open).toHaveLength(1);
  expect(quiz.choice.every((id) => id.startsWith("enem-quiz-redacao-1-m"))).toBe(true);
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
  await expect(page.getByText("Aula aprovada! Próxima aula liberada.")).toBeVisible();
  // a 13ª aula de Redação (Prática: tecnologia e saúde mental) tem uma redação para escrever
  const n = "13";
  await sql(
    `INSERT INTO "StudySession" (id, "userId", "topicId", kind, "questionIds", "passedAt", "bestScore", "completedAt")
     SELECT 'e2e_r_' || u.id || '_' || g, u.id, 'enem-a-redacao-' || g, 'STUDY', '{}', now(), 1, now() FROM "user" u, generate_series(2, $2::int - 1) g WHERE u.handle = $1`,
    [handle, Number(n)],
  );
  await page.goto(`/enem/aula/enem-a-redacao-${n}`);
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await expect(page.getByText("Atividade de redação desta aula")).toBeVisible();
  await page.getByRole("link", { name: "Escrever a redação" }).click();
  await expect(page.getByText("O impacto do uso excessivo de celulares na saúde mental dos adolescentes").first()).toBeVisible();

  // os erros foram para o banco de erros
  await page.goto(`/revisoes?filtro=erros`);
  await expect(page.getByText("Resposta certa:").first()).toBeVisible();

  // início: próxima aula e progresso
  await page.goto("/inicio");
  await expect(page.getByText("Próxima aula")).toBeVisible();
  await expect(page.getByText(/1\/\d+ aulas/).first()).toBeVisible();

  // simulado ENEM do 2º dia: 90 questões, 5 horas, entrega e nota por área
  await page.goto("/simulados");
  await page.getByRole("link", { name: "Simulado ENEM" }).first().click();
  await page.getByRole("button", { name: "Fazer o 2º dia" }).click();
  await expect(page.getByRole("heading", { name: "Simulado ENEM — 2º dia" })).toBeVisible();
  await expect(page.getByText(/90 questões · 300 min/)).toBeVisible();
  await page.getByRole("button", { name: "Começar simulado" }).click();
  await expect(page.getByText(/4:59:\d\d|5:00:00/)).toBeVisible();
  await expect(page.getByText(/Questão 1 de 90/)).toBeVisible();
  await page.locator("[data-option='0']").click();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Entregar prova" }).click();
  await expect(page.getByText("Ciências da Natureza e suas Tecnologias").first()).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Matemática e suas Tecnologias").first()).toBeVisible();
});
