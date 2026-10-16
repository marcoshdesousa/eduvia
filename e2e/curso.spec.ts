import { expect, test } from "@playwright/test";
import { signUp, sql } from "./helpers";

const SHOTS = process.env.E2E_SHOTS;
const uid = () => Date.now().toString(36).replace(/\d/g, (d) => "abcdefghij"[Number(d)]);

// Curso técnico TKSA 41: aberto até no plano Grátis, aula com imagens e simulado final de 100 perguntas.
test("curso TKSA 41: aulas com imagens e simulado final só no curso", async ({ page }) => {
  test.setTimeout(300_000);
  const handle = `curso.tksa.${uid()}`;
  await signUp(page, { name: "Curso Tksa", handle, plan: "gratis" });

  await page.goto("/enem");
  await expect(page.getByText("Cursos técnicos")).toBeVisible();
  await page.getByRole("link", { name: /Alinhamento a Laser/ }).click();
  await expect(page).toHaveURL(/\/enem\/tksa41$/);
  await expect(page.getByText("Simulado final: 100 perguntas")).toBeVisible();
  await expect(page.getByText(/Seu plano libera/)).toHaveCount(0);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/curso.png`, fullPage: true });

  // aula 1: liberada no plano Grátis, texto com as imagens dos slides
  await page.goto("/enem/aula/enem-a-tksa41-1");
  await expect(page.getByText(/10 perguntas de marcar/)).toBeVisible();
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await page.getByRole("tab", { name: "Ler e ouvir" }).click();
  await expect(page.locator(".prose-study img").first()).toBeVisible({ timeout: 120_000 });
  const ok = await page.locator(".prose-study img").first().evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0);
  expect(ok).toBe(true);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/aula-texto.png`, fullPage: true });
  await page.getByRole("tab", { name: "Vídeo" }).click();
  await page.getByRole("button", { name: "Assistir à aula" }).click();
  await expect(page.locator(".lv-top")).toBeVisible({ timeout: 180_000 });
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/aula-video.png` });

  // simulado (aula 6): libera com a aula 5 aprovada; sem texto nem vídeo, 100 perguntas
  await page.goto("/enem/aula/enem-a-tksa41-6");
  await expect(page.getByText(/Para liberar esta aula/)).toBeVisible();
  await sql(
    `INSERT INTO "StudySession" (id, "userId", "topicId", kind, "questionIds", "bestScore", "lastScore", tries, "passedAt", "completedAt")
     SELECT 'e2e_tksa5_' || id, id, 'enem-a-tksa41-5', 'STUDY', '{}', 1, 1, 1, now(), now() FROM "user" WHERE handle = $1`,
    [handle],
  );
  await page.reload();
  await expect(page.getByText(/Simulado final do curso: 100 perguntas/)).toBeVisible();
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await expect(page.getByRole("tab", { name: "Ler e ouvir" })).toHaveCount(0);
  await expect(page.getByText("0/100")).toBeVisible({ timeout: 60_000 });
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/simulado.png`, fullPage: true });
  await page.goto("/enem/tksa41");
  await expect(page.locator(".exam-card")).toBeVisible();
});
