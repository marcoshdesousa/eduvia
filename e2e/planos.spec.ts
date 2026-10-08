import { expect, test } from "@playwright/test";
import { AI_KEYS, connectAis, PASSWORD, signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

// Requer BILLING_ENFORCED diferente de "false" e AI_MODE=mock no servidor.
test("Grátis (10% das aulas, só a Gemini) → admin libera o Básico (50%) e o Completo (tudo)", async ({ page, browser }) => {
  const handle = `aluno.plano.${uid}`;
  await signUp(page, { name: "Aluno Planos", handle, plan: "gratis" });

  // só a Gemini: Groq e OpenRouter não aparecem
  await page.goto("/minha-ia");
  await expect(page.getByText(/Conectada \(…/)).toHaveCount(1);
  await expect(page.getByText(`Conectada (…${AI_KEYS.gemini.slice(-4)})`)).toBeVisible();
  await expect(page.getByText(/Groq|OpenRouter/)).toHaveCount(0);

  // sem a Gemini, o app leva para "Conecte a sua IA"
  await sql(`UPDATE "user" SET "geminiKey" = NULL, "geminiKeyHint" = NULL WHERE handle = $1`, [handle]);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/conectar-ia/);
  await expect(page.getByRole("heading", { name: "Conecte a sua IA" })).toBeVisible();
  await expect(page.locator("#ia-groq")).toHaveCount(0);
  await page.locator("#ia-gemini input[name=key]").fill("curta");
  await page.locator("#ia-gemini").getByRole("button", { name: /^Conectar / }).click();
  await expect(page.getByText(/não parece uma chave do Gemini/)).toBeVisible();
  await connectAis(page);
  await page.getByRole("link", { name: /Começar a estudar/ }).click();
  await expect(page).toHaveURL(/\/inicio/);

  // menu: Estudar ENEM e Baixar o app; nada de preparações
  await expect(page.locator('a[href="/enem"]', { hasText: "Estudar ENEM" })).toBeAttached();
  await expect(page.getByRole("link", { name: "Estudar", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Preparações" })).toHaveCount(0);
  await page.goto("/preparacoes/nova");
  await expect(page).toHaveURL(/\/enem$/);
  await expect(page.getByText("10% das aulas liberadas")).toBeVisible();

  // Grátis: todas as matérias, 10% das aulas de cada (pelo menos a 1ª)
  await page.goto("/enem/portugues");
  await expect(page.getByText(/Seu plano libera \d+ de \d+ aulas desta matéria/)).toBeVisible();
  await expect(page.getByText("Bloqueada: faz parte do plano Básico").first()).toBeVisible();
  await expect(page.getByText("Bloqueada: faz parte do plano Completo").first()).toBeVisible();
  const total = await sql<{ n: string }>(`SELECT count(*)::text AS n FROM "Topic" WHERE id LIKE 'enem-a-portugues-%'`);
  const n = Number(total[0].n);
  await page.goto(`/enem/aula/enem-a-portugues-${n}`);
  await expect(page.getByText("Aula do plano Completo")).toBeVisible();
  await page.goto("/enem/aula/enem-a-portugues-2");
  await expect(page.getByText(/Aula do plano (Básico|Completo)/)).toBeVisible();

  // assinatura: Grátis + Básico R$ 9,90, Completo (R$ 14,90 nos 3 primeiros meses) e Indicação (código de 6 números)
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Grátis")).toBeVisible();
  await expect(page.getByText(/^R\$\s9,90$/).first()).toBeVisible();
  await expect(page.getByLabel("Promoção do plano Completo").getByText(/14,90 nos 3 primeiros meses\. Depois, R\$\s19,90/)).toBeVisible();
  const referral = page.getByLabel("Plano Indicação");
  await expect(referral.getByText(/^R\$\s7,90$/)).toBeVisible();
  await expect(referral.getByLabel("Seu código de indicação")).toHaveText(/^\d{6}$/);
  await expect(referral.getByText("0 de 3 indicações")).toBeVisible();
  await expect(referral.getByText("Faltam 3 indicações para liberar")).toBeVisible();
  await expect(page.getByText(/WhatsApp/)).toHaveCount(0);

  // Grátis: 1 teste rápido por mês
  await page.goto("/teste-rapido");
  await page.getByRole("button", { name: "Começar teste rápido" }).click();
  await expect(page).toHaveURL(/\/teste-rapido\/[^/]+$/, { timeout: 30_000 });
  await page.goto("/teste-rapido");
  await page.getByRole("button", { name: "Começar teste rápido" }).click();
  await expect(page.getByText(/Você já usou 1 teste rápido deste mês no plano Grátis/)).toBeVisible();

  // Grátis: avatares de assinante bloqueados
  await page.goto("/configuracoes");
  await expect(page.getByRole("radio", { name: "Capitão Escudo (só para assinantes)" })).toBeVisible();

  // admin libera o Básico por 30 dias
  const admin = await (await browser.newContext()).newPage();
  await signUp(admin, { name: "Admin Planos", handle: `admin.plano.${uid}` });
  await sql(`UPDATE "user" SET "isAdmin" = true WHERE handle = $1`, [`admin.plano.${uid}`]);
  await admin.goto(`/admin?q=${handle}`);
  await expect(admin.getByText("Gemini conectada", { exact: true })).toBeVisible();
  admin.on("dialog", (d) => d.accept());
  await admin.getByLabel("Plano").selectOption("basico");
  await admin.getByRole("button", { name: "Liberar" }).click();
  await expect(admin.getByText(/Básico mensal até/)).toBeVisible();
  await expect(admin.getByText("Pix próprio", { exact: true })).toBeVisible();

  // Básico: metade das aulas; grupos não; o Completo aparece para subir (sem desconto pelos dias)
  await page.goto("/enem/portugues");
  await expect(page.getByText("Bloqueada: faz parte do plano Básico")).toHaveCount(0);
  await expect(page.getByText("Bloqueada: faz parte do plano Completo").first()).toBeVisible();
  await page.goto("/grupos");
  await expect(page.getByText(/Grupos de estudo fazem parte do plano Completo/).first()).toBeVisible();
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Básico")).toBeVisible();
  await expect(page.getByText(/Seu plano · até/)).toBeVisible();
  await expect(page.getByLabel("Mudar para o plano Completo").getByText(/Mudando do Básico para o Completo: você paga R\$\s14,90/)).toBeVisible();

  // admin libera o Completo: tudo liberado; o Básico fica indisponível até o Completo acabar
  await admin.goto(`/admin?q=${handle}`);
  await admin.getByLabel("Plano").selectOption("completo");
  await admin.getByRole("button", { name: "Liberar" }).click();
  await expect(admin.getByText(/Completo mensal até/)).toBeVisible();
  await page.goto("/enem/portugues");
  await expect(page.getByText(/Bloqueada: faz parte do plano/)).toHaveCount(0);
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Completo")).toBeVisible();
  await expect(page.getByLabel("Básico indisponível").getByText(/Disponível para trocar de plano em \d{2}\/\d{2}/)).toBeVisible();
  await page.goto("/configuracoes");
  await expect(page.getByRole("radio", { name: "Capitão Escudo", exact: true })).toBeVisible();

  // admin: planos novos e o "recomeçar do zero" pede confirmação
  await admin.goto("/admin?aba=planos");
  for (const name of ["Grátis", "Básico", "Completo", "Indicação"]) await expect(admin.getByRole("heading", { name: new RegExp(`^${name}`) })).toBeVisible();
  await admin.goto("/admin?aba=site");
  await expect(admin.getByText("Recomeçar do zero")).toBeVisible();
  await admin.getByLabel("Para confirmar, digite APAGAR TUDO").fill("apagar");
  await admin.getByRole("button", { name: /Apagar \d+ conta\(s\) agora/ }).click();
  await expect(admin.getByText("Digite APAGAR TUDO para confirmar.")).toBeVisible();

  // redes sociais: o admin cadastra e o botão aparece no rodapé da página inicial (focada no ENEM)
  await admin.getByLabel("Instagram").fill("@eduvia.teste");
  await admin.getByRole("button", { name: "Salvar redes sociais" }).click();
  await expect(admin.getByText(/Redes sociais salvas/)).toBeVisible();
  const visitor = await (await browser.newContext()).newPage();
  await visitor.goto("/");
  await expect(visitor.getByRole("heading", { name: /Estude para o ENEM/ })).toBeVisible();
  await expect(visitor.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://instagram.com/eduvia.teste");
  await expect(visitor.getByText(/^R\$\s7,90$/)).toBeVisible();
  await visitor.getByText("Como funciona o plano Indicação?").click();
  await expect(visitor.getByText(/quando 3 pessoas criarem a conta usando o seu código/)).toBeVisible();
  await visitor.goto("/baixar-app");
  await expect(visitor.getByRole("heading", { name: "Baixe o app do Eduvia" })).toBeVisible();
  await visitor.close();
  await admin.goto("/admin?aba=site");
  await admin.getByLabel("Instagram").fill("");
  await admin.getByRole("button", { name: "Salvar redes sociais" }).click();
  await expect(admin.getByText(/Redes sociais salvas/)).toBeVisible();

  // suporte por chamados: aluno abre, admin responde e finaliza
  await page.goto("/suporte");
  await page.getByLabel("Tipo").selectOption("Dúvida");
  await page.getByLabel("Mensagem").fill("Como troco minha chave do Gemini?");
  await page.getByRole("button", { name: "Abrir chamado" }).click();
  await expect(page).toHaveURL(/\/suporte\/[^/]+$/);
  await admin.goto("/admin?aba=suporte");
  await admin.getByRole("link", { name: `@${handle}` }).first().click();
  await admin.getByLabel("Mensagem").fill("É em Ajustes → Chave de acesso.");
  await admin.getByRole("button", { name: "Enviar" }).click();
  await expect(admin.getByText(/Resposta enviada/)).toBeVisible();
  await admin.getByRole("button", { name: "Finalizar chamado" }).click();
  await page.reload();
  await expect(page.getByText("É em Ajustes → Chave de acesso.")).toBeVisible();
  await expect(page.getByText(/Este chamado foi finalizado/)).toBeVisible();

  // não-admin não acessa /admin
  await sql(`UPDATE "user" SET "isAdmin" = false WHERE handle = $1`, [handle]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/inicio/);
});

test("plano vencendo: aviso e janela toda vez; vencido: volta para o Grátis e pode renovar", async ({ page, browser }) => {
  const handle = `aluno.vence.${uid}`;
  await signUp(page, { name: "Aluno Vence", handle });
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() + interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/inicio");
  await expect(page.getByText(/Seu plano Completo vence amanhã/).first()).toBeVisible();
  const popup = page.getByRole("dialog", { name: "Renovar plano" });
  await expect(popup).toBeVisible();
  await popup.getByRole("button", { name: "Lembrar depois" }).click();
  await expect(popup).toHaveCount(0);
  await page.goto("/revisoes");
  await expect(page.getByRole("status").filter({ hasText: /vence amanhã/ })).toBeVisible();
  await expect(popup).toHaveCount(0);

  // venceu: entra normalmente (vai para o Início), está no Grátis e vê o aviso para renovar
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() - interval '1 hour' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  const device = await (await browser.newContext()).newPage();
  await device.goto("/entrar");
  await device.getByLabel("CPF ou @").fill(`@${handle}`);
  await device.getByLabel("Senha").fill(PASSWORD);
  await device.getByRole("button", { name: "Entrar" }).click();
  await expect(device).toHaveURL(/\/inicio/);
  await expect(device.getByRole("status").filter({ hasText: /Seu plano Completo venceu/ })).toBeVisible();
  await device.getByRole("link", { name: "Renovar" }).first().click();
  await expect(device).toHaveURL(/\/assinatura/);
  await expect(device.getByText("Seu plano: Grátis")).toBeVisible();
});
