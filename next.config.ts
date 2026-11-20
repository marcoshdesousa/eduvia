import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
