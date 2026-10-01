import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg-boss", "unpdf", "pdf-lib", "mammoth", "@prisma/adapter-pg", "pg", "@breezystack/lamejs"],
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
};

export default nextConfig;
