// Acrescenta ao banco (data/enem/questions.json) as provas mais recentes do ENEM, que o enem-api ainda não tem.
// Rode DEPOIS do build-enem.mjs (ele reescreve o arquivo todo). Pode rodar de novo: troca só os anos daqui.
//
//   node scripts/add-enem-recentes.mjs <gpt-4-enem/data> <irw/itemtext/itemtables>
//
// - 2024: github.com/piresramon/gpt-4-enem (MIT) — texto, gabarito e figuras, com o número da questão no caderno.
// - 2024 (Espanhol) e 2025: github.com/ben-domingue/irw (itemtables batch_enem_2024/2025) — texto do próprio INEP,
//   do caderno de acessibilidade (as figuras vêm descritas em palavras). Licença do gov.br: CC BY-ND 3.0, então o
//   texto entra como está. Não traz o número da questão no caderno: fica number 0 (a explicação omite o número).
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { classify } from "./enem-classify.mjs";

const [GPT4, IRW] = process.argv.slice(2);
if (!GPT4 || !IRW) throw new Error("uso: node scripts/add-enem-recentes.mjs <gpt-4-enem/data> <irw/itemtext/itemtables>");
const OUT_JSON = "data/enem/questions.json";
const OUT_IMG = "public/enem";
const YEARS = [2024, 2025];

const areaOf = (n) => (n <= 45 ? "linguagens" : n <= 90 ? "humanas" : n <= 135 ? "natureza" : "matematica");
/** Quebras de linha simples viram parágrafos (no markdown uma quebra sozinha some); títulos "## X" viram negrito. */
const md = (t) =>
  t
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^#{1,6}\s*(.+)$/, "**$1**"))
    .join("\n\n");

const skipped = {};
const skip = (why) => (skipped[why] = (skipped[why] ?? 0) + 1);
const out = [];
let imgCount = 0;

// ---------- 2024: gpt-4-enem ----------
for (const line of (await readFile(path.join(GPT4, "enem/2024.jsonl"), "utf8")).split("\n").filter(Boolean)) {
  const d = JSON.parse(line);
  const n = Number(d.id.replace("questao_", ""));
  const answer = "ABCDE".indexOf(d.label);
  if (answer < 0 || d.alternatives.length !== 5) {
    skip("anulada ou sem gabarito");
    continue;
  }
  // alternativas que são só figuras: a ordem das figuras no arquivo não é garantida — fica de fora
  if (d.alternatives.some((a) => a.includes("[[placeholder]]") || !a.trim())) {
    skip("alternativas em imagem");
    continue;
  }
  const parts = d.question.split("[[placeholder]]");
  if (parts.length - 1 !== d.figures.length) {
    skip("figuras não batem");
    continue;
  }
  let statement = md(parts[0]);
  let ok = true;
  for (let i = 0; i < d.figures.length; i++) {
    const src = path.join(GPT4, d.figures[i]);
    if (!existsSync(src)) {
      ok = false;
      break;
    }
    const dir = path.join(OUT_IMG, "2024", String(n));
    await mkdir(dir, { recursive: true });
    const base = path.basename(src).replace(/\.[^.]+$/, "");
    const info = await sharp(src).flatten({ background: "#ffffff" }).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(dir, `${base}.webp`));
    imgCount++;
    statement += `\n\n![${info.width}x${info.height}](/enem/2024/${n}/${base}.webp)\n\n${md(parts[i + 1])}`;
  }
  if (!ok) {
    skip("imagem que não abre");
    continue;
  }
  statement = statement.replace(/\n{3,}/g, "\n\n").trim();
  const area = areaOf(n);
  const lang = area === "linguagens" && n <= 5 ? "ingles" : null;
  const options = d.alternatives.map(md);
  out.push({ id: `enem-2024-${n}`, year: 2024, number: n, area, lang, subject: classify(area, lang, `${statement} ${options.join(" ")}`), statement, options, answer });
}

// ---------- irw (texto do INEP) ----------
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") row.push(cell), (cell = "");
    else if (c === "\n") row.push(cell), rows.push(row), (row = []), (cell = "");
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const words = (t, list) => list.reduce((s, w) => s + (t.match(new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, "giu")) ?? []).length, 0);
/** Questão de língua estrangeira: o texto-base está em inglês ou espanhol (o enunciado, em português). */
function foreign(t) {
  const en = words(t, ["the", "and", "is", "of", "to", "you", "that", "it", "with", "are", "this", "for"]);
  // só palavras que não existem em português (por, con, una... confundem)
  const es = words(t, ["el", "los", "y", "del", "muy", "pero", "hay", "también", "está", "lo", "yo", "cuando", "nuestro", "nuestra", "ese", "esa"]) + (t.match(/[¿¡ñ]/g) ?? []).length * 2;
  const pt = words(t, ["não", "um", "em", "os", "é", "do", "da", "dos", "das", "ao", "à", "são", "você", "uma"]);
  if (pt > Math.max(en, es)) return null;
  if (en >= 6 && en > es) return "ingles";
  if (es >= 6 && es > en) return "espanhol";
  return null;
}

// texto-base só descrito em português (a imagem tem o inglês): a contagem de palavras não acha
const LANG_FIX = { 2025: { 153930: "ingles" } };
const AREA_IRW = { lc: "linguagens", ch: "humanas", cn: "natureza", mt: "matematica" };
const blank = (v) => !v || v === "NA";
for (const year of [2024, 2025]) {
  for (const [code, area] of Object.entries(AREA_IRW)) {
    // 2024 já veio completo (com números e figuras) do gpt-4-enem, menos o Espanhol
    if (year === 2024 && code !== "lc") continue;
    const file = path.join(IRW, `batch_enem_${year}`, `enem_${year}_1mil_${code}__items.csv`);
    if (!existsSync(file)) {
      skip(`sem arquivo ${year} ${code}`);
      continue;
    }
    const items = new Map();
    for (const r of parseCsv(await readFile(file, "utf8"))) {
      if (!items.has(r.item)) items.set(r.item, []);
      items.get(r.item).push(r);
    }
    for (const [item, rows] of items) {
      const r0 = rows[0];
      const byLetter = new Map(rows.map((r) => [r.resp_raw, r.option_text]));
      const options = [..."ABCDE"].map((l) => byLetter.get(l));
      const answer = "ABCDE".indexOf(r0.correct_response);
      if (answer < 0 || options.some(blank)) {
        skip("alternativa faltando");
        continue;
      }
      const lang = area === "linguagens" ? (LANG_FIX[year]?.[item] ?? foreign(r0.item_text)) : null;
      if (year === 2024 && lang !== "espanhol") continue;
      const statement = md([blank(r0.section_prompt) ? "" : r0.section_prompt, r0.item_text].join("\n"));
      if (statement.length < 20) {
        skip("enunciado vazio");
        continue;
      }
      const opts = options.map((o) => md(o));
      out.push({ id: `enem-${year}-i${item}`, year, number: 0, area, lang, subject: classify(area, lang, `${statement} ${opts.join(" ")}`), statement, options: opts, answer });
    }
  }
}

const bank = JSON.parse(await readFile(OUT_JSON, "utf8")).filter((q) => !YEARS.includes(q.year));
const ids = new Set(bank.map((q) => q.id));
for (const q of out) if (ids.has(q.id)) throw new Error(`id repetido: ${q.id}`);
await writeFile(OUT_JSON, JSON.stringify([...bank, ...out]));
const by = {};
for (const q of out) by[`${q.year} ${q.subject}`] = (by[`${q.year} ${q.subject}`] ?? 0) + 1;
console.log(`${out.length} questões novas (${imgCount} imagens). Puladas:`, skipped);
console.log(by);
