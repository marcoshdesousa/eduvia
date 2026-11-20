// Contas de teste do Diária Paga em Parauapebas/PA (para testar antes de lançar).
// Cria: 1 administrador, 6 clientes e 2 trabalhadores por profissão, com foto, endereço no mapa, agenda aberta,
// plano pago por 1 ano e o Contrate rápido ligado. Usado pelo `npm run demo:seed` e, na fase de teste, pelo próprio
// servidor quando liga (ver src/lib/test-phase.ts).
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/lib/db";
import { cpfHash, sealCpf } from "@/lib/cpf";
import { sealSecret } from "@/lib/secret-box";
import { writeObject } from "@/lib/storage";
import { CATEGORIES, isQuickCategory, hourFromDaily } from "@/lib/domain";

const PASSWORD = "teste1234";
const DEMO_DOMAIN = "demo.diariapaga";
const CITY = "Parauapebas";
const UF = "PA";
const IMG = path.join(process.cwd(), "prisma/demo/img");

/** Bairros de Parauapebas (pontos aproximados no mapa). */
const BAIRROS: [string, number, number][] = [
  ["Cidade Nova", -6.071, -49.893],
  ["Rio Verde", -6.064, -49.901],
  ["Beira Rio", -6.058, -49.895],
  ["Primavera", -6.076, -49.885],
  ["União", -6.072, -49.91],
  ["Liberdade", -6.085, -49.893],
  ["Altamira", -6.061, -49.915],
  ["Jardim Canadá", -6.083, -49.878],
  ["Guanabara", -6.056, -49.908],
  ["Cidade Jardim", -6.09, -49.905],
  ["Novo Horizonte", -6.079, -49.918],
  ["Bairro da Paz", -6.05, -49.888],
];

const NOMES_F = ["Maria", "Ana", "Francisca", "Antônia", "Adriana", "Juliana", "Márcia", "Fernanda", "Patrícia", "Aline", "Sandra", "Camila", "Luana", "Raimunda", "Rosa", "Kelly", "Jéssica", "Débora"];
const NOMES_M = ["José", "João", "Antônio", "Francisco", "Carlos", "Paulo", "Pedro", "Lucas", "Luiz", "Marcos", "Raimundo", "Rafael", "Daniel", "Marcelo", "Bruno", "Edson", "Wesley", "Gilvan"];
const SOBRENOMES = ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", "Rodrigues", "Almeida", "Nascimento", "Araújo", "Ferreira", "Carvalho", "Gomes", "Ribeiro", "Barbosa", "Sousa", "Moraes"];
/** profissões mais femininas no Brasil (só para os nomes de exemplo ficarem naturais) */
const FEM = new Set(["diarista", "passadeira", "lavadeira", "cozinheira", "cuidador-idoso", "baba", "enfermagem", "manicure", "cabeleireiro", "costureira", "compras"]);

/** CPF válido e fixo para cada número (a lista de contas não muda entre execuções). */
function cpfFor(n: number) {
  const base = String(123456000 + n * 7919).padStart(9, "0").slice(-9).split("").map(Number);
  const dv = (a: number[]) => {
    const s = a.reduce((t, v, i) => t + v * (a.length + 1 - i), 0);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  base.push(dv(base));
  base.push(dv(base));
  return base.join("");
}
const fmtCpf = (c: string) => c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

async function saveImage(file: string, key: string) {
  await writeObject(key, readFileSync(path.join(IMG, file)), "image/jpeg");
  return key;
}

async function account(n: number, name: string, role: "USER" | "ADMIN" = "USER") {
  const cpf = cpfFor(n);
  const id = randomUUID();
  await db.user.create({
    data: { id, name, email: `demo-${n}@${DEMO_DOMAIN}`, role, cpfHash: cpfHash(cpf), cpfSealed: sealCpf(cpf), refCode: `TESTE${String(n).padStart(3, "0")}` },
  });
  await db.account.create({ data: { id: randomUUID(), userId: id, providerId: "credential", accountId: id, password: await hashPassword(PASSWORD) } });
  return { id, cpf };
}

/** Já existem contas de teste no banco? */
export const demoExists = async () => (await db.user.count({ where: { email: { endsWith: `@${DEMO_DOMAIN}` } } })) > 0;

/** Apaga só as contas de teste (tudo delas vai junto, em cascata). */
export async function removeDemo() {
  const old = await db.user.findMany({ where: { email: { endsWith: `@${DEMO_DOMAIN}` } }, select: { id: true, cpfHash: true } });
  await db.user.deleteMany({ where: { id: { in: old.map((u) => u.id) } } });
  await db.cpfLedger.deleteMany({ where: { cpfHash: { in: old.map((u) => u.cpfHash) } } });
  return old.length;
}

/** Cria (ou recria) as contas de teste. Devolve a lista em Markdown (docs/CONTAS-DE-TESTE.md). */
export async function seedDemo() {
  await removeDemo();
  const lines: string[] = [];
  let n = 1;

  const admin = await account(n++, "Administrador Teste", "ADMIN");
  lines.push("## Administrador", "", "| Nome | CPF | Senha |", "|---|---|---|", `| Administrador Teste | ${fmtCpf(admin.cpf)} | ${PASSWORD} |`, "");

  lines.push("## Clientes (para contratar)", "", "| Nome | CPF | Senha |", "|---|---|---|");
  const clientes = ["Ana Paula Ribeiro", "Bruno Costa Lima", "Carla Souza Mendes", "Diego Lima Rocha", "Elaine Rocha Silva", "Fábio Nunes Alves"];
  for (const name of clientes) {
    const c = await account(n++, name);
    const [bairro, lat, lng] = BAIRROS[n % BAIRROS.length];
    await db.address.create({ data: { clientId: c.id, label: "Casa", street: "Rua de Teste", number: String(100 + n), district: bairro, city: CITY, uf: UF, lat, lng } });
    lines.push(`| ${name} | ${fmtCpf(c.cpf)} | ${PASSWORD} |`);
  }
  lines.push("");

  lines.push(
    "## Trabalhadores (2 por profissão)",
    "",
    "Plano pago por 1 ano, agenda aberta todos os dias (24 h) e, nas profissões do Contrate rápido, o rápido ligado (⚡).",
    "O segundo das profissões que não têm rápido está no plano Básico, para ver a diferença na vitrine.",
    "",
    "| Profissão | Nome | CPF | Senha | Plano | Bairro | ⚡ Rápido |",
    "|---|---|---|---|---|---|---|",
  );
  const now = new Date();
  const yearEnd = new Date(now.getTime() + 365 * 86_400_000);
  // rostos de exemplo (prisma/demo/img): mulheres e homens
  const FACES_F = [1, 3, 5, 7, 10, 11];
  const FACES_M = [2, 4, 6, 8, 9, 12];
  let face = 0;
  for (const [ci, c] of CATEGORIES.entries()) {
    const quick = isQuickCategory(c.slug);
    for (let k = 0; k < 2; k++) {
      const fem = FEM.has(c.slug) ? k === 0 || ci % 2 === 0 : k === 1 && ci % 3 === 0;
      const first = (fem ? NOMES_F : NOMES_M)[(ci * 2 + k) % 18];
      const name = `${first} ${SOBRENOMES[(ci * 3 + k * 7) % 18]} ${SOBRENOMES[(ci * 5 + k * 11 + 3) % 18]}`;
      const u = await account(n++, name);
      const [bairro, lat, lng] = BAIRROS[(ci * 2 + k) % BAIRROS.length];
      const plan = quick || k === 0 ? "FULL" : "BASIC";
      const price = Math.max(500, Math.round((c.quick * (k === 0 ? 1.1 : 0.95)) / 500) * 500);
      const photoKey = await saveImage(`rosto-${(fem ? FACES_F : FACES_M)[face++ % 6]}.jpg`, `perfil/demo-${u.id}.jpg`);
      const workKey = await saveImage(`trabalho-${c.slug}.jpg`, `portfolio/demo-${u.id}.jpg`);
      const phone = `5594991${String(100000 + n * 37).slice(-6)}`;
      const pro = await db.providerProfile.create({
        data: {
          userId: u.id,
          phoneSealed: sealSecret(phone),
          photoKey,
          quickOn: quick,
          quickTermsAt: quick ? now : null,
          payMethods: ["PIX", "DINHEIRO", "DEBITO", "CREDITO"],
          places: { create: { label: "Casa", district: bairro, city: CITY, uf: UF, lat, lng } },
          availability: { create: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMin: 0, endMin: 1439 })) },
          subscription: { create: { plan, currentPeriodEnd: yearEnd } },
          quickReplies: { create: ["Olá! Tudo bem? Como posso ajudar?", "Chego em 30 minutos", "Estou a caminho", "Cheguei no endereço", "Serviço concluído, obrigado!"].map((text) => ({ text })) },
        },
      });
      await db.providerService.create({
        data: {
          proId: pro.id,
          category: c.slug,
          priceCents: price,
          unit: c.unit,
          // o primeiro de cada profissão por diária também trabalha por hora
          hourCents: c.unit === "DIARIA" && k === 0 ? hourFromDaily(price) : null,
          description: `${c.label} em Parauapebas e região. Conta de TESTE do Diária Paga.`,
          bio: `Perfil de teste. Trabalho com ${c.label.toLowerCase()} há ${3 + ((ci + k) % 15)} anos, atendo ${bairro} e bairros vizinhos.`,
          photoKey,
          whatsapp: phone,
          posts: { create: { proId: pro.id, imageKey: workKey, caption: c.label } },
        },
      });
      lines.push(`| ${c.emoji} ${c.label} | ${name} | ${fmtCpf(u.cpf)} | ${PASSWORD} | ${plan === "FULL" ? "Completo" : "Básico"} | ${bairro} | ${quick ? "sim" : "—"} |`);
    }
  }

  const doc = [
    "# Contas de teste — Diária Paga (Parauapebas/PA)",
    "",
    "Contas **só para teste**, criadas pelo `npm run demo:seed`. Entre com o **CPF** e a senha **" + PASSWORD + "**.",
    "Todas ficam em Parauapebas/PA. Para testar o Contrate rápido, entre como cliente e use um endereço em Parauapebas",
    "(os clientes de teste já têm o endereço “Casa” salvo). Do outro lado, entre como um trabalhador da profissão",
    "em outro celular (ou outra janela anônima) para ver o chamado tocar.",
    "",
    ...lines,
    "",
  ].join("\n");
  return { doc, total: n - 1 };
}
