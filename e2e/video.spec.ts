import { expect, test } from "@playwright/test";
import { signUp } from "./helpers";
// Modo vídeo: tela cheia com o celular em pé onde o site não pode girar o celular (iPhone): o vídeo aparece deitado.
test("tela cheia com o celular em pé: vídeo deitado", async ({ page }) => {
  test.setTimeout(300_000);
  await signUp(page, { name: "Video Gira", handle: `video.gira.${Date.now().toString(36).replace(/\d/g, (d) => "abcdefghij"[Number(d)])}`, plan: "completo" });
  await page.goto("/enem/aula/enem-a-fisica-1");
  await page.getByRole("button", { name: /Começar aula/ }).click();
  await page.getByRole("button", { name: "Assistir à aula" }).click();
  await expect(page.locator(".lv-top")).toBeVisible({ timeout: 180_000 });
  await page.getByRole("button", { name: "Tela cheia" }).click();
  await expect(page.locator(".lv-turn")).toBeVisible();
  await page.getByRole("button", { name: "Sair da tela cheia" }).click();
  await expect(page.locator(".lv-full")).toHaveCount(0);
});
