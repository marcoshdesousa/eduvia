import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
};

export default nextConfig;
