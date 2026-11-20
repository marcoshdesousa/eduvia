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

test("Diária Paga: prestador com teste grátis, Contrate rápido com toque, chat, conclusão, financeiro e admin", async ({ browser }) => {
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
  await shot(cli, "01-landing");

  // 2. prestador: conta + perfil (foto, serviço, endereço no mapa) → 3 dias grátis do Completo
  const proCpf = randomCpf();
  await signUp(pro, `Bia ${tag} Souza`, proCpf, "?quero=trabalhar");
  await expect(pro).toHaveURL(/\/seja-prestador/);
  await expect(pro.getByText(/3 dias grátis do plano Completo/)).toBeVisible();
  await pro.getByLabel("Data de nascimento").fill("1990-05-20");
  await pro.getByLabel("Celular").fill("11987654321");
  await pro.locator('input[type="file"]:not([capture])').first().setInputFiles(path.join(import.meta.dirname, "fixtures/rosto.png"));
  await pro.getByRole("button", { name: "Usar esta foto" }).click();
  await pro.getByLabel("Serviço", { exact: true }).selectOption("diarista");
  await pro.getByLabel("Seu valor (R$)").fill("150");
  await fillPickedPlace(pro);
  // telefone na bio é bloqueado
  await pro.getByLabel("Bio").fill("Faxina caprichada. Me chama no zap 11 98765-4321");
  await pro.getByRole("checkbox", { name: /18 anos/ }).check();
  await pro.getByRole("button", { name: /Criar perfil/ }).click();
  await expect(pro.getByText(/Não é permitido passar telefone/)).toBeVisible();
  await pro.getByLabel("Bio").fill("Faxina caprichada, 10 anos de experiência.");
  await pro.getByRole("button", { name: /Criar perfil/ }).click();
  await expect(pro).toHaveURL(/\/painel/, { timeout: 20_000 });
  await expect(pro.getByText("Teste grátis do Completo")).toBeVisible();
  // o teste roda a qualquer hora: abre a agenda para o dia todo, todos os dias
  await sql(`DELETE FROM "AvailabilityRule" WHERE "proId" = (SELECT p.id FROM "ProviderProfile" p JOIN "user" u ON u.id = p."userId" WHERE u.name = $1)`, [`Bia ${tag} Souza`]);
  await sql(
    `INSERT INTO "AvailabilityRule" (id, "proId", weekday, "startMin", "endMin") SELECT md5(random()::text || d), p.id, d, 0, 1439 FROM "ProviderProfile" p JOIN "user" u ON u.id = p."userId", generate_series(0, 6) d WHERE u.name = $1`,
    [`Bia ${tag} Souza`],
  );
  await shot(pro, "02-painel-prestador");

  // liga o Disponível
  await pro.getByRole("switch", { name: /Disponível para o Contrate rápido/ }).click();
  await expect(pro.getByText(/Você está disponível/)).toBeVisible();

  // planos: Completo R$ 15,85 (recomendado) e Básico R$ 6,85
  await pro.goto("/painel/plano");
  await expect(pro.getByText("R$ 15,85").first()).toBeVisible();
  await expect(pro.getByText("R$ 6,85").first()).toBeVisible();
  await expect(pro.getByText("R$ 10,00 da plataforma + R$ 5,85 de impostos e taxas")).toBeVisible();
  await shot(pro, "03-planos");

  // 3. cliente: conta grátis, busca e perfil do prestador
  await signUp(cli, `Carla ${tag} Cliente`);
  await expect(cli).toHaveURL(/\/inicio/);
  await shot(cli, "04-inicio-cliente");
  await cli.goto(`/buscar?servico=diarista&uf=SP&cidade=${encodeURIComponent("São Paulo")}`);
  const proId = (await sql<{ id: string }>(`SELECT p.id FROM "ProviderProfile" p JOIN "user" u ON u.id = p."userId" WHERE u.name = $1`, [`Bia ${tag} Souza`]))[0].id;
  const card = cli.locator(`a[href="/prestador/${proId}"]`);
  await expect(card).toBeVisible();
  await expect(card.getByText("★ Recomendado")).toBeVisible();
  await shot(cli, "05-busca");
  await card.click();
  await expect(cli.getByText("Faxina caprichada, 10 anos de experiência.")).toBeVisible();

  // 4. Contrate rápido
  await cli.goto("/rapido?servico=diarista");
  await expect(cli.getByText(/Valor mínimo/)).toBeVisible({ timeout: 20_000 });
  await expect(cli.getByText("R$ 150,00").first()).toBeVisible();
  await cli.getByLabel("Rua / avenida").fill("Rua das Flores");
  await cli.getByLabel("Número").fill("100");
  await cli.locator("#uf").selectOption("SP");
  await cli.locator("#city").fill("São Paulo");
  await cli.getByLabel("Pago no máximo (R$)").fill("200");
  await shot(cli, "06-rapido");
  await cli.getByRole("button", { name: /Chamar agora/ }).click();
  await expect(cli).toHaveURL(/\/pedidos\/\w+/, { timeout: 20_000 });
  await expect(cli.getByText(/Procurando diarista/)).toBeVisible();
  await shot(cli, "07-procurando");

  // 5. o celular do prestador toca: aceita
  await pro.goto("/painel");
  const accept = pro.getByRole("button", { name: "Aceitar" });
  await expect(accept).toBeVisible({ timeout: 20_000 });
  await shot(pro, "08-chamado-tocando");
  await accept.click();
  await expect(pro).toHaveURL(/\/pedidos\/\w+/, { timeout: 20_000 });
  await expect(pro.getByText("Rua das Flores, 100", { exact: false })).toBeVisible();
  await expect(pro.getByText(/Você tem para chegar/)).toBeVisible();

  // cliente vê que aceitou (a tela se atualiza sozinha)
  await expect(cli.getByText(/Chega em até/)).toBeVisible({ timeout: 20_000 });

  // 6. chat: resposta rápida, telefone bloqueado
  await pro.getByRole("button", { name: "Chego em 30 min" }).click();
  await expect(cli.getByText("Chego em 30 min")).toBeVisible({ timeout: 20_000 });
  await cli.getByLabel("Mensagem").fill("me liga 11 91234-5678");
  await cli.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(cli.getByText(/Não é permitido passar telefone/)).toBeVisible();
  await shot(cli, "09-chat");

  // 7. andamento até concluir (com o valor recebido)
  for (const step of ["Estou a caminho", "Cheguei", "Iniciar serviço"]) {
    await pro.getByRole("button", { name: step, exact: true }).click();
    await expect(pro.getByRole("button", { name: step, exact: true })).toHaveCount(0, { timeout: 15_000 });
  }
  await pro.getByRole("button", { name: "Marcar como concluído" }).click();
  await pro.getByLabel(/Quanto você recebeu/).fill("160");
  await pro.getByRole("button", { name: "Concluir serviço" }).click();
  await expect(pro.getByText("Serviço concluído").first()).toBeVisible({ timeout: 15_000 });

  // cliente avalia
  await cli.reload();
  await cli.getByRole("radio", { name: "5 estrelas" }).click();
  await cli.getByRole("button", { name: /Enviar avaliação/ }).click();
  await expect(cli.getByText("Sua avaliação:")).toBeVisible();

  // 8. financeiro do prestador
  await pro.goto("/painel/financeiro");
  await expect(pro.getByText("R$ 160,00").first()).toBeVisible();
  await shot(pro, "10-financeiro");

  // 9. admin
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
  await page.goto(`/admin/prestadores?q=${tag}`);
  await expect(page.getByText(`Bia ${tag} Souza`)).toBeVisible();
  await logout(page);
});
