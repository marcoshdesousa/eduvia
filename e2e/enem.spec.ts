import { expect, test, type Page } from "@playwright/test";
import { signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

/** Responde as questões da aula aberta: certas (ou erradas, se `wrong`), consultando o gabarito no banco. */
async function answerAll(page: Page, handle: string, wrong = false) {
  const [s] = await sql<{ id: string; questionIds: string[] }>(
    `SELECT s.id, s."questionIds" FROM "StudySession" s JOIN "user" u ON u.id = s."userId" WHERE u.handle = $1 ORDER BY s."startedAt" DESC LIMIT 1`,
    [handle],
  );
  const qs = await sql<{ id: string; correctAnswer: string }>(`SELECT id, "correctAnswer" FROM "Question" WHERE id = ANY($1)`, [s.questionIds]);
  const right = new Map(qs.map((q) => [q.id, Number(q.correctAnswer)]));
  for (const id of s.questionIds) {
    const card = page.locator(`[data-question="${id}"]`);
    const pick = wrong ? (right.get(id)! + 1) % 5 : right.get(id)!;
    await card.locator("button").nth(pick).click();
    await card.getByRole("button", { name: "Responder" }).click();
    await expect(card.getByText(wrong ? /Errou/ : "Acertou")).toBeVisible();
  }
  return s.questionIds;
}

test("Estudar ENEM: preparação fixa, aulas com 75%, refazer e simulado do 2º dia", async ({ page }) => {
  const handle = `aluno.enem.${uid}`;
  await signUp(page, { name: "Aluno ENEM", handle });

  // a preparação fixa aparece para todo mundo
  await page.goto("/preparacoes");
  await page.getByRole("link", { name: "Estudar ENEM" }).click();
  await expect(page).toHaveURL(/\/enem$/);
  await expect(page.getByText("Como estudar aqui")).toBeVisible();
  await expect(page.getByRole("button", { name: "Estudar geral" })).toBeVisible();
  await page.getByRole("link", { name: "Matéria Língua Portuguesa" }).click();
  await expect(page.getByText("Bloqueada: tire 75% na aula anterior").first()).toBeVisible();

  // aula 1: texto + 10 questões reais; errando tudo, não passa
  await page.getByRole("link", { name: "Começar" }).first().click();
  await page.getByRole("button", { name: "Começar aula" }).click();
  await expect(page.getByRole("heading", { name: "Interpretação de texto: como o ENEM pergunta" })).toBeVisible();
  await expect(page.getByText("Ler é a habilidade mais cobrada do ENEM")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  const first = await answerAll(page, handle, true);
  expect(first).toHaveLength(10);
  expect(first.every((id) => id.startsWith("enem-"))).toBe(true);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
  await expect(page.getByText("Quase lá! Você ainda não passou nesta aula.")).toBeVisible();

  // refazer: vêm outras 10 questões; acertando tudo, passa e libera a próxima
  await page.getByRole("button", { name: /Reestudar e refazer a aula/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  const second = await answerAll(page, handle);
  expect(second.filter((id) => first.includes(id)).length).toBeLessThan(3);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
  await expect(page.getByText("Aula aprovada! Próxima aula liberada.")).toBeVisible();
  await page.getByRole("link", { name: "Próxima aula" }).click();
  await expect(page.getByRole("heading", { name: "Gêneros textuais e tipos de texto" })).toBeVisible();
  await page.goto("/enem/portugues");
  await expect(page.getByText(/Melhor nota: 100%/)).toBeVisible();
  await expect(page.getByText("Aprovada")).toBeVisible();

  // os erros foram para o banco de erros (filtro "Estudar ENEM")
  await page.goto(`/revisoes?filtro=erros&prep=enem`);
  await expect(page.getByText(/Questão \d+ do ENEM \d{4}/).first()).toBeVisible();

  // simulado ENEM do 2º dia: 90 questões, 5 horas, entrega e nota por área
  await page.goto("/simulados");
  await page.getByRole("link", { name: "Simulado ENEM" }).click();
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
