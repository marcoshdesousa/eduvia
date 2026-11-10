import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { PASSWORD, login, logout, pickCity, randomCpf, signUpClient, sql, uid } from "./helpers";

const SHOTS = process.env.E2E_SHOTS;
const shot = async (page: Page, name: string) => {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
};
const ADMIN_CPF = process.env.ADMIN_CPF || "52998224725";

/** Data de amanhã (AAAA-MM-DD) no horário de São Paulo. */
function tomorrow() {
  const d = new Date(Date.now() + 36 * 3_600_000);
  return d.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
}

async function signUpPro(page: Page, opts: { name: string; cpf: string; birth: string; city?: [string, string] }) {
  await page.goto("/cadastro/profissional");
  await page.getByLabel("Nome completo").fill(opts.name);
  await page.getByLabel("Data de nascimento").fill(opts.birth);
  await page.getByLabel("CPF").fill(opts.cpf);
  await page.getByLabel("WhatsApp").fill("91987654321");
  await page.locator('input[type="file"]:not([capture])').setInputFiles(path.join(import.meta.dirname, "fixtures/rosto.png"));
  await page.getByRole("button", { name: "Usar esta foto" }).click();
  await expect(page.getByAltText("Prévia da foto de perfil")).toBeVisible();
  const [uf, city] = opts.city ?? ["PA", "Belém"];
  await pickCity(page, uf, city);
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirme a senha").fill(PASSWORD);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Criar conta de profissional" }).click();
}

test("fluxo completo: cadastros, verificação, assinatura, vitrine, pedido, aceite, chat, conclusão e avaliação", async ({ page }) => {
  test.setTimeout(300_000);
  const tag = uid();

  // 1. cliente se cadastra de graça só com nome, CPF e senha
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Sua casa em boas mãos/ })).toBeVisible();
  await shot(page, "01-inicio");
  const clientCpf = await signUpClient(page, `Ana Cliente ${tag}`);
  await expect(page).toHaveURL(/\/buscar/);
  // CPF repetido não cria outra conta
  await logout(page);
  await signUpClient(page, `Outra Pessoa ${tag}`, clientCpf);
  await expect(page.getByText("Já existe uma conta com este CPF")).toBeVisible();

  // 2. profissional menor de 18 anos é barrado (o servidor calcula a idade)
  const minorBirth = new Date(Date.now() - 17 * 365.25 * 86_400_000).toISOString().slice(0, 10);
  const res = await page.request.post("/api/cadastro/profissional", {
    multipart: { name: `Menor Idade ${tag}`, birthDate: minorBirth, cpf: randomCpf(), whatsapp: "91987654321", uf: "PA", cidade: "Belém", password: PASSWORD, passwordConfirm: PASSWORD, terms: "on", photo: { name: "f.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) } },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toMatch(/maiores de 18/);

  // 3. profissional se cadastra com foto (corte + prévia redonda), estado e município
  const proCpf = randomCpf();
  await signUpPro(page, { name: `Bia ${tag} Diarista`, cpf: proCpf, birth: "1990-05-20" });
  await expect(page).toHaveURL(/\/painel/);
  await expect(page.getByText("Você ainda não aparece na vitrine")).toBeVisible();
  // define o próprio preço e serviços, depois envia para verificação
  await page.goto("/painel/perfil");
  await page.getByLabel("Preço por hora (R$)").fill("25,00");
  await page.getByLabel("Limpeza geral").check();
  await page.getByLabel("Cozinha").check();
  await page.getByRole("button", { name: "Salvar" }).first().click();
  await expect(page.getByText("Perfil salvo.")).toBeVisible();
  await shot(page, "02-perfil-profissional");
  await page.goto("/painel");
  await page.getByRole("button", { name: "Enviar perfil para verificação" }).click();
  await expect(page.getByText("Seu perfil está em análise")).toBeVisible();
  await shot(page, "03-painel-profissional");

  // 4. ainda não aparece na vitrine (não aprovado / sem assinatura)
  await logout(page);
  await login(page, clientCpf);
  await page.goto(`/buscar?uf=PA&cidade=${encodeURIComponent("Belém")}`);
  const [{ id: proId }] = await sql<{ id: string }>(`SELECT p.id FROM "ProfessionalProfile" p JOIN "user" u ON u.id = p."userId" WHERE u.name = $1`, [`Bia ${tag} Diarista`]);
  await expect(page.getByText(/profissiona(l|is) encontrado|Nenhum profissional/).first()).toBeVisible();
  await expect(page.locator(`a[href^="/profissional/${proId}"]`)).toHaveCount(0);

  // 5. admin (CPF do dono) aprova e libera 30 dias de assinatura
  await logout(page);
  const admin = await sql<{ id: string }>(`SELECT id FROM "user" WHERE role = 'ADMIN' LIMIT 1`);
  if (!admin.length) {
    await signUpClient(page, "Dono HoraLimp", ADMIN_CPF);
    await expect(page).toHaveURL(/\/admin|\/buscar/);
  } else {
    await login(page, ADMIN_CPF);
  }
  await page.goto("/admin/profissionais?status=PENDING");
  const card = page.locator("li", { hasText: `Bia ${tag} Diarista` });
  await expect(card.getByText(/35 anos|36 anos/)).toBeVisible();
  await shot(page, "04-admin-verificacao");
  await card.getByRole("button", { name: "Aprovar" }).click();
  await expect(card).toHaveCount(0); // saiu da lista de pendentes
  await page.goto("/admin/profissionais?status=APPROVED");
  page.once("dialog", (d) => d.accept());
  await page.locator("li", { hasText: `Bia ${tag} Diarista` }).getByRole("button", { name: "Liberar 30 dias" }).click();
  await expect(page.getByText("30 dias liberados.")).toBeVisible();
  await page.goto("/admin");
  await shot(page, "05-admin-resumo");

  // 6. cliente encontra a profissional na vitrine do município e solicita
  await logout(page);
  await login(page, clientCpf);
  await page.goto(`/buscar?uf=PA&cidade=${encodeURIComponent("Belém")}`);
  const proCard = page.locator(`a[href^="/profissional/${proId}"]`);
  await expect(proCard).toBeVisible();
  await expect(proCard.getByText("R$ 25,00")).toBeVisible();
  await shot(page, "06-vitrine");
  await proCard.click();
  await expect(page.getByRole("link", { name: "Solicitar limpeza" })).toBeVisible();
  await page.getByRole("link", { name: "Solicitar limpeza" }).click();
  await expect(page).toHaveURL(/\/solicitar\//);
  await page.getByLabel("Data").fill(tomorrow());
  await page.getByLabel("Horário de início").fill("09:00");
  await page.getByLabel("Quantidade de horas").selectOption("4");
  await expect(page.getByText("R$ 100,00")).toBeVisible(); // R$ 25 × 4 h
  await page.getByLabel("Rua / avenida").fill("Travessa das Flores");
  await page.getByLabel("Número").fill("123");
  await page.getByLabel("Bairro").fill("Umarizal");
  await shot(page, "07-solicitar");
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page).toHaveURL(/\/pedidos\/.+\?enviado=1/);
  await expect(page.getByText("Aguardando resposta do profissional").first()).toBeVisible();
  const bookingUrl = page.url().split("?")[0];
  await shot(page, "08-pedido-enviado");

  // 7. profissional não vê o endereço antes de aceitar; aceita; o endereço aparece; o chat libera
  await logout(page);
  await login(page, proCpf);
  await page.goto(bookingUrl);
  await expect(page.getByText("Travessa das Flores")).toHaveCount(0);
  await expect(page.getByText(/O endereço completo aparece depois que você aceitar/)).toBeVisible();
  await page.getByRole("button", { name: "Aceitar" }).click();
  await expect(page.getByText("Aceita — contratação confirmada").first()).toBeVisible();
  await expect(page.getByText(/Travessa das Flores, 123/)).toBeVisible();
  await page.getByLabel("Mensagem").fill("Olá! Chego às 9h. Posso levar os produtos?");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(page.getByText("Olá! Chego às 9h. Posso levar os produtos?")).toBeVisible();

  // 8. cliente responde no chat (com foto) e vê a confirmação
  await logout(page);
  await login(page, clientCpf);
  await page.goto(bookingUrl);
  await expect(page.getByText("Olá! Chego às 9h. Posso levar os produtos?")).toBeVisible({ timeout: 15_000 });
  await page.getByLabel("Mensagem").fill("Pode sim, obrigada!");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(page.getByText("Pode sim, obrigada!")).toBeVisible();
  await page.locator('#chat input[type="file"]').setInputFiles(path.join(import.meta.dirname, "fixtures/rosto.png"));
  await expect(page.getByAltText("Prévia da foto")).toBeVisible();
  await page.getByLabel("Mensagem").fill("Frente da casa");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(page.getByAltText("Foto enviada no chat")).toBeVisible();
  await shot(page, "09-chat");

  // 9. profissional faz o serviço e conclui
  await logout(page);
  await login(page, proCpf);
  await page.goto(bookingUrl);
  await page.getByRole("button", { name: "Estou a caminho" }).click();
  await expect(page.getByText("Profissional a caminho").first()).toBeVisible();
  await page.getByRole("button", { name: "Cheguei" }).click();
  await expect(page.getByText("Profissional chegou").first()).toBeVisible();
  await page.getByRole("button", { name: "Iniciar serviço" }).click();
  await expect(page.getByText("Serviço iniciado").first()).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Marcar como concluído" }).click();
  await expect(page.getByText("Serviço concluído").first()).toBeVisible();

  // 10. cliente avalia (só depois de concluído) e a nota aparece no perfil
  await logout(page);
  await login(page, clientCpf);
  await page.goto(bookingUrl);
  await page.getByRole("radio", { name: "5 estrelas" }).click();
  await page.getByPlaceholder("Comentário (opcional)").fill("Muito caprichosa!");
  await page.getByRole("button", { name: "Enviar avaliação" }).click();
  await expect(page.getByText("Sua avaliação:")).toBeVisible();
  await shot(page, "10-concluido-avaliado");
  const rows = await sql<{ status: string; estimateCents: number; hist: number }>(
    `SELECT b.status, b."estimateCents", (SELECT count(*)::int FROM "BookingStatusHistory" h WHERE h."bookingId" = b.id) AS hist FROM "Booking" b WHERE b.id = $1`,
    [bookingUrl.split("/").pop()],
  );
  expect(rows[0]).toMatchObject({ status: "COMPLETED", estimateCents: 10_000, hist: 6 });
  const pro = await sql<{ ratingCount: number; completedCount: number }>(`SELECT "ratingCount", "completedCount" FROM "ProfessionalProfile" p JOIN "user" u ON u.id = p."userId" WHERE u.name = $1`, [`Bia ${tag} Diarista`]);
  expect(pro[0]).toMatchObject({ ratingCount: 1, completedCount: 1 });
});

test("segurança: webhook sem token, arquivos do chat e foto fora da vitrine são protegidos", async ({ page, request }) => {
  expect((await request.post("/api/webhooks/syncpay", { data: { id: "x" } })).status()).toBe(401);
  expect((await request.post("/api/webhooks/syncpay?t=errado", { data: { id: "x" } })).status()).toBe(401);
  expect((await request.get("/api/mensagens/qualquer/arquivo")).status()).toBe(401);
  // login direto pela API de cadastro do Better Auth está desligado (contas só pelo formulário)
  const r = await request.post("/api/auth/sign-up/email", { data: { email: "x@y.z", password: "12345678", name: "X", role: "ADMIN" } });
  expect(r.status()).toBeGreaterThanOrEqual(400);
  // páginas internas pedem login
  await page.goto("/pedidos");
  await expect(page).toHaveURL(/\/entrar/);
});
