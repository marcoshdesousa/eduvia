import { afterEach, describe, expect, it } from "vitest";
import { appUrl } from "./app-url";

const keys = ["APP_URL", "BETTER_AUTH_URL", "RENDER_EXTERNAL_URL"] as const;
afterEach(() => keys.forEach((k) => delete process.env[k]));

describe("appUrl", () => {
  it("usa o endereço do Render quando o APP_URL do Render está errado ou vazio", () => {
    process.env.RENDER_EXTERNAL_URL = "https://eduvia-web-xxji.onrender.com";
    expect(appUrl()).toBe("https://eduvia-web-xxji.onrender.com");
    process.env.APP_URL = "https://eduvia-web.onrender.com";
    expect(appUrl()).toBe("https://eduvia-web-xxji.onrender.com");
  });
  it("respeita o domínio próprio", () => {
    process.env.RENDER_EXTERNAL_URL = "https://eduvia.onrender.com";
    process.env.APP_URL = "https://eduvia.com.br/";
    expect(appUrl()).toBe("https://eduvia.com.br");
  });
  it("cai no localhost em desenvolvimento", () => expect(appUrl()).toBe("http://localhost:3000"));
});
