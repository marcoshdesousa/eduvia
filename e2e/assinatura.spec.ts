import { expect, test } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { GEMINI_KEY, signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

// Requer BILLING_ENFORCED diferente de "false" e AI_MODE=mock no servidor.
test("plano Grátis → admin libera o Básico; chave do Gemini obrigatória", async ({ page, browser }) => {
  const handle = `aluno.pago.${uid}`;
  await signUp(page, { name: "Aluno Pagante", handle, plan: "gratis" });

  // plano Grátis: aviso no topo e links do WhatsApp com a mensagem pronta (7 e 30 dias)
  await expect(page.getByText(/Plano Grátis \(teste\)/)).toBeVisible();
  await page.getByRole("link", { name: "Assinar", exact: true }).click();
  await expect(page).toHaveURL(/\/assinatura/);
  const week = decodeURIComponent((await page.getByRole("link", { name: /Assinar Básico semanal pelo WhatsApp/ }).getAttribute("href"))!);
  const month = decodeURIComponent((await page.getByRole("link", { name: /Assinar Básico mensal pelo WhatsApp/ }).getAttribute("href"))!);
  expect(week).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(week).toContain("plano Básico semanal (7 dias)");
  expect(week).toContain("7,00");
  expect(month).toContain("plano Básico mensal (30 dias)");
  expect(month).toContain("15,00");
  expect(month).toContain(`@${handle}`);
  // faixas de planos: o Ilimitado (R$ 80) aparece com tudo à vontade; os outros planos só têm opção mensal
  await expect(page.getByRole("link", { name: /Assinar Ilimitado mensal pelo WhatsApp/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Assinar Ilimitado semanal/ })).toHaveCount(0);
  await expect(page.getByText("35 guias de estudo por mês")).toBeVisible();
  await expect(page.getByText("PDFs e páginas sem limite").first()).toBeVisible();

  // Minha IA: chave conectada (só o final aparece)
  await page.goto("/minha-ia");
  await expect(page.getByText("✅ Conectada")).toBeVisible();
  await expect(page.getByText(`…${GEMINI_KEY.slice(-4)}`, { exact: true })).toBeVisible();

  // sem chave, o app leva para "Conecte sua IA"
  await sql(`UPDATE "user" SET "geminiKey" = NULL WHERE handle = $1`, [handle]);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/conectar-ia/);
  await page.getByLabel("Chave da API do Gemini").fill("curta");
  await page.getByRole("button", { name: "Conectar IA" }).click();
  await expect(page.getByText(/não parece uma chave do Gemini/)).toBeVisible();
  await page.getByLabel("Chave da API do Gemini").fill(GEMINI_KEY);
  await page.getByRole("button", { name: "Conectar IA" }).click();
  await expect(page).toHaveURL(/\/inicio/);

  // Grátis: 1 preparação
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Primeira");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page).toHaveURL(/\/preparacoes\/(?!nova)[^/?]+/);
  await page.goto("/preparacoes/nova");
  await page.getByRole("button", { name: /Outro \/ estudo livre/ }).click();
  await page.getByLabel("Nome da preparação").fill("Segunda");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar e enviar materiais" }).click();
  await expect(page.getByText(/Você já criou 1 de 1 guia de estudo este mês/)).toBeVisible();

  // Grátis: só 1 personagem feminino e 1 masculino por categoria
  await page.goto("/configuracoes");
  await expect(page.getByRole("radio", { name: "Teia", exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Capitão Escudo (só para assinantes)" })).toBeVisible();
  await page.getByRole("tab", { name: "Princesas" }).click();
  await expect(page.getByRole("radio", { name: "Princesa do Gelo", exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Princesa da Torre (só para assinantes)" })).toBeVisible();

  // admin confirma o pagamento e libera o Eduvia por 30 dias
  const admin = await (await browser.newContext()).newPage();
  await signUp(admin, { name: "Admin Teste", handle: `admin.${uid}` });
  await sql(`UPDATE "user" SET "isAdmin" = true WHERE handle = $1`, [`admin.${uid}`]);
  await admin.goto(`/admin?q=${handle}`);
  await expect(admin.getByText("IA conectada", { exact: true })).toBeVisible();
  admin.on("dialog", (d) => d.accept());
  await admin.getByLabel("Período").selectOption("MONTH");
  await admin.getByRole("button", { name: "Liberar" }).click();
  await expect(admin.getByText(/Básico mensal até/)).toBeVisible();
  await admin.goto("/admin?aba=planos");
  await expect(admin.getByRole("button", { name: "Salvar" }).first()).toBeVisible();
  await admin.goto("/admin?aba=ia");
  await expect(admin.getByText("Alunos que mais usaram")).toBeVisible();

  // redes sociais: o admin cadastra e o botão aparece no rodapé da página inicial
  await admin.goto("/admin?aba=site");
  await admin.getByLabel("Instagram").fill("@eduvia.teste");
  await admin.getByRole("button", { name: "Salvar redes sociais" }).click();
  await expect(admin.getByText(/Redes sociais salvas/)).toBeVisible();
  const visitor = await (await browser.newContext()).newPage();
  await visitor.goto("/");
  await expect(visitor.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://instagram.com/eduvia.teste");
  await expect(visitor.getByRole("link", { name: "TikTok" })).toHaveCount(0);
  await visitor.getByText("Por que vocês pedem o CPF?").click();
  await expect(visitor.getByText(/uma conta por pessoa/)).toBeVisible();
  await visitor.close();
  await admin.goto("/admin?aba=site");
  await admin.getByLabel("Instagram").fill("");
  await admin.getByRole("button", { name: "Salvar redes sociais" }).click();
  await expect(admin.getByText(/Redes sociais salvas/)).toBeVisible();

  // suporte por chamados: aluno abre, admin responde e finaliza; chamado finalizado não aceita mensagens
  await page.goto("/suporte");
  await page.getByLabel("Tipo").selectOption("Dúvida");
  await page.getByLabel("Mensagem").fill("Como troco minha chave do Gemini?");
  await page.getByRole("button", { name: "Abrir chamado" }).click();
  await expect(page).toHaveURL(/\/suporte\/[^/]+$/);
  await expect(page.getByText("Como troco minha chave do Gemini?")).toBeVisible();
  await page.getByLabel("Mensagem").fill("Pode me ajudar?");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/Mensagem enviada/)).toBeVisible();
  await admin.goto("/admin?aba=suporte");
  await admin.getByRole("link", { name: `@${handle}` }).first().click();
  await expect(admin).toHaveURL(/chamado=/);
  await expect(admin.getByText("Pode me ajudar?")).toBeVisible();
  await admin.getByLabel("Mensagem").fill("É em Ajustes → Chave de acesso.");
  await admin.getByRole("button", { name: "Enviar" }).click();
  await expect(admin.getByText(/Resposta enviada/)).toBeVisible();
  await admin.getByRole("button", { name: "Finalizar chamado" }).click();
  await expect(admin.getByText(/Chamado finalizado. O aluno não pode mais/)).toBeVisible();
  await page.reload();
  await expect(page.getByText("É em Ajustes → Chave de acesso.")).toBeVisible();
  await expect(page.getByText(/Este chamado foi finalizado/)).toBeVisible();
  await expect(page.getByLabel("Mensagem")).toHaveCount(0);

  // foto de perfil e nome (o @ não muda)
  await page.goto("/configuracoes");
  await page.getByRole("tab", { name: "Halloween" }).click();
  await page.getByRole("radio", { name: "Lobisomem" }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Aluno Pagante Silva");
  await expect(page.locator("#handle")).toBeDisabled();
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByText("Dados salvos.")).toBeVisible();
  const saved = await sql<{ avatar: string; name: string; handle: string }>(`SELECT avatar, name, handle FROM "user" WHERE handle = $1`, [handle]);
  expect(saved[0]).toEqual({ avatar: "m-lobisomem", name: "Aluno Pagante Silva", handle });

  // aluno passa a ter o plano Básico
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Básico")).toBeVisible();
  await expect(page.getByText(/Plano Grátis \(teste\)/)).toHaveCount(0);
  const prep = await sql<{ id: string }>(`SELECT p.id FROM "Preparation" p JOIN "user" u ON u.id = p."userId" WHERE u.handle = $1`, [handle]);
  await page.goto(`/preparacoes/${prep[0].id}?aba=materiais`);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "aula.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(2) });
  await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 60_000 });

  // não-admin não acessa /admin (a 1ª conta de um banco vazio vira admin; garante que este aluno não é)
  await sql(`UPDATE "user" SET "isAdmin" = false WHERE handle = $1`, [handle]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/inicio/);
});
