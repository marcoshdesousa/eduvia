// Monta o banco de questões do ENEM (provas oficiais 2009–2023, INEP) a partir dos dados públicos do projeto
// enem-api (github.com/yunger7/enem-api). Gera data/enem/questions.json e as imagens comprimidas em public/enem/.
// Uso (uma vez, ou para atualizar): node scripts/build-enem.mjs <pasta enem-api/public>
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) throw new Error("uso: node scripts/build-enem.mjs <enem-api/public>");
const OUT_JSON = "data/enem/questions.json";
const OUT_IMG = "public/enem";

const AREA = { linguagens: "linguagens", "ciencias-humanas": "humanas", "ciencias-natureza": "natureza", matematica: "matematica" };

// Matéria de cada questão (o ENEM só informa a área): palavras-chave; empate fica com a primeira da lista.
const KEYWORDS = {
  humanas: {
    "História": ["século", "império", "imperial", "colônia", "colonial", "colonização", "escrav", "ditadura", "república", "revolução", "guerra", "medieval", "feudal", "vargas", "getúlio", "monarquia", "idade média", "antiguidade", "grécia antiga", "romano", "independência", "abolição", "cristandade", "reforma protestante", "absolutismo", "iluminismo", "nazis", "fascis", "regime militar", "historiador", "brasil colônia", "jesuít", "quilombo", "indígena", "1964", "golpe", "constituição de"],
    "Geografia": ["clima", "relevo", "solo", "urbaniza", "população", "migra", "agricult", "agropecu", "agronegócio", "indústria", "industrial", "globaliza", "bacia", "chuva", "vegeta", "bioma", "mapa", "cartogra", "territór", "região", "fronteira", "desmatamento", "geográf", "latitude", "longitude", "erosão", "climát", "aquífero", "fuso", "metrópole", "espaço geográfico", "paisagem", "hidrel", "matriz energética", "êxodo"],
    "Filosofia": ["justiça", "liberdade", "conhecimento", "verdade", "moral", "estado de natureza", "contrato social", "pensamento", "pensador", "existência", "sabedoria", "filósof", "filosof", "platão", "aristóteles", "kant", "descartes", "sócrates", "nietzsche", "rousseau", "hobbes", "locke", "maquiavel", "ética", "metafísic", "epicuro", "hume", "hegel", "sartre", "agostinho", "tomás de aquino", "espinosa", "virtude", "pré-socrát", "foucault", "arendt", "estoic"],
    "Sociologia": ["sociedade", "social", "trabalho", "consumo", "democracia", "mídia", "identidade", "cultural", "étnic", "sociolog", "durkheim", "weber", "marx", "bauman", "bourdieu", "movimentos sociais", "movimento social", "cidadania", "desigualdade social", "classe social", "cultura de massa", "indústria cultural", "adorno", "gênero", "racismo", "preconceito", "direitos humanos", "redes sociais", "identidade"],
  },
  natureza: {
    "Biologia": ["doenças", "doença", "saúde", "organismos", "plantas", "animais", "populações", "nutriente", "intestin", "pulmão", "rim", "neurônio", "câncer", "tecido", "dengue", "zika", "malária", "esquistossom", "soro", "veneno", "peçonha", "ecológic", "polinização", "semente", "flor", "folha", "raiz", "célula", "celular", "gene", "genétic", "dna", "rna", "espécie", "ecossistema", "proteína", "vírus", "bactéria", "vegetal", "evolução", "fotossíntese", "enzima", "sangue", "hormônio", "vacina", "cromossomo", "mutação", "seleção natural", "cadeia alimentar", "bioma", "parasita", "infecção", "fungo", "sistema imun", "anticorpo", "glicose", "metabolismo", "mosquito", "inseto", "reprodução", "embrião", "biodiversidade", "transgênic"],
    "Química": ["organoclor", "tóxic", "poluente", "agrotóxic", "solubilidade", "solvente", "mols", "molar", "soluto", "corrosão", "combustível", "biodiesel", "petróleo", "gasolina", "nitrog", "carbono", "oxigênio", "hidrogênio", "sódio", "cálcio", "ferro", "cloro", "enxofre", "dióxido", "monóxido", "reação", "molécula", "átomo", "íon", "ácido", "básico", "ph", "concentração", "combustão", "oxidação", "composto", "químic", "orgânic", "polímero", "substância", "hidrocarboneto", "eletrólise", "pilha", "catalis", "estequio", "isômer", "radioativ", "álcool", "éster", "funções orgânicas", "cátion", "ânion", "neutraliza", "titulação"],
    "Física": ["m/s", "km/h", "joule", "newton", "ohm", "hertz", "intensidade da corrente", "energia elétrica", "usina", "lâmpada", "chuveiro", "aquecedor", "termômetro", "radiação", "satélite", "órbita", "queda", "lançad", "veículo", "freio", "polia", "alavanca", "carga elétrica", "ondas", "comprimento de onda", "espectro", "eco", "decibel", "velocidade", "força", "energia cinética", "energia potencial", "corrente elétrica", "resistor", "resistência elétrica", "frequência", "lente", "espelho", "calor", "aceleração", "circuito", "campo magnético", "refração", "reflexão", "newton", "atrito", "gravidade", "watt", "volt", "ampère", "dilatação", "termodinâm", "óptic", "elétric", "magnét", "colisão", "empuxo", "densidade"],
  },
  linguagens: {
    "Literatura": ["poema", "poeta", "poesia", "romance", "literár", "modernis", "romantis", "verso", "estrofe", "barroco", "realismo", "naturalismo", "parnasian", "simbolis", "arcadismo", "narrador", "machado de assis", "drummond", "clarice", "guimarães rosa", "graciliano", "lírico", "soneto", "cordel", "crônica"],
    "Artes e Educação Física": ["arte", "pintura", "obra de arte", "artista", "música", "dança", "teatro", "escultura", "museu", "grafite", "exposição", "esporte", "atividade física", "exercício físico", "ginástica", "futebol", "capoeira", "olímpi", "atleta", "performance", "cinema", "fotografia", "arquitetura", "instalação artística"],
    "Língua Portuguesa": [],
  },
};

function classify(area, lang, text) {
  if (area === "matematica") return "Matemática";
  if (area === "linguagens" && lang === "ingles") return "Inglês";
  if (area === "linguagens" && lang === "espanhol") return "Espanhol";
  const t = ` ${text.toLowerCase()} `;
  const table = KEYWORDS[area];
  let best = null;
  let bestScore = 0;
  for (const [name, words] of Object.entries(table)) {
    // começo de palavra (evita "som" em "somente"); conta cada ocorrência, até 3 por palavra
    const score = words.reduce((s, w) => s + Math.min(3, (t.match(new RegExp(`(?<![a-zà-ü])${w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g")) ?? []).length), 0);
    if (score > bestScore) [best, bestScore] = [name, score];
  }
  if (area === "linguagens") return bestScore >= 2 ? best : "Língua Portuguesa";
  return best ?? Object.keys(table)[0];
}

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
    return `/enem/${year}/${qdir}/${base}.svg`;
  }
  try {
    await sharp(src).flatten({ background: "#ffffff" }).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(dir, `${base}.webp`));
    imgCount++;
    return `/enem/${year}/${qdir}/${base}.webp`;
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
    out = out.replace(m[0], local ? `![](${local})` : "");
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
        else text = `${text ? `${text}\n\n` : ""}![](${local})`;
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
