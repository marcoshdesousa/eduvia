import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { login, logout, randomCpf, signUp, sql, uid } from "./helpers";

const SHOTS = process.env.E2E_SHOTS;
const shot = async (page: Page, name: string) => {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
};
const ADMIN_CPF = process.env.ADMIN_CPF || "52998224725";
const SP = { latitude: -23.5505, longitude: -46.6333 };

/** Endereço marcado no mapa: usa a localização do aparelho; sem internet para o mapa, completa à mão. */
async function fillPickedPlace(page: Page) {
  await page.getByRole("button", { name: /Usar minha localização/ }).click();
  const city = page.getByLabel("Município");
  await expect(city).toBeVisible({ timeout: 20_000 });
  if (!(await city.inputValue())) await city.fill("São Paulo");
  const uf = page.getByLabel("UF");
  if (!(await uf.inputValue())) await uf.fill("SP");
}

test("Diária Paga: trabalhador com perfis, vitrine, mensagens com agendamento, Contrate rápido, financeiro e admin", async ({ browser }) => {
  test.setTimeout(300_000);
  const tag = uid();
  const ctxOpts = { geolocation: SP, permissions: ["geolocation"], locale: "pt-BR", timezoneId: "America/Sao_Paulo" };
  const proCtx = await browser.newContext({ ...ctxOpts, viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const cliCtx = await browser.newContext({ ...ctxOpts, viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const pro = await proCtx.newPage();
  const cli = await cliCtx.newPage();

  // 1. página inicial
  await cli.goto("/");
  await expect(cli.getByRole("heading", { name: /Quem faz o serviço, perto de você/ })).toBeVisible();

  // 2. trabalhador: nome, CPF, WhatsApp e senha → 3 dias grátis → primeiro perfil (profissão, valor, foto, endereço)
  await signUp(pro, `Bia ${tag} Souza`, randomCpf(), "?quero=trabalhar", "11987654321");
  await expect(pro).toHaveURL(/\/painel\/perfil\/novo/, { timeout: 20_000 });
  await pro.getByLabel("Serviço", { exact: true }).selectOption("diarista");
  await pro.getByLabel("Seu valor (R$)").fill("150");
  await pro.locator('input[type="file"]:not([capture])').first().setInputFiles(path.join(import.meta.dirname, "fixtures/rosto.png"));
  await pro.getByRole("button", { name: "Usar esta foto" }).click();
  await fillPickedPlace(pro);
  // telefone liberado na bio (só a legenda das fotos bloqueia)
  await pro.getByLabel(/Sobre você nesta profissão/).fill("Faxina caprichada, 10 anos de experiência. Zap 11 98765-4321");
  await pro.getByRole("button", { name: "Criar perfil" }).click();
  await expect(pro).toHaveURL(/\/painel\/perfil\?p=/, { timeout: 20_000 });
  await expect(pro.getByRole("heading", { name: "Meu perfil" })).toBeVisible();
  // redes sociais e valor por hora
  await pro.getByRole("textbox", { name: "WhatsApp" }).fill("(11) 98765-4321");
  await pro.getByLabel("TikTok").fill("@bia.faxina");
  await pro.getByText("Também trabalho por hora").click();
  await pro.getByLabel("Valor da hora (R$)").fill("10");
  await pro.getByRole("button", { name: "Salvar perfil" }).click();
  await expect(pro.getByText(/não podem sair mais baratas que a diária/)).toBeVisible();
  await pro.getByLabel("Valor da hora (R$)").fill("30");
  await pro.getByRole("button", { name: "Salvar perfil" }).click();
  await expect(pro.getByText("R$ 30,00 / hora", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  await shot(pro, "02-meu-perfil");

  // agenda aberta o dia todo (o teste roda a qualquer hora)
  const proRow = (await sql<{ id: string }>(`SELECT p.id FROM "ProviderProfile" p JOIN "user" u ON u.id = p."userId" WHERE u.name = $1`, [`Bia ${tag} Souza`]))[0];
  await sql(`DELETE FROM "AvailabilityRule" WHERE "proId" = $1`, [proRow.id]);
  await sql(`INSERT INTO "AvailabilityRule" (id, "proId", weekday, "startMin", "endMin") SELECT md5(random()::text || d), $1, d, 0, 1439 FROM generate_series(0, 6) d`, [proRow.id]);

  // Minha área: caixinha do Contrate rápido e Disponível
  await pro.goto("/painel");
  await pro.getByRole("checkbox", { name: /Li e aceito as regras/ }).check();
  await pro.getByRole("button", { name: "Quero participar" }).click();
  await expect(pro.getByText(/Sua taxa de aceite/)).toBeVisible();
  await pro.getByRole("switch", { name: /Disponível para o Contrate rápido/ }).click();
  await expect(pro.getByText(/Você está disponível/)).toBeVisible();
  await shot(pro, "03-minha-area");

  // 3. cliente: conta grátis → Início → toca na profissão → vitrine
  await signUp(cli, `Carla ${tag} Cliente`);
  await expect(cli).toHaveURL(/\/inicio/);
  await shot(cli, "04-inicio");
  await cli.getByRole("link", { name: /Diarista \/ faxina/ }).first().click();
  const card = cli.locator(`a[href^="/prestador/${proRow.id}"]`);
  await expect(card).toBeVisible();
  await expect(card.getByText("★ Recomendado")).toBeVisible();
  await shot(cli, "05-vitrine");
  await card.click();
  await expect(cli.getByText(/Faxina caprichada, 10 anos de experiência/)).toBeVisible();
  await expect(cli.getByRole("link", { name: /WhatsApp \(11\) 98765-4321/ })).toHaveAttribute("href", "https://wa.me/5511987654321");
  await expect(cli.getByRole("link", { name: /TikTok @bia.faxina/ })).toHaveAttribute("href", "https://www.tiktok.com/@bia.faxina");
  await expect(cli.getByText(/\/ hora \(de 1 a 8 horas\)/)).toBeVisible();

  // 4. mensagens: cliente manda, edita; trabalhador agenda pela conversa; cliente confirma com o endereço
  await cli.getByRole("button", { name: /Mensagem/ }).click();
  await expect(cli).toHaveURL(/\/mensagens\/\w+/);
  await cli.getByLabel("Mensagem").fill("Oi, faz faxina sexta?");
  await cli.getByRole("button", { name: "Enviar", exact: true }).click();
  await cli.getByText("Oi, faz faxina sexta?").click();
  await cli.getByRole("button", { name: "Editar" }).click();
  await cli.getByLabel("Mensagem").fill("Oi, faz faxina sábado?");
  await cli.getByRole("button", { name: "Salvar edição" }).click();
  await expect(cli.getByText("Oi, faz faxina sábado?")).toBeVisible();
  const convUrl = cli.url();

  await pro.goto("/mensagens");
  await pro.getByRole("link", { name: /Carla/ }).click();
  await expect(pro.getByText("Oi, faz faxina sábado?")).toBeVisible({ timeout: 15_000 });
  await pro.getByRole("button", { name: /Mais opções/ }).click();
  await pro.getByRole("button", { name: /Agendar/ }).click();
  const day = new Date(Date.now() + 3 * 86_400_000).toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  await pro.getByLabel("Dia").fill(day);
  await pro.getByLabel("Horário").fill("09:00");
  await pro.getByRole("button", { name: /Agendar e reservar/ }).click();
  await expect(pro.getByText("📅 Agendamento").first()).toBeVisible({ timeout: 15_000 });
  await shot(pro, "06-conversa-agendamento");

  await cli.goto(convUrl);
  await cli.getByRole("link", { name: "Confirmar com o endereço" }).click();
  await cli.getByRole("tab", { name: "Outro endereço" }).click();
  await cli.getByLabel("Rua / avenida").fill("Rua das Acácias");
  await cli.getByLabel("Número").fill("50");
  await cli.locator("#uf").selectOption("SP");
  await cli.locator("#city").fill("São Paulo");
  await cli.getByRole("button", { name: "Confirmar agendamento" }).click();
  await expect(cli.getByText("Rua das Acácias", { exact: false })).toBeVisible();

  // Pedidos (botão no topo): próximos com dia e hora
  await cli.getByRole("link", { name: /Pedidos/ }).first().click();
  await expect(cli.getByRole("heading", { name: /Próximos serviços/ })).toBeVisible();
  await expect(cli.getByText("09:00").first()).toBeVisible();
  await shot(cli, "07-pedidos");

  // 5. Contrate rápido (valor fixo, descrição obrigatória)
  // prestadores de testes anteriores não participam deste chamado
  await sql(`UPDATE "ProviderProfile" SET "quickOn" = false WHERE id <> $1 AND "userId" IN (SELECT id FROM "user" WHERE name LIKE 'Bia % Souza')`, [proRow.id]);
  await cli.goto("/rapido?servico=diarista");
  await expect(cli.getByText("5. Valor fixo")).toBeVisible({ timeout: 20_000 });
  // por hora: valor fixo da hora (diária ÷ 8 × 1,5)
  await cli.getByRole("radio", { name: /Por hora/ }).click();
  await expect(cli.getByText(/De 1 a 8 horas/)).toBeVisible();
  await expect(cli.getByText("R$ 29,00").last()).toBeVisible();
  await cli.getByRole("radio", { name: /Diária/ }).click();
  await cli.getByRole("button", { name: "Mais" }).click();
  await expect(cli.getByText("R$ 300,00")).toBeVisible();
  await cli.getByLabel("Rua / avenida").fill("Rua das Flores");
  await cli.getByLabel("Número").fill("100");
  await cli.locator("#uf").selectOption("SP");
  await cli.locator("#city").fill("São Paulo");
  await cli.getByLabel(/Descrição do serviço/).fill("Faxina completa em casa de 2 quartos, com geladeira e janelas.");
  await cli.getByRole("button", { name: /Chamar agora/ }).click();
  await expect(cli).toHaveURL(/\/pedidos\/\w+/, { timeout: 20_000 });
  await expect(cli.getByText(/Procurando diarista/)).toBeVisible();

  await pro.goto("/painel");
  const accept = pro.getByRole("button", { name: "Aceitar" });
  await expect(accept).toBeVisible({ timeout: 20_000 });
  await expect(pro.getByText("Faxina completa em casa de 2 quartos")).toBeVisible();
  await shot(pro, "08-chamado-tocando");
  await accept.click();
  await expect(pro).toHaveURL(/\/pedidos\/\w+/, { timeout: 20_000 });
  await expect(pro.getByText(/Você tem para chegar/)).toBeVisible();
  await expect(cli.getByText(/Chega em até/)).toBeVisible({ timeout: 20_000 });

  // mensagem rápida pelo menu dos 4 quadradinhos; telefone liberado no chat
  await pro.getByRole("button", { name: /Mais opções/ }).click();
  await pro.getByRole("button", { name: /Rápidas/ }).click();
  await pro.getByRole("button", { name: "Chego em 30 minutos" }).click();
  await expect(cli.getByText("Chego em 30 minutos").first()).toBeVisible({ timeout: 20_000 });
  await cli.getByLabel("Mensagem").fill("me liga 11 91234-5678");
  await cli.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(pro.getByText("me liga 11 91234-5678")).toBeVisible({ timeout: 20_000 });

  for (const step of ["Estou a caminho", "Cheguei", "Iniciar serviço"]) {
    await pro.getByRole("button", { name: step, exact: true }).click();
    await expect(pro.getByRole("button", { name: step, exact: true })).toHaveCount(0, { timeout: 15_000 });
  }
  await pro.getByRole("button", { name: "Marcar como concluído" }).click();
  await pro.getByLabel(/Quanto você recebeu/).fill("310");
  await pro.getByRole("button", { name: "Concluir serviço" }).click();
  await expect(pro.getByText("Serviço concluído").first()).toBeVisible({ timeout: 15_000 });

  await cli.reload();
  await cli.getByRole("radio", { name: "5 estrelas" }).click();
  await cli.getByRole("button", { name: /Enviar avaliação/ }).click();
  await expect(cli.getByText("Sua avaliação:")).toBeVisible();

  // 6. gestão financeira + lançamento + relatório PDF
  await pro.goto("/painel/financeiro");
  await expect(pro.getByText("R$ 310,00").first()).toBeVisible();
  await pro.getByText("− Saída").click();
  await pro.getByLabel("Valor (R$)").fill("40");
  await pro.getByLabel("Descrição").fill("Produtos de limpeza");
  await pro.getByRole("button", { name: "Lançar" }).click();
  await expect(pro.getByText("Produtos de limpeza")).toBeVisible();
  const pdf = await pro.request.get(`/api/financeiro/relatorio`);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  await shot(pro, "09-financeiro");

  // agenda mostra o agendamento confirmado
  await pro.goto("/painel/agenda");
  await expect(pro.getByText(/Carla/).first()).toBeVisible();
  await shot(pro, "10-agenda");

  // troca para o modo cliente e volta
  await pro.goto("/conta");
  await pro.getByRole("button", { name: "Entrar como cliente" }).click();
  await expect(pro).toHaveURL(/\/inicio/);
  await pro.goto("/conta");
  await pro.getByRole("button", { name: "Entrar como trabalhador" }).click();
  await expect(pro).toHaveURL(/\/painel/);

  // 7. admin
  const page = await (await browser.newContext()).newPage();
  const admin = await sql<{ id: string }>(`SELECT id FROM "user" WHERE role = 'ADMIN' LIMIT 1`);
  if (!admin.length) await signUp(page, "Dono Diária Paga", ADMIN_CPF);
  else await login(page, ADMIN_CPF);
  await page.goto("/admin");
  await expect(page.getByText("Visão geral do Diária Paga")).toBeVisible();
  for (const p of ["/admin/prestadores", "/admin/penalidades", "/admin/pagamentos", "/admin/config", "/admin/pedidos", "/admin/usuarios"]) {
    const r = await page.goto(p);
    expect(r?.status(), p).toBe(200);
  }
  await logout(page);
});
