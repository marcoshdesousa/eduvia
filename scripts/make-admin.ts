// Uso: npm run admin -- @usuario        (use --remover para tirar o acesso de admin)
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const handle = process.argv.find((a) => a.startsWith("@") || /^[a-z0-9._]+$/.test(a) && a !== "--remover")?.replace(/^@/, "");
  const remove = process.argv.includes("--remover");
  if (!handle) throw new Error("Informe o @ do usuário: npm run admin -- @usuario");
  const user = await db.user.update({ where: { handle }, data: { isAdmin: !remove } });
  console.log(`@${user.handle} ${remove ? "não é mais" : "agora é"} admin.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
