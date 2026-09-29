import { expect, type Page } from "@playwright/test";
import pg from "pg";
import { randomCpf, randomPhone } from "./fixtures";

export const PASSWORD = "senha-segura-123";

export async function signUp(page: Page, opts: { name: string; handle: string }) {
  // os testes criam muitas contas do mesmo IP: zera o limite de cadastros
  await sql(`DELETE FROM verification WHERE identifier LIKE 'limit:signup:%'`);
  const cpf = randomCpf();
  const phone = randomPhone();
  await page.goto("/cadastro");
  await page.getByLabel("Nome", { exact: true }).fill(opts.name);
  await page.getByLabel("CPF").fill(cpf);
  await page.getByLabel("Telefone (WhatsApp)").fill(phone);
  await page.locator("#handle").fill(opts.handle);
  await expect(page.getByText("Disponível!")).toBeVisible();
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.locator('input[name="terms"]').check();
  await page.getByRole("button", { name: /Criar conta/ }).click();
  await expect(page).toHaveURL(/\/inicio/);
  return { cpf, phone };
}

export async function sql<T = Record<string, unknown>>(query: string, params: unknown[] = []) {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/eduvia" });
  await c.connect();
  try {
    return (await c.query(query, params)).rows as T[];
  } finally {
    await c.end();
  }
}
