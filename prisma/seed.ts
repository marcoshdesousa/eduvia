import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_PLANS } from "../src/lib/plans";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// Cria os planos que faltarem. Não sobrescreve preços/limites editados no /admin.
async function main() {
  for (const p of DEFAULT_PLANS) {
    await db.plan.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, name: p.name, order: p.order, priceWeekCents: p.priceWeekCents, priceMonthCents: p.priceMonthCents, limits: p.limits },
      update: {},
    });
  }
  console.log(`Planos: ${DEFAULT_PLANS.map((p) => p.slug).join(", ")}`);
}

main().finally(() => db.$disconnect());
