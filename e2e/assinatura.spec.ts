import { expect, test } from "@playwright/test";
import { makeStudyPdf } from "./fixtures";
import { AI_KEYS, connectAis, generateLessons, PASSWORD, signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

// Requer BILLING_ENFORCED diferente de "false" e AI_MODE=mock no servidor.
test("teste grátis → admin libera o Pro; 3 IAs obrigatórias", async ({ page, browser }) => {
  const handle = `aluno.pago.${uid}`;
  await signUp(page, { name: "Aluno Pagante", handle, plan: "gratis" });

  // teste grátis de 3 dias: aviso no topo; planos mensais pagos só por Pix (nada de WhatsApp)
  await expect(page.getByText(/Teste grátis: faltam 3 dias/)).toBeVisible();
  await page.getByRole("link", { name: "Assinar", exact: true }).click();
  await expect(page).toHaveURL(/\/assinatura/);
  for (const price of [/^R\$\s9,90$/, /^R\$\s19,90$/, /^R\$\s34,90$/]) await expect(page.getByText(price)).toBeVisible();
  await expect(page.getByText(/WhatsApp/)).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.getByText("Teste grátis (3 dias)")).toBeVisible();
  await expect(page.getByText(/Arquivos e páginas sem limite/).first()).toBeVisible();

  // Minhas IAs: as 4 conectadas (só o final da chave aparece)
  await page.goto("/minha-ia");
  await expect(page.getByText(/Conectada \(…/)).toHaveCount(3);
  await expect(page.getByText(`Conectada (…${AI_KEYS.gemini.slice(-4)})`)).toBeVisible();

  // faltando uma IA, o app leva para "Conecte suas IAs"
  await sql(`UPDATE "user" SET "geminiKey" = NULL, "geminiKeyHint" = NULL WHERE handle = $1`, [handle]);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/conectar-ia/);
  await expect(page.getByText(/não coloque cartão, dados bancários nem faça Pix/i).first()).toBeVisible();
  await page.locator("#ia-gemini input[name=key]").fill("curta");
  await page.locator("#ia-gemini").getByRole("button", { name: /^Conectar / }).click();
  await expect(page.getByText(/não parece uma chave do Gemini/)).toBeVisible();
  await connectAis(page);
  await page.getByRole("link", { name: /Começar a estudar/ }).click();
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
  await expect(admin.getByText("IAs conectadas", { exact: true })).toBeVisible();
  admin.on("dialog", (d) => d.accept());
  await admin.getByLabel("Período").selectOption("MONTH");
  await admin.getByRole("button", { name: "Liberar" }).click();
  await expect(admin.getByText(/Pro mensal até/)).toBeVisible();
  // liberado pelo admin: "Pix próprio"; pago pela SyncPay: "Pix automático"
  await expect(admin.getByText("Pix próprio", { exact: true })).toBeVisible();
  await sql(`UPDATE "Payment" SET "billingType" = 'PIX' WHERE "subscriptionId" IN (SELECT s.id FROM "Subscription" s JOIN "user" u ON u.id = s."userId" WHERE u.handle = $1)`, [handle]);
  await admin.goto(`/admin?q=${handle}`);
  await expect(admin.getByText("Pix automático", { exact: true })).toBeVisible();
  await sql(`UPDATE "Payment" SET "billingType" = 'MANUAL' WHERE "subscriptionId" IN (SELECT s.id FROM "Subscription" s JOIN "user" u ON u.id = s."userId" WHERE u.handle = $1)`, [handle]);
  await admin.goto("/admin?aba=planos");
  await expect(admin.getByRole("button", { name: "Salvar" }).first()).toBeVisible();
  await admin.goto("/admin?aba=ia");
  await expect(admin.getByText("Alunos que mais usaram")).toBeVisible();
  await expect(admin.getByText("IAs do sistema")).toBeVisible();
  await expect(admin.getByRole("button", { name: "Desligar" })).toHaveCount(3);

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

  // aluno passa a ter o plano Pro
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Pro")).toBeVisible();
  await expect(page.getByText(/Teste grátis: faltam/)).toHaveCount(0);
  const prep = await sql<{ id: string }>(`SELECT p.id FROM "Preparation" p JOIN "user" u ON u.id = p."userId" WHERE u.handle = $1`, [handle]);
  await page.goto(`/preparacoes/${prep[0].id}?aba=materiais`);
  await page.locator('input[type="file"][multiple]').setInputFiles({ name: "aula.pdf", mimeType: "application/pdf", buffer: await makeStudyPdf(2) });
  await expect(page.getByText("Pronto", { exact: true })).toBeVisible({ timeout: 60_000 });
  await generateLessons(page);

  // não-admin não acessa /admin (a 1ª conta de um banco vazio vira admin; garante que este aluno não é)
  await sql(`UPDATE "user" SET "isAdmin" = false WHERE handle = $1`, [handle]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/inicio/);
});

test("plano vencendo: aviso e janela toda vez; vencido: entra e vai direto para pagar", async ({ page, browser }) => {
  const handle = `aluno.vence.${uid}`;
  await signUp(page, { name: "Aluno Vence", handle });
  // vence amanhã: aviso no topo e janela para renovar
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/inicio");
  await expect(page.getByText(/Seu plano Pro vence amanhã/).first()).toBeVisible();
  const popup = page.getByRole("dialog", { name: "Renovar plano" });
  await expect(popup).toBeVisible();
  await popup.getByRole("button", { name: "Lembrar depois" }).click();
  await expect(popup).toHaveCount(0);
  // na mesma visita não aparece de novo; o aviso no topo continua
  await page.goto("/revisoes");
  await expect(page.getByRole("status").filter({ hasText: /vence amanhã/ })).toBeVisible();
  await expect(popup).toHaveCount(0);
  // abriu o site de novo (outra visita): a janela volta
  const again = await page.context().newPage();
  await again.goto("/inicio");
  await expect(again.getByRole("dialog", { name: "Renovar plano" })).toBeVisible();
  await again.close();

  // venceu: entra normalmente e cai direto na tela de pagar
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() - interval '1 hour' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  const device = await (await browser.newContext()).newPage();
  await device.goto("/entrar");
  await device.getByLabel("CPF ou @").fill(`@${handle}`);
  await device.getByLabel("Senha").fill(PASSWORD);
  await device.getByRole("button", { name: "Entrar" }).click();
  await expect(device).toHaveURL(/\/assinatura/);
  await expect(device.getByText(/Seu plano Pro venceu/).first()).toBeVisible();
  await expect(device.getByText("Vencido", { exact: true })).toBeVisible();
  await device.goto("/inicio");
  await expect(device).toHaveURL(/\/assinatura/);
});
