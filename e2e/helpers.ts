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
export async function signUp(page: Page, opts: { name: string; handle: string; plan?: "completo" | "basico" | "gratis"; coupon?: string; cpf?: string }) {
  // os testes criam muitas contas do mesmo IP: zera o limite de cadastros
  await sql(`DELETE FROM verification WHERE identifier LIKE 'limit:signup:%'`);
  const cpf = opts.cpf ?? randomCpf();
  const phone = randomPhone();
  await page.goto("/cadastro");
  await page.getByLabel("Nome", { exact: true }).fill(opts.name);
  await page.getByLabel("CPF").fill(cpf);
  await page.getByLabel("Telefone (WhatsApp)").fill(phone);
  await page.locator("#handle").fill(opts.handle);
  await expect(page.getByText("Disponível!")).toBeVisible();
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirme a senha").fill(PASSWORD);
  if (opts.coupon) await page.getByLabel("Código de indicação (opcional)").fill(opts.coupon);
  await page.locator('input[name="terms"]').check();
  // passo 1 cria a conta; passo 2: conectar a Gemini
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(/\/conectar-ia/);
  await connectAis(page);
  await page.getByRole("link", { name: /Começar a estudar/ }).click();
  await expect(page).toHaveURL(/\/inicio/);
  const plan = opts.plan ?? "completo";
  if (plan !== "gratis") await grantPlan(opts.handle, plan);
  return { cpf, phone };
}

/** Chaves de teste (o servidor em AI_MODE=mock aceita qualquer chave com formato plausível). */
export const AI_KEYS = { gemini: GEMINI_KEY, groq: "gsk_chavedetestedoeduvia123456", openrouter: "sk-or-v1-chavedetestedoeduvia123456" } as const;

/** Conecta a IA na tela "Conecte a sua IA" (só a Gemini; as outras ficam desligadas). */
export async function connectAis(page: Page) {
  for (const [p, key] of Object.entries(AI_KEYS)) {
    const card = page.locator(`#ia-${p}`);
    if (!(await card.count())) continue; // já conectada
    await card.locator("input[name=key]").fill(key);
    await card.getByRole("button", { name: /^Conectar / }).click();
    await expect(card).toHaveCount(0); // foi para a próxima
  }
  await expect(page.getByRole("link", { name: /Começar a estudar/ })).toBeVisible();
}

/** Depois que os arquivos ficam prontos: toca em "Gerar aulas" e espera terminar. */
export async function generateLessons(page: Page) {
  await page.getByRole("button", { name: /Gerar aulas/ }).click();
  await expect(page.getByText("Aulas geradas")).toBeVisible({ timeout: 120_000 });
}

export async function grantPlan(handle: string, plan = "completo") {
  await sql(
    `INSERT INTO "Subscription" (id, "userId", "planSlug", provider, status, interval, "billingType", "currentPeriodEnd", "updatedAt")
     SELECT 'e2e_' || id, id, $2, 'manual', 'ACTIVE', 'MONTH', 'MANUAL', now() + interval '30 days', now() FROM "user" WHERE handle = $1`,
    [handle, plan],
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
