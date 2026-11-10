import { expect, type Page } from "@playwright/test";
import pg from "pg";

export const PASSWORD = "senha-segura-123";

/** CPF válido aleatório (com dígitos verificadores certos). */
export function randomCpf() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const dig = (arr: number[]) => {
    const sum = arr.reduce((s, v, i) => s + v * (arr.length + 1 - i), 0);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  n.push(dig(n));
  n.push(dig(n));
  return n.join("");
}

export const uid = () => Date.now().toString(36).replace(/\d/g, (d) => "abcdefghij"[Number(d)]);

export async function sql<T = Record<string, unknown>>(query: string, params: unknown[] = []) {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/eduvia" });
  await c.connect();
  try {
    return (await c.query(query, params)).rows as T[];
  } finally {
    await c.end();
  }
}

export async function signUpClient(page: Page, name: string, cpf = randomCpf()) {
  await page.goto("/cadastro/cliente");
  await page.getByLabel("Nome completo").fill(name);
  await page.getByLabel("CPF").fill(cpf);
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirme a senha").fill(PASSWORD);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Criar conta grátis" }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/cadastro"), { timeout: 15_000 }).catch(() => {});
  return cpf;
}

export async function login(page: Page, cpf: string) {
  await page.goto("/entrar");
  await page.getByLabel("CPF").fill(cpf);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/entrar"));
}

export async function logout(page: Page) {
  await page.context().clearCookies();
}

export async function pickCity(page: Page, uf: string, city: string, scope = page.locator("body")) {
  await scope.getByLabel("Estado").first().selectOption(uf);
  const input = scope.getByLabel("Município").first();
  await expect(input).toBeEnabled();
  await input.fill(city);
}
