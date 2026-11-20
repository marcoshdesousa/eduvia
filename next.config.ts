import type { NextConfig } from "next";

/** Fase de teste antes de lançar (igual ao src/lib/test-phase.ts): libera "Testar no navegador". Troque para false ao lançar. */
const FASE_DE_TESTE = true;

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE ?? (FASE_DE_TESTE ? "1" : "0") },
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      // atrás de um proxy (ex.: link de teste do GitHub Codespaces), aceitar formulários vindos desse endereço
      ...(process.env.SERVER_ACTIONS_ORIGINS ? { allowedOrigins: process.env.SERVER_ACTIONS_ORIGINS.split(",") } : {}),
    },
  },
};

export default nextConfig;
