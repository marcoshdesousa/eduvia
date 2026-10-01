import { expect, test, type Page } from "@playwright/test";
import { EDITAL, makeStudyPdf } from "./fixtures";
import { signUp, sql } from "./helpers";

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
  // só a primeira aula está liberada; as próximas esperam 75% na anterior
  await expect(page.getByText("Bloqueada").first()).toBeVisible();
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
  // 1ª tentativa: erra tudo de propósito → nota abaixo de 75% → a próxima aula não libera
  await answerRound(page, false);
  await expect(page.getByText("Quase lá! Você ainda não passou nesta aula.")).toBeVisible();
  await expect(page.getByText(/Você precisa de pelo menos 75%/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Próxima aula" })).toHaveCount(0);

  // refaz a aula e acerta → aprovada e a próxima aula libera
  await page.getByRole("button", { name: /Reestudar e refazer a aula/ }).click();
  await expect(page.getByRole("button", { name: /Já li|Continuar/ })).toBeVisible();
  await expect(page.getByText(/Sei que pode parecer muito ou pouco tempo/)).toBeVisible();
  await answerRound(page, true);
  await expect(page.getByText("Aula aprovada! Próxima aula liberada.")).toBeVisible();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await expect(page.getByText(/Você escolheu 10 min e terminou em|Você focou por/)).toBeVisible();
  await expect(page.getByText(/Sei que pode parecer muito ou pouco tempo/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Refazer para melhorar a nota/ })).toBeVisible();

  // início mostra progresso e sequência
  await page.goto("/inicio");
  await expect(page.getByText("O que fazer hoje")).toBeVisible();
  await expect(page.getByText(/1\/\d+ sessões/)).toBeVisible();
  // sequência estilo Duolingo: foguinho aceso depois de estudar hoje
  await expect(page.getByRole("region", { name: "Sequência de estudo" })).toContainText("1dia seguido");
  await expect(page.getByText("dia seguido")).toBeVisible();
  await expect(page.getByText(/Foguinho aceso!/)).toBeVisible();

  // errou na 1ª tentativa e acertou ao refazer: as questões saíram do banco de erros
  await page.goto("/revisoes?filtro=erros");
  await expect(page.getByText(/Errou 1x/)).toHaveCount(0);
  const errs = await sql<{ n: number }>(`SELECT count(*)::int AS n FROM "Attempt" a JOIN "user" u ON u.id = a."userId" WHERE u.handle = $1 AND a."isCorrect" = false`, [handle]);
  expect(errs[0].n).toBeGreaterThan(0);

  // aula perdida ontem: continua no dia dela ("Atrasada"), não some nem vira "Remarcada", e vem antes das de hoje
  await sql(
    `UPDATE "PlannedSession" SET date = (now() AT TIME ZONE 'America/Sao_Paulo')::date - 1 WHERE id = (
       SELECT ps.id FROM "PlannedSession" ps JOIN "StudyPlan" sp ON sp.id = ps."planId" JOIN "Preparation" p ON p.id = sp."preparationId" JOIN "user" u ON u.id = p."userId"
       WHERE u.handle = $1 AND ps.status = 'PENDING' AND ps.kind = 'STUDY' ORDER BY ps.date, ps."order" LIMIT 1)`,
    [handle],
  );
  await sql(`UPDATE "Preparation" SET "lastReplanDate" = NULL WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/inicio");
  await expect(page.getByText(/aula\(s\) atrasada\(s\)/)).toBeVisible();
  await expect(page.getByText(/Atrasada \(/).first()).toBeVisible();
  await expect(page.getByText("Remarcada")).toHaveCount(0);
  const late = await sql<{ n: number }>(
    `SELECT count(*)::int AS n FROM "PlannedSession" ps JOIN "StudyPlan" sp ON sp.id = ps."planId" JOIN "Preparation" p ON p.id = sp."preparationId" JOIN "user" u ON u.id = p."userId"
     WHERE u.handle = $1 AND ps.status = 'MISSED'`,
    [handle],
  );
  expect(late[0].n).toBe(0);

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

/** Responde a sessão inteira: certo (pega o gabarito no banco) ou errado de propósito. */
async function answerRound(page: Page, correct: boolean) {
  await page.getByRole("button", { name: /Já li|Continuar/ }).click();
  const answerOf = async (card: ReturnType<Page["locator"]>) => {
    const id = await card.getAttribute("data-question");
    return (await sql<{ correctAnswer: string }>(`SELECT "correctAnswer" FROM "Question" WHERE id = $1`, [id]))[0].correctAnswer;
  };
  const recall = page.getByPlaceholder("Escreva com suas palavras o que você lembra...");
  while (await recall.count()) {
    const id = await page.locator("[data-question]").filter({ has: recall.first() }).first().getAttribute("data-question");
    const card = page.locator(`[data-question="${id}"]`);
    await recall.first().fill(correct ? await answerOf(card) : "Não sei direito");
    await card.getByRole("button", { name: "Enviar resposta" }).click();
    await expect(card.getByText("Resposta-modelo", { exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  const cards = page.locator("[data-question]");
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  for (let i = 0; i < total; i++) {
    const card = cards.nth(i);
    const right = Number(await answerOf(card));
    const options = await card.locator("button").count() - 1; // o último é "Responder"
    await card.locator("button").nth(correct ? right : (right + 1) % options).click();
    await card.getByRole("button", { name: "Responder" }).click();
    await expect(card.getByText("Explicação:")).toBeVisible();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Concluir e ver a nota" }).click();
}
