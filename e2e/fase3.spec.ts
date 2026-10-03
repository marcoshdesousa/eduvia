import { expect, test, type Page } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { generateLessons, signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

async function newPrep(page: Page, title: string, pdf: boolean) {
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill(title);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);
  if (pdf) {
    await page.locator('input[type="file"][multiple]').setInputFiles({ name: "apostila.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(10) });
    await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 90_000 });
    await generateLessons(page);
  }
}

test("fase 3: grupo com convite, mural, compartilhamento, simulado com ranking, conquistas e perfil", async ({ browser }) => {
  test.setTimeout(240_000);
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const ha = `dona.${uid}`;
  const hb = `membro.${uid}`;
  await signUp(a, { name: "Ana Dona", handle: ha });
  await signUp(b, { name: "Beto Membro", handle: hb });

  // Ana: preparação com material e um simulado (gera questões)
  await newPrep(a, "Biologia da Ana", true);
  await a.goto("/simulados/novo");
  await a.getByRole("button", { name: "30", exact: true }).click();
  await a.getByRole("button", { name: "Montar simulado" }).click();
  await expect(a.getByRole("button", { name: "Começar simulado" })).toBeVisible({ timeout: 90_000 });

  // Ana cria o grupo e convida o Beto pelo @
  await a.goto("/grupos");
  await a.getByLabel("Nome do grupo").fill("Turma de Biologia");
  await a.getByRole("button", { name: "Criar grupo" }).click();
  await expect(a.getByRole("heading", { name: "Turma de Biologia" })).toBeVisible();
  await a.getByLabel("@ de quem convidar").fill("ninguem.existe.xyz");
  await expect(a.getByText("Ninguém com esse @.")).toBeVisible();
  await a.getByLabel("@ de quem convidar").fill(hb);
  await expect(a.getByText("Beto Membro")).toBeVisible();
  await a.getByRole("button", { name: "Convidar" }).click();
  await expect(a.getByText(`Convite enviado para @${hb}.`)).toBeVisible();

  // Beto recebe a notificação e aceita
  await b.goto("/inicio");
  await expect(b.getByRole("link", { name: /Notificações: 1 não lidas/ }).first()).toBeVisible();
  await b.goto("/notificacoes");
  await expect(b.getByText(`@${ha} convidou você para o grupo "Turma de Biologia"`)).toBeVisible();
  await b.goto("/grupos");
  await expect(b.getByText("Você foi convidado")).toBeVisible();
  await b.getByRole("button", { name: "Aceitar" }).click();
  await expect(b).toHaveURL(/\/grupos\/[^/?]+/);

  // Carla entra pelo código do grupo
  const code = (await sql<{ code: string }>(`SELECT code FROM "Group" WHERE name = 'Turma de Biologia' ORDER BY "createdAt" DESC LIMIT 1`))[0].code;
  await expect(a.getByText(code)).toBeVisible();
  const c = await (await browser.newContext()).newPage();
  await signUp(c, { name: "Carla Código", handle: `carla.${uid}` });
  await c.goto("/grupos");
  await c.getByLabel("Código do grupo").fill("ZZZZZZ");
  await c.getByRole("button", { name: "Entrar no grupo" }).click();
  await expect(c.getByText("Não encontramos nenhum grupo com esse código.")).toBeVisible();
  await c.getByLabel("Código do grupo").fill(code.toLowerCase());
  await c.getByRole("button", { name: "Entrar no grupo" }).click();
  await expect(c).toHaveURL(/\/grupos\/[^/?]+/);
  await expect(c.getByRole("heading", { name: "Turma de Biologia" })).toBeVisible();
  await c.close();
  // Carla sai (o resto do teste conta só Ana e Beto)
  await sql(`DELETE FROM "GroupMember" WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [`carla.${uid}`]);

  // mural
  await b.getByLabel("Mensagem para o grupo").fill("Oi, pessoal!");
  await b.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(b.getByText("Oi, pessoal!")).toBeVisible();
  const groupUrl = b.url().split("?")[0];
  await a.goto(groupUrl);
  await expect(a.getByText("Oi, pessoal!")).toBeVisible({ timeout: 10_000 });

  // Ana compartilha material, lista de questões e simulado
  await a.goto(`${groupUrl}?aba=compartilhados`);
  for (const [i, type] of (["MATERIAL", "QUESTION_SET", "EXAM"] as const).entries()) {
    await a.getByLabel("Tipo").selectOption(type);
    await a.getByLabel("O que compartilhar").selectOption({ index: 1 });
    await a.getByRole("button", { name: "Compartilhar" }).click();
    await expect(a.getByText("Compartilhado com o grupo!")).toBeVisible();
    await expect(a.getByRole("button", { name: "Remover" })).toHaveCount(i + 1);
  }

  // Beto adiciona o material à própria preparação (sem reprocessar)
  await newPrep(b, "Biologia do Beto", false);
  await b.goto(`${groupUrl}?aba=compartilhados`);
  await b.getByRole("button", { name: "Adicionar à minha preparação" }).click();
  await b.getByRole("button", { name: "Adicionar", exact: true }).click();
  await expect(b.getByText(/Adicionado a "Biologia do Beto"/)).toBeVisible();

  // Beto pratica a lista de questões
  await b.getByRole("link", { name: "Praticar" }).first().click();
  await expect(b.getByText(/Os erros entram no seu banco de erros/)).toBeVisible();
  const first = b.locator("[data-question]").first();
  await first.locator("button").first().click();
  await first.getByRole("button", { name: "Responder" }).click();
  await expect(first.getByText("Explicação:")).toBeVisible();

  // Beto faz o simulado do grupo e vê o ranking
  await b.goto(`${groupUrl}?aba=compartilhados`);
  await b.getByRole("link", { name: "Fazer simulado" }).click();
  await b.getByRole("button", { name: "Começar simulado" }).click();
  await expect(b.getByText(/Questão 1 de/)).toBeVisible();
  const total = await b.getByRole("button", { name: /Ir para a questão/ }).count();
  for (let i = 0; i < total; i++) {
    await b.getByRole("button", { name: `Ir para a questão ${i + 1}`, exact: true }).click();
    await b.locator("[data-option='0']").click();
  }
  await b.getByRole("button", { name: "Entregar prova" }).click();
  await expect(b.getByText("Ranking — Turma de Biologia")).toBeVisible({ timeout: 30_000 });
  await expect(b.locator("ol").getByText(`@${hb}`)).toBeVisible();

  // material importado ficou pronto na preparação do Beto
  await b.goto("/preparacoes");
  await b.getByRole("link", { name: /Biologia do Beto/ }).click();
  await b.getByRole("link", { name: "Materiais", exact: true }).click();
  await expect(b.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 60_000 });
  await generateLessons(b);

  // conquista de grupo e perfil
  await b.goto("/perfil");
  await expect(b).toHaveURL(new RegExp(`/u/${hb.replace(".", "\\.")}`));
  await expect(b.getByText("Juntos vamos mais longe")).toBeVisible();
  await expect(b.getByText(/Conquistada em/).first()).toBeVisible();

  // ranking de XP do grupo
  await a.goto(`${groupUrl}?aba=ranking`);
  await expect(a.getByText("XP da semana")).toBeVisible();
  await expect(a.locator("ol").getByText(`@${hb}`)).toBeVisible();

  // torneio de XP: Ana cria; Beto ganha XP durante o torneio e fica em 1º
  await a.goto(`${groupUrl}?aba=torneios`);
  await a.getByLabel("Nome do torneio").fill("Maratona de teste");
  await a.getByLabel("Duração").selectOption("7");
  await a.getByRole("button", { name: "Começar torneio" }).click();
  await expect(a.getByText("🏆 Maratona de teste")).toBeVisible();
  await sql(`INSERT INTO "XpEvent" (id, "userId", amount, reason, "createdAt") SELECT 'xp_' || md5(random()::text), id, 50, 'teste', now() FROM "user" WHERE handle = $1`, [hb]);
  await b.goto(`${groupUrl}?aba=torneios`);
  const leader = b.getByRole("list", { name: "Classificação do torneio" }).getByRole("listitem").first();
  await expect(leader).toContainText(`@${hb}`);
  await expect(leader).toContainText("50 XP");
  await expect(leader).toContainText("🥇");
  await expect(b.getByRole("button", { name: "Encerrar" })).toHaveCount(0); // só dono/admin encerra

  // perfil privado
  await b.goto("/configuracoes");
  await b.getByLabel("Perfil", { exact: true }).selectOption("PRIVATE");
  await b.getByRole("button", { name: "Salvar" }).click();
  await expect(b.getByText("Dados salvos.")).toBeVisible();
  await a.goto(`/u/${hb}`);
  await expect(a.getByText("Este perfil é privado.")).toBeVisible();

  // Ana torna o Beto admin e depois o Beto sai do grupo
  await a.goto(`${groupUrl}?aba=membros`);
  a.on("dialog", (d) => d.accept());
  await a.getByRole("button", { name: "Tornar admin" }).click();
  await expect(a.getByText("Admin", { exact: true })).toBeVisible();
  b.on("dialog", (d) => d.accept());
  await b.goto(`${groupUrl}?aba=membros`);
  await b.getByRole("button", { name: "Sair do grupo" }).click();
  await expect(b).toHaveURL(/\/grupos$/);
});
