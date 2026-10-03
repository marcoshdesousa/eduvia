// Instala a voz do robô (Piper + voz em português) dentro do app, no deploy (npm run build).
// Assim o servidor já sobe com a voz pronta. Se falhar (ex.: sem internet), o servidor baixa depois.
import { installPiper, vendorPiperDir } from "../src/lib/ai/piper";

if (process.env.PIPER_SKIP_INSTALL === "1" || process.platform !== "linux" || process.arch !== "x64") {
  console.log("[voz] instalação do Piper pulada neste ambiente");
} else {
  installPiper(vendorPiperDir())
    .then((r) => console.log(`[voz] Piper instalado no deploy (${r.voice})`))
    .catch((e) => console.warn(`[voz] não deu para instalar no deploy (o servidor tenta depois): ${(e as Error).message}`));
}
