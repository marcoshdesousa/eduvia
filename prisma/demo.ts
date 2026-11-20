// Contas de teste do Diária Paga em Parauapebas/PA. Uso: npm run demo:seed
// (apaga só as contas de teste anteriores, cria de novo e escreve a lista em docs/CONTAS-DE-TESTE.md)
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { seedDemo } from "@/lib/demo-seed";

seedDemo()
  .then(({ doc, total }) => {
    writeFileSync(path.join(process.cwd(), "docs/CONTAS-DE-TESTE.md"), doc);
    console.log(`[demo] ${total} contas criadas. Lista em docs/CONTAS-DE-TESTE.md`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
