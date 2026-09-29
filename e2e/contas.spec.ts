import { expect, test } from "@playwright/test";
import { GEMINI_KEY, PASSWORD, signUp } from "./helpers";

const uid = Date.now().toString(36);

test("login por CPF ou @ e nova senha pelo CPF + telefone", async ({ page, browser }) => {
  const handle = `login.${uid}`;
  const { cpf, phone } = await signUp(page, { name: "Pessoa Login", handle });

  // CPF repetido é recusado
  const other = await browser.newPage();
  await other.goto("/cadastro");
  await other.getByLabel("Nome", { exact: true }).fill("Outra Pessoa");
  await other.getByLabel("CPF").fill(cpf);
  await other.getByLabel("Telefone (WhatsApp)").fill("11912345678");
  await other.locator("#handle").fill(`outra.${uid}`);
  await other.getByLabel("Senha").fill(PASSWORD);
  await other.locator('input[name="terms"]').check();
  await other.getByRole("button", { name: "Continuar" }).click();
  // "Voltar" volta ao passo 1 sem perder o que foi digitado
  await other.getByRole("button", { name: "Voltar" }).click();
  await expect(other.getByLabel("Nome", { exact: true })).toHaveValue("Outra Pessoa");
  await other.getByRole("button", { name: "Continuar" }).click();
  await other.getByLabel("Chave da API do Gemini").fill(GEMINI_KEY);
  await other.getByRole("button", { name: /Criar conta/ }).click();
  await expect(other.getByText(/Já existe uma conta com esse CPF/)).toBeVisible();
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
  await page.getByRole("button", { name: "Criar nova senha" }).click();
  await expect(page.getByText("CPF e telefone não conferem com nenhuma conta.")).toBeVisible();
  await page.getByLabel(/Telefone/).fill(phone);
  await page.getByLabel("Nova senha").fill("nova-senha-456");
  await page.getByRole("button", { name: "Criar nova senha" }).click();
  await expect(page.getByText(/Senha alterada!/)).toBeVisible();

  // entrar pelo @ com a nova senha
  await page.goto("/entrar");
  await page.getByLabel("CPF ou @").fill(`@${handle}`);
  await page.getByLabel("Senha").fill("nova-senha-456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/inicio/);
});
