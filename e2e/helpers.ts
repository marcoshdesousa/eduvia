import { expect, type Page } from "@playwright/test";
import pg from "pg";
import { randomCpf, randomPhone } from "./fixtures";

export const PASSWORD = "senha-segura-123";
/** Com AI_MODE=mock no servidor, qualquer chave com formato plausível é aceita. */
export const GEMINI_KEY = "AIzaChaveDeTesteDoEduvia1234567890";

/**
 * Cria a conta pela tela de cadastro. Por padrão já libera o plano pago (via banco),
 * para os testes de funcionalidade não esbarrarem nos limites do plano Grátis.
 */
export async function signUp(page: Page, opts: { name: string; handle: string; plan?: "eduvia" | "gratis" }) {
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
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirme a senha").fill(PASSWORD);
  await page.locator('input[name="terms"]').check();
  // passo 2: chave do Gemini
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Chave da API do Gemini").fill(GEMINI_KEY);
  await page.getByRole("button", { name: /Criar conta/ }).click();
  await expect(page).toHaveURL(/\/inicio/);
  if ((opts.plan ?? "eduvia") === "eduvia") await grantPlan(opts.handle);
  return { cpf, phone };
}

export async function grantPlan(handle: string) {
  await sql(
    `INSERT INTO "Subscription" (id, "userId", "planSlug", provider, status, interval, "billingType", "currentPeriodEnd", "updatedAt")
     SELECT 'e2e_' || id, id, 'eduvia', 'manual', 'ACTIVE', 'MONTH', 'MANUAL', now() + interval '30 days', now() FROM "user" WHERE handle = $1`,
    [handle],
  );
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
