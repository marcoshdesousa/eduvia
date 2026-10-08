// Monta o banco de questões do ENEM (provas oficiais 2009–2023, INEP) a partir dos dados públicos do projeto
// enem-api (github.com/yunger7/enem-api). Gera data/enem/questions.json e as imagens comprimidas em public/enem/.
// Uso (uma vez, ou para atualizar): node scripts/build-enem.mjs <pasta enem-api/public>
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { classify } from "./enem-classify.mjs";

const SRC = process.argv[2];
if (!SRC) throw new Error("uso: node scripts/build-enem.mjs <enem-api/public>");
const OUT_JSON = "data/enem/questions.json";
const OUT_IMG = "public/enem";

const AREA = { linguagens: "linguagens", "ciencias-humanas": "humanas", "ciencias-natureza": "natureza", matematica: "matematica" };

const IMG_RE = /!\[[^\]]*\]\(\s*([^)\s"]+)[^)]*\)/g;
let imgCount = 0;

/** Copia/comprime a imagem para public/enem e devolve o endereço local (ou null se não deu). */
async function localImage(url, year, qdir) {
  const m = url.match(/enem\.dev\/(\d{4})\/questions\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const src = path.join(SRC, m[1], "questions", m[2], m[3]);
  if (!existsSync(src)) return null;
  const ext = path.extname(src).toLowerCase();
  const base = path.basename(src, ext);
  const dir = path.join(OUT_IMG, String(year), qdir);
  await mkdir(dir, { recursive: true });
  if (ext === ".svg") {
    await copyFile(src, path.join(dir, `${base}.svg`));
    imgCount++;
    return { url: `/enem/${year}/${qdir}/${base}.svg`, alt: "" };
  }
  try {
    const info = await sharp(src).flatten({ background: "#ffffff" }).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(dir, `${base}.webp`));
    imgCount++;
    // largura x altura no texto alternativo: a tela reserva o espaço da imagem antes de ela carregar
    return { url: `/enem/${year}/${qdir}/${base}.webp`, alt: `${info.width}x${info.height}` };
  } catch {
    return null;
  }
}

const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", "+": "₊", "-": "₋" };
const ENTITIES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', iacute: "í", aacute: "á", eacute: "é", oacute: "ó", uacute: "ú", atilde: "ã", otilde: "õ", ccedil: "ç", ecirc: "ê", ocirc: "ô", acirc: "â", agrave: "à" };

/** Restos de HTML em algumas questões: subscrito vira caractere (H₂O), <br> vira quebra, o resto sai. */
function cleanHtml(t) {
  return t
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<sub>([0-9+-]+)<\/sub>/gi, (_, d) => [...d].map((c) => SUB[c] ?? c).join(""))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|span|strong|b|em|i|u|sub|sup|font)\b[^>]*>/gi, "")
    .replace(/&(#\d+|[a-z]+);/gi, (m, e) => (e[0] === "#" ? String.fromCharCode(Number(e.slice(1))) : (ENTITIES[e.toLowerCase()] ?? m)));
}

async function rewrite(text, year, qdir) {
  if (!text) return { text: "", ok: true };
  text = cleanHtml(text);
  let ok = true;
  let out = text;
  for (const m of [...text.matchAll(IMG_RE)]) {
    const local = await localImage(m[1], year, qdir);
    if (!local) ok = false;
    out = out.replace(m[0], local ? `![${local.alt}](${local.url})` : "");
  }
  return { text: out.trim(), ok };
}

const out = [];
const skipped = {};
const skip = (why) => (skipped[why] = (skipped[why] ?? 0) + 1);
for (const year of (await readdir(SRC)).filter((y) => /^\d{4}$/.test(y)).sort()) {
  for (const qdir of await readdir(path.join(SRC, year, "questions"))) {
    const file = path.join(SRC, year, "questions", qdir, "details.json");
    if (!existsSync(file)) continue;
    const d = JSON.parse(await readFile(file, "utf8"));
    const area = AREA[d.discipline];
    const alts = d.alternatives ?? [];
    const answer = "ABCDE".indexOf(d.correctAlternative ?? "");
    if (!area || alts.length !== 5 || answer < 0) {
      skip("sem gabarito ou alternativas");
      continue;
    }
    const ctx = await rewrite(d.context, d.year, qdir);
    const intro = await rewrite(d.alternativesIntroduction, d.year, qdir);
    const options = [];
    let ok = ctx.ok && intro.ok;
    for (const a of alts) {
      let text = cleanHtml(a.text ?? "").trim();
      if (a.file) {
        const local = await localImage(a.file, d.year, qdir);
        if (!local) ok = false;
        else text = `${text ? `${text}\n\n` : ""}![${local.alt}](${local.url})`;
      }
      if (!text) ok = false;
      options.push(text);
    }
    if (!ok) {
      skip("imagem que não abre");
      continue;
    }
    const statement = [ctx.text, intro.text].filter(Boolean).join("\n\n");
    if (statement.length < 20) {
      skip("enunciado vazio");
      continue;
    }
    out.push({
      id: `enem-${d.year}-${qdir}`,
      year: d.year,
      number: d.index,
      area,
      lang: d.language ?? null,
      subject: classify(area, d.language, `${statement} ${options.join(" ")}`),
      statement,
      options,
      answer,
    });
  }
}
await mkdir(path.dirname(OUT_JSON), { recursive: true });
await writeFile(OUT_JSON, JSON.stringify(out));
const by = {};
for (const q of out) by[q.subject] = (by[q.subject] ?? 0) + 1;
console.log(`${out.length} questões (${imgCount} imagens). Puladas:`, skipped);
console.log(by);
