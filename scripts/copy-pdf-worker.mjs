// Copia o worker (versão "legacy", que funciona também em celulares mais antigos) do pdf.js para public/ (o leitor de PDF dentro do app carrega ele de lá).
import { copyFileSync, existsSync } from "node:fs";
const src = "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs";
if (existsSync(src)) copyFileSync(src, "public/pdf.worker.min.mjs");
