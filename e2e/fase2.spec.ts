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

test("fase 2: teste rápido, banco de erros, simulado, redação, professor e desempenho", async ({ page }) => {
  test.setTimeout(240_000);
  const handle = `fase2.${uid}`;
  await signUp(page, { name: "Aluno Fase Dois", handle });
  await prepWithMaterial(page, "Biologia");

  // ── Teste rápido: nome, 10 perguntas, 10 s; o bonequinho pula (acerto) ou cai (erro)
  await page.goto("/praticar");
  await page.getByRole("link", { name: /Teste rápido/ }).click();
  await expect(page.getByLabel("Nome do teste")).toHaveValue("Teste 1");
  await page.getByLabel("Nome do teste").fill("Meu primeiro teste");
  await page.getByRole("radio", { name: "10", exact: true }).click();
  await page.getByRole("radio", { name: "10 s" }).click();
  await page.getByRole("button", { name: "Começar teste rápido" }).click();
  await expect(page).toHaveURL(/\/teste-rapido\/[^/]+$/, { timeout: 60_000 });
  await expect(page.getByText(/Pergunta 1 de/)).toBeVisible();
  const again = page.getByRole("link", { name: "Criar outro teste rápido" });
  for (let i = 0; i < 60 && !(await again.isVisible()); i++) {
    await page.locator("[data-option='1']:enabled").click({ timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  await expect(again).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Meu primeiro teste · 10 perguntas/)).toBeVisible();
  // não dá para refazer: abrir de novo mostra só o resultado
  await page.reload();
  await expect(again).toBeVisible();
  await expect(page.getByText(/Pergunta \d+ de/)).toHaveCount(0);

  // ── Banco de erros: ver a resposta certa e aprender com o material
  await page.goto("/revisoes?filtro=erros");
  await expect(page.getByText("Resposta certa:").first()).toBeVisible();
  await page.getByRole("button", { name: "Aprender o certo com o meu material" }).first().click();
  await expect(page.locator(".prose-study").first()).toBeVisible({ timeout: 30_000 });

  // ── Simulado
  await page.goto("/simulados/novo");
  await page.getByRole("button", { name: "30", exact: true }).click();
  await page.getByRole("button", { name: "30 minutos" }).click();
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
  await expect(page.getByText("Tema sorteado")).toBeVisible();
  await expect(page.getByText(/Recomendamos que você não use inteligência artificial/)).toBeVisible();
  await page.getByRole("button", { name: "Sortear outro" }).click();
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
  await page.goto("/redacao/nova?tipo=portugues");
  await expect(page.getByText("Proposta sorteada")).toBeVisible();
  await page.getByLabel("Seu texto").fill(texto);
  await page.getByRole("button", { name: "Enviar para correção" }).click();
  await expect(page.getByText(/limite de hoje: 1 redação/)).toBeVisible();
  await page.getByRole("link", { name: "Ver sugestões para descansar" }).click();
  await expect(page.getByRole("heading", { name: "Hora de descansar" })).toBeVisible();
  await expect(page.getByText("Ler o seu PDF")).toBeVisible();
  await expect(page.getByText("Fazer revisões")).toBeVisible();
});
