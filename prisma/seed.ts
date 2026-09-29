import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PLANS } from "../src/lib/billing";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  for (const p of PLANS) {
    await db.plan.upsert({
      where: { slug: p.slug },
      create: { ...p, limits: {} },
      update: { name: p.name, priceCents: p.priceCents, interval: p.interval },
    });
  }
  console.log(`Planos: ${PLANS.map((p) => p.slug).join(", ")}`);
}

main().finally(() => db.$disconnect());
