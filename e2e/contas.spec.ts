import { expect, test } from "@playwright/test";
import { PASSWORD, signUp, sql } from "./helpers";

const uid = Date.now().toString(36);

test("login por CPF ou @ e nova senha pelo CPF + telefone", async ({ page, browser }) => {
  const handle = `login.${uid}`;
  const { cpf, phone } = await signUp(page, { name: "Pessoa Login", handle });

  // CPF repetido é recusado
  const other = await browser.newPage();
  await other.goto("/cadastro");
  await other.getByLabel("Nome", { exact: true }).fill("Outra Pessoa");
  // CPF inválido é avisado na hora
  await other.getByLabel("CPF").fill("123.456.789-00");
  await expect(other.getByText("CPF inválido. Confira os números.")).toBeVisible();
  await other.getByLabel("CPF").fill(cpf);
  await other.getByLabel("Telefone (WhatsApp)").fill("11912345678");
  await other.locator("#handle").fill(`outra.${uid}`);
  await other.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  // as duas senhas precisam ser iguais
  await other.getByLabel("Confirme a senha").fill("outra-senha-999");
  await expect(other.getByText("As senhas não são iguais.")).toBeVisible();
  await other.getByLabel("Confirme a senha").fill(PASSWORD);
  await other.locator('input[name="terms"]').check();
  await other.getByRole("button", { name: "Continuar" }).click();
  await expect(other.getByText(/Já existe uma conta com esse CPF/)).toBeVisible();
  // o que foi digitado continua no formulário
  await expect(other.getByLabel("Nome", { exact: true })).toHaveValue("Outra Pessoa");
  await other.close();

  // sair e entrar pelo CPF
  await page.goto("/configuracoes");
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/entrar/);
  await page.getByLabel("CPF ou @").fill(cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
  await page.getByLabel("Senha").fill("senha-errada-1");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("CPF/@ ou senha incorretos.")).toBeVisible();
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/inicio/);

  // esqueci a senha: telefone errado é recusado; CPF + telefone certo troca a senha
  await page.goto("/configuracoes");
  await page.getByRole("button", { name: "Sair" }).click();
  await page.goto("/recuperar-senha");
  await page.getByLabel("CPF").fill(cpf);
  await page.getByLabel(/Telefone/).fill("11900000000");
  await page.getByLabel("Nova senha").fill("nova-senha-456");
  await page.getByLabel("Confirme a senha").fill("nova-senha-456");
  await page.getByRole("button", { name: "Criar nova senha" }).click();
  await expect(page.getByText("CPF e telefone não conferem com nenhuma conta.")).toBeVisible();
  await page.getByLabel(/Telefone/).fill(phone);
  await page.getByLabel("Nova senha").fill("nova-senha-456");
  await page.getByLabel("Confirme a senha").fill("nova-senha-456");
  await page.getByRole("button", { name: "Criar nova senha" }).click();
  await expect(page.getByText(/Senha alterada!/)).toBeVisible();

  // entrar pelo @ com a nova senha
  await page.goto("/entrar");
  await page.getByLabel("CPF ou @").fill(`@${handle}`);
  await page.getByLabel("Senha").fill("nova-senha-456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/inicio/);

  // login único: entrar em outro aparelho desconecta este
  const device2 = await (await browser.newContext()).newPage();
  await device2.goto("/entrar");
  await device2.getByLabel("CPF ou @").fill(`@${handle}`);
  await device2.getByLabel("Senha").fill("nova-senha-456");
  await device2.getByRole("button", { name: "Entrar" }).click();
  await expect(device2).toHaveURL(/\/inicio/);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/entrar/);
  await device2.close();
});

test("plano venceu: a conta continua e volta para o Grátis, com aviso para renovar", async ({ page }) => {
  const handle = `expirou.${uid}`;
  await signUp(page, { name: "Plano Acabou", handle });
  await sql(`UPDATE "Subscription" SET "currentPeriodEnd" = now() - interval '1 hour' WHERE "userId" = (SELECT id FROM "user" WHERE handle = $1)`, [handle]);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/inicio/);
  await expect(page.getByText(/Seu plano Completo venceu e você voltou para o Grátis/).first()).toBeVisible();
  await page.goto("/assinatura");
  await expect(page.getByText("Seu plano: Grátis")).toBeVisible();
  await expect(page.getByText("Plano Completo vencido")).toBeVisible();
  // continua estudando no Grátis (10% das aulas)
  await page.goto("/enem");
  await expect(page.getByText("10% das aulas liberadas")).toBeVisible();
});
