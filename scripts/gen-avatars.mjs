// Gera as fotos de perfil (public/avatars/*.svg) — personagens próprios do Eduvia,
// em estilo de retrato (busto), inspirados em arquétipos de heróis, games, monstros e princesas.
// Rodar: node scripts/gen-avatars.mjs
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";

const OUT = "public/avatars";
const LINE = "#1d1a2b";
const SKIN = { clara: "#f6d7c3", rosada: "#f1c3a8", morena: "#d9a37e", parda: "#b97c55", negra: "#7c4a2d", oliva: "#e2b48c" };

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
const s = (w = 2) => `stroke="${LINE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ───────── partes ─────────
function background(a) {
  const [c1, c2] = a.bg;
  return `<defs><radialGradient id="g" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient><clipPath id="c"><circle cx="60" cy="60" r="60"/></clipPath></defs><circle cx="60" cy="60" r="60" fill="url(#g)"/>`;
}

function backdrop(a) {
  const d = a.deco;
  if (d === "stars") return [[18, 26], [98, 18], [104, 52], [14, 64], [30, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#fff" opacity=".8"/>`).join("");
  if (d === "moon") return `<circle cx="96" cy="24" r="10" fill="#fde68a" opacity=".9"/><circle cx="101" cy="20" r="9" fill="${a.bg[0]}"/>`;
  if (d === "rays") return Array.from({ length: 12 }, (_, i) => `<path d="M60 50 L${60 + 90 * Math.cos((i * Math.PI) / 6)} ${50 + 90 * Math.sin((i * Math.PI) / 6)} L${60 + 90 * Math.cos((i * Math.PI) / 6 + 0.18)} ${50 + 90 * Math.sin((i * Math.PI) / 6 + 0.18)} Z" fill="#fff" opacity=".06"/>`).join("");
  if (d === "grid") return Array.from({ length: 7 }, (_, i) => `<path d="M0 ${20 + i * 14} H120" stroke="#fff" opacity=".07"/>`).join("");
  if (d === "snow") return [[16, 30], [100, 26], [92, 70], [22, 74], [40, 14], [80, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff" opacity=".85"/>`).join("");
  if (d === "bubbles") return [[18, 40, 4], [100, 30, 3], [94, 64, 5], [26, 16, 2.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" opacity=".5"/>`).join("");
  return "";
}

function cape(a) {
  if (!a.cape) return "";
  return `<path d="M4 124 Q8 86 34 80 L86 80 Q112 86 116 124 Z" fill="${a.cape}" ${s(2)}/>`;
}

function hairBack(a) {
  const c = a.hairColor;
  switch (a.hair) {
    case "long":
      return `<path d="M36 52 Q33 22 60 22 Q87 22 84 52 L90 104 Q60 112 30 104 Z" fill="${c}" ${s(2)}/>`;
    case "wavy":
      return `<path d="M36 52 Q32 22 60 22 Q88 22 84 52 Q92 66 86 78 Q94 92 84 104 Q60 112 36 104 Q26 92 34 78 Q28 66 36 52 Z" fill="${c}" ${s(2)}/>`;
    case "verylong":
      return `<path d="M37 52 Q34 22 60 22 Q86 22 83 52 L92 124 L28 124 Z" fill="${c}" ${s(2)}/>`;
    case "braid":
      return `<path d="M76 56 Q90 70 84 84 Q92 94 84 104 Q90 114 82 122" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M76 56 Q90 70 84 84 Q92 94 84 104 Q90 114 82 122" fill="none" stroke="${shade(c, -0.25)}" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    case "ponytail":
      return `<path d="M76 34 Q100 40 94 70 Q92 84 84 92 Q88 70 78 54 Z" fill="${c}" ${s(2)}/>`;
    case "bob":
      return `<path d="M37 52 Q34 22 60 22 Q86 22 83 52 L86 74 Q72 80 60 78 Q48 80 34 74 Z" fill="${c}" ${s(2)}/>`;
    case "curly":
      return [[38, 44, 10], [82, 44, 10], [36, 62, 9], [84, 62, 9], [40, 78, 8], [80, 78, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${s(1.6)}/>`).join("");
    case "snakes":
      return Array.from({ length: 8 }, (_, i) => {
        const x = 34 + i * 7.5;
        return `<path d="M${x} 36 Q${x - 10} ${54 + (i % 2) * 8} ${x - 2} ${72 + (i % 3) * 6} Q${x + 6} ${84} ${x - 4} ${92}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="${x - 4}" cy="92" r="3" fill="${c}" ${s(1)}/>`;
      }).join("");
    default:
      return "";
  }
}

function torso(a) {
  const c = a.suit;
  const c2 = a.suit2 ?? shade(c, -0.25);
  let out = `<path d="M10 124 Q12 94 40 89 L80 89 Q108 94 110 124 Z" fill="${c}" ${s(2.2)}/>`;
  switch (a.pattern) {
    case "web":
      out += `<g stroke="${shade(c, -0.5)}" stroke-width="1" fill="none" opacity=".8"><path d="M60 92 L30 124 M60 92 L60 124 M60 92 L90 124 M60 92 L18 106 M60 92 L102 106"/><path d="M40 104 Q60 98 80 104 M30 116 Q60 108 90 116"/></g>`;
      break;
    case "stripes":
      out += `<path d="M44 89 L52 124 M76 89 L68 124" stroke="${c2}" stroke-width="6"/>`;
      break;
    case "armor":
      out += `<path d="M30 98 Q60 90 90 98 L94 124 L26 124 Z" fill="${c2}" ${s(1.6)}/><circle cx="60" cy="106" r="6" fill="#bff6ff" stroke="#e0fbff" stroke-width="2"/><circle cx="60" cy="106" r="11" fill="#7ee7ff" opacity=".25"/>`;
      break;
    case "collar":
      out += `<path d="M40 89 L60 104 L80 89 L74 89 L60 98 L46 89 Z" fill="${c2}" ${s(1.4)}/>`;
      break;
    case "jacket":
      out += `<path d="M44 89 L60 112 L76 89" fill="none" stroke="${c2}" stroke-width="5"/><path d="M60 112 L60 124" stroke="${LINE}" stroke-width="1.5"/>`;
      break;
    case "dress":
      out = `<path d="M10 124 Q12 100 36 96 Q60 104 84 96 Q108 100 110 124 Z" fill="${c}" ${s(2.2)}/><path d="M36 96 Q60 104 84 96" fill="none" stroke="${c2}" stroke-width="3"/>`;
      break;
    case "robe":
      out += `<path d="M48 89 L60 124 L72 89" fill="${c2}" ${s(1.4)}/>`;
      break;
    case "bandage":
      out += `<g stroke="${shade(c, -0.2)}" stroke-width="1.4" opacity=".9"><path d="M14 112 L106 104 M18 120 L104 114 M24 100 L96 96"/></g>`;
      break;
    case "hoodie":
      out += `<path d="M40 89 Q60 104 80 89" fill="none" stroke="${c2}" stroke-width="5"/><path d="M54 98 L54 112 M66 98 L66 112" stroke="#fff" stroke-width="1.4"/>`;
      break;
  }
  if (a.emblem) out += emblem(a.emblem, a.emblemColor ?? "#fde047", a.pattern === "dress" ? 112 : 108);
  if (a.necklace) out += `<path d="M48 94 Q60 104 72 94" fill="none" stroke="${a.necklace}" stroke-width="2"/><circle cx="60" cy="101" r="2.6" fill="${a.necklace}" ${s(1)}/>`;
  return out;
}

function emblem(kind, color, y) {
  const g = (d) => `<g transform="translate(60 ${y})">${d}</g>`;
  switch (kind) {
    case "star":
      return g(`<path d="M0 -9 L2.6 -2.8 L9 -2.8 L3.8 1.4 L5.6 8 L0 4 L-5.6 8 L-3.8 1.4 L-9 -2.8 L-2.6 -2.8 Z" fill="${color}" ${s(1.2)}/>`);
    case "bolt":
      return g(`<path d="M2 -10 L-6 1 L0 1 L-3 10 L7 -2 L1 -2 Z" fill="${color}" ${s(1.2)}/>`);
    case "spider":
      return g(`<ellipse rx="3" ry="5" fill="${color}"/><path d="M-3 -2 L-10 -7 M-3 1 L-11 0 M-3 3 L-10 8 M3 -2 L10 -7 M3 1 L11 0 M3 3 L10 8" stroke="${color}" stroke-width="1.6"/>`);
    case "diamond":
      return g(`<path d="M0 -9 L10 -2 L0 9 L-10 -2 Z" fill="#f8fafc" ${s(1.2)}/><text y="3" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="9" fill="${color}">E</text>`);
    case "wing":
      return g(`<path d="M-12 0 Q-6 -8 0 -2 Q6 -8 12 0 Q6 -2 0 4 Q-6 -2 -12 0 Z" fill="${color}" ${s(1.2)}/>`);
    case "ring":
      return g(`<circle r="7" fill="none" stroke="${color}" stroke-width="3"/><rect x="-6" y="-2" width="12" height="4" fill="${color}"/>`);
    case "trident":
      return g(`<path d="M0 9 L0 -8 M-6 -8 L-6 -2 Q0 2 6 -2 L6 -8" fill="none" stroke="${color}" stroke-width="2.2"/>`);
    case "moon":
      return g(`<circle r="7" fill="${color}"/><circle cx="3" cy="-2" r="6" fill="${shade(color, -0.6)}"/>`);
    case "flame":
      return g(`<path d="M0 -10 Q8 -2 5 5 Q3 9 0 9 Q-6 9 -6 3 Q-6 -2 -1 -4 Q-2 0 1 1 Q2 -4 0 -10 Z" fill="${color}" ${s(1.2)}/>`);
    case "snowflake":
      return g(`<path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="${color}" stroke-width="2"/>`);
    case "shell":
      return g(`<path d="M-8 4 Q0 -10 8 4 Z" fill="${color}" ${s(1.2)}/><path d="M0 4 L0 -5 M-4 4 L-2 -3 M4 4 L2 -3" stroke="${LINE}" stroke-width=".8"/>`);
    case "rose":
      return g(`<circle r="5" fill="${color}" ${s(1.2)}/><path d="M-2 -1 Q0 -4 2 -1 Q0 2 -2 -1" fill="none" stroke="${LINE}" stroke-width=".8"/><path d="M-5 4 Q-9 6 -9 2" fill="#22c55e"/>`);
    case "sun":
      return g(`<circle r="5" fill="${color}" ${s(1.2)}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${7 * Math.cos((i * Math.PI) / 4)} ${7 * Math.sin((i * Math.PI) / 4)} L${10 * Math.cos((i * Math.PI) / 4)} ${10 * Math.sin((i * Math.PI) / 4)}" stroke="${color}" stroke-width="1.6"/>`).join(""));
    case "flower":
      return g(Array.from({ length: 5 }, (_, i) => `<circle cx="${5 * Math.cos((i * 2 * Math.PI) / 5)}" cy="${5 * Math.sin((i * 2 * Math.PI) / 5)}" r="3.4" fill="${color}"/>`).join("") + `<circle r="2.4" fill="#fde047"/>`);
    case "skull":
      return g(`<circle cy="-2" r="6" fill="#f1f5f9" ${s(1)}/><rect x="-3.5" y="2" width="7" height="5" rx="1" fill="#f1f5f9" ${s(1)}/><circle cx="-2.3" cy="-2" r="1.5" fill="${LINE}"/><circle cx="2.3" cy="-2" r="1.5" fill="${LINE}"/>`);
    case "crosshair":
      return g(`<circle r="7" fill="none" stroke="${color}" stroke-width="2"/><path d="M0 -10 V-4 M0 4 V10 M-10 0 H-4 M4 0 H10" stroke="${color}" stroke-width="2"/>`);
    case "controller":
      return g(`<rect x="-10" y="-5" width="20" height="10" rx="5" fill="${color}" ${s(1.2)}/><path d="M-6 0 H-2 M-4 -2 V2" stroke="${LINE}" stroke-width="1.2"/><circle cx="4" cy="-1" r="1.2" fill="${LINE}"/><circle cx="6.5" cy="1.5" r="1.2" fill="${LINE}"/>`);
    case "x":
      return g(`<path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="${color}" stroke-width="3"/>`);
    default:
      return "";
  }
}

function neckAndHead(a) {
  const skin = a.skin;
  const covered = a.mask === "full" || a.mask === "helmet";
  const headFill = covered ? a.maskColor : skin;
  let out = "";
  out += `<path d="M51 70 L51 90 Q60 95 69 90 L69 70 Z" fill="${a.mask === "full" ? a.maskColor : skin}" ${s(2)}/>`;
  if (!covered && !a.noEars) out += `<ellipse cx="40.5" cy="54" rx="3.6" ry="5.5" fill="${skin}" ${s(1.8)}/><ellipse cx="79.5" cy="54" rx="3.6" ry="5.5" fill="${skin}" ${s(1.8)}/>`;
  // rosto um pouco mais fino no queixo (adulto)
  out += `<path d="M41 50 Q41 27 60 27 Q79 27 79 50 Q79 66 70 74 Q65 79 60 79 Q55 79 50 74 Q41 66 41 50 Z" fill="${headFill}" ${s(2.2)}/>`;
  if (a.faceShade !== false && !covered) out += `<path d="M44 62 Q48 74 60 78 Q52 72 49 62 Z" fill="${shade(skin, -0.12)}" opacity=".5"/>`;
  return out;
}

function eyes(a) {
  if (a.mask === "full" || (a.mask === "helmet" && a.lenses)) {
    const lens = a.lensColor ?? "#ffffff";
    return `<path d="M43 47 Q51 40 58 49 Q50 56 43 47 Z" fill="${lens}" ${s(1.8)}/><path d="M77 47 Q69 40 62 49 Q70 56 77 47 Z" fill="${lens}" ${s(1.8)}/>`;
  }
  if (a.mask === "helmet") return "";
  const iris = a.eyes ?? "#3b2a1f";
  const glow = a.glow ? `<circle cx="51.5" cy="51" r="4" fill="${iris}" opacity=".35"/><circle cx="68.5" cy="51" r="4" fill="${iris}" opacity=".35"/>` : "";
  const lash = a.female ? `<path d="M45 50 Q51 45.5 58 50" fill="none" stroke="${LINE}" stroke-width="1.8"/><path d="M75 50 Q69 45.5 62 50" fill="none" stroke="${LINE}" stroke-width="1.8"/><path d="M45 50 L43.5 48.5 M75 50 L76.5 48.5" stroke="${LINE}" stroke-width="1.4"/>` : "";
  return `${glow}<path d="M45 51 Q51 46.5 58 51 Q51 54.5 45 51 Z" fill="#fff" ${s(1.2)}/><path d="M75 51 Q69 46.5 62 51 Q69 54.5 75 51 Z" fill="#fff" ${s(1.2)}/><circle cx="51.5" cy="50.8" r="2.4" fill="${iris}"/><circle cx="68.5" cy="50.8" r="2.4" fill="${iris}"/><circle cx="51.5" cy="50.8" r="1" fill="${LINE}"/><circle cx="68.5" cy="50.8" r="1" fill="${LINE}"/><circle cx="52.2" cy="50" r=".6" fill="#fff"/><circle cx="69.2" cy="50" r=".6" fill="#fff"/>${lash}`;
}

function face(a) {
  const covered = a.mask === "full" || a.mask === "helmet";
  if (covered) return "";
  const brow = a.browColor ?? shade(a.hairColor ?? "#3b2a1f", -0.2);
  const angry = a.brows === "angry";
  let out = angry
    ? `<path d="M44 44.5 L57 47" stroke="${brow}" stroke-width="2.4" stroke-linecap="round"/><path d="M76 44.5 L63 47" stroke="${brow}" stroke-width="2.4" stroke-linecap="round"/>`
    : `<path d="M44 45 Q50 42 57 44.5" fill="none" stroke="${brow}" stroke-width="${a.female ? 1.8 : 2.4}" stroke-linecap="round"/><path d="M76 45 Q70 42 63 44.5" fill="none" stroke="${brow}" stroke-width="${a.female ? 1.8 : 2.4}" stroke-linecap="round"/>`;
  out += `<path d="M60 54 L58 62 Q60 63.5 62.5 62.2" fill="none" stroke="${shade(a.skin, -0.35)}" stroke-width="1.6" stroke-linecap="round"/>`;
  const lip = a.lips ?? (a.female ? "#c2566b" : null);
  if (a.mouth === "fangs") {
    out += `<path d="M53 68 Q60 72 67 68" fill="${shade(a.skin, -0.5)}" ${s(1.4)}/><path d="M55.5 68.8 L56.8 72.6 L58 69.3 M62 69.3 L63.2 72.6 L64.5 68.8" fill="#fff" ${s(0.8)}/>`;
  } else if (a.mouth === "grin") {
    out += `<path d="M52 67 Q60 74 68 67 Q60 70 52 67 Z" fill="#fff" ${s(1.4)}/>`;
  } else if (a.mouth === "stitched") {
    out += `<path d="M52 69 H68" stroke="${LINE}" stroke-width="1.6"/><path d="M54 67 V71 M58 67 V71 M62 67 V71 M66 67 V71" stroke="${LINE}" stroke-width="1"/>`;
  } else if (lip) {
    out += `<path d="M54 68 Q57 66 60 67.2 Q63 66 66 68 Q60 72.5 54 68 Z" fill="${lip}" ${s(1.1)}/>`;
  } else {
    out += `<path d="M54 68.5 Q60 71 66 68.5" fill="none" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  if (a.beard) out += `<path d="M44 60 Q46 78 60 81 Q74 78 76 60 Q72 70 66 70 Q60 66 54 70 Q48 70 44 60 Z" fill="${a.beard}" ${s(1.6)}/>`;
  if (a.stubble) out += `<path d="M46 64 Q50 77 60 79 Q70 77 74 64 Q68 74 60 74 Q52 74 46 64 Z" fill="${shade(a.skin, -0.3)}" opacity=".35"/>`;
  if (a.blush) out += `<ellipse cx="47" cy="60" rx="3.5" ry="2" fill="#f472b6" opacity=".3"/><ellipse cx="73" cy="60" rx="3.5" ry="2" fill="#f472b6" opacity=".3"/>`;
  if (a.scar) out += `<path d="M69 40 L73 58" stroke="#9f1239" stroke-width="1.6"/><path d="M68 46 L73 45 M69 52 L74 51" stroke="#9f1239" stroke-width="1"/>`;
  if (a.stitches) out += `<path d="M46 36 Q60 32 74 36" fill="none" stroke="${LINE}" stroke-width="1.4"/><path d="M50 33 V38 M56 32 V37 M62 32 V37 M68 33 V38" stroke="${LINE}" stroke-width="1"/>`;
  if (a.facepaint === "skull") out += `<circle cx="51.5" cy="50.5" r="6" fill="${LINE}" opacity=".85"/><circle cx="68.5" cy="50.5" r="6" fill="${LINE}" opacity=".85"/><circle cx="51.5" cy="50.5" r="1.6" fill="${a.eyes ?? "#fff"}"/><circle cx="68.5" cy="50.5" r="1.6" fill="${a.eyes ?? "#fff"}"/><path d="M58 60 L60 56 L62 60 Z" fill="${LINE}"/>`;
  if (a.warpaint) out += `<path d="M43 57 L52 58 M77 57 L68 58" stroke="${a.warpaint}" stroke-width="2.4" stroke-linecap="round"/>`;
  if (a.freckles) out += [[49, 58], [52, 59.5], [68, 59.5], [71, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${shade(a.skin, -0.4)}"/>`).join("");
  if (a.earrings) out += `<circle cx="40.5" cy="61" r="1.8" fill="${a.earrings}" ${s(0.8)}/><circle cx="79.5" cy="61" r="1.8" fill="${a.earrings}" ${s(0.8)}/>`;
  if (a.gem) out += `<path d="M60 33 L63 36.5 L60 40 L57 36.5 Z" fill="${a.gem}" ${s(1)}/>`;
  return out;
}

function mask(a) {
  const c = a.maskColor;
  switch (a.mask) {
    case "domino":
      return `<path d="M41 49 Q50 42 60 48 Q70 42 79 49 Q78 57 69 56.5 Q60 53 51 56.5 Q42 57 41 49 Z" fill="${c}" ${s(1.6)}/><path d="M45.5 51 Q51 47.5 57 51 Q51 54 45.5 51 Z M74.5 51 Q69 47.5 63 51 Q69 54 74.5 51 Z" fill="#fff"/>`;
    case "full":
      if (a.pattern === "web") return `<g stroke="${shade(c, -0.5)}" stroke-width=".9" fill="none" opacity=".85"><path d="M60 27 V79 M41 50 H79 M46 33 L74 71 M74 33 L46 71"/><path d="M50 40 Q60 35 70 40 M46 60 Q60 54 74 60 M52 70 Q60 66 68 70"/></g>`;
      return "";
    case "cowl":
      return `<path d="M39 58 Q37 24 60 24 Q83 24 81 58 L79 62 Q70 56 60 58 Q50 56 41 62 Z" fill="${c}" ${s(2)}/>${a.cowlEars ? `<path d="M44 34 L46 16 L52 28 Z M76 34 L74 16 L68 28 Z" fill="${c}" ${s(1.6)}/>` : ""}<path d="M44 49 Q51 45 57 50 Q51 53 44 49 Z M76 49 Q69 45 63 50 Q69 53 76 49 Z" fill="#fff"/>`;
    case "helmet":
      return `<path d="M44 46 H76 L74 60 Q60 66 46 60 Z" fill="${a.faceplate ?? "#facc15"}" ${s(1.6)}/>${a.lenses ? "" : `<path d="M47 50 H57 M63 50 H73" stroke="${a.lensColor ?? "#7ee7ff"}" stroke-width="2.6" stroke-linecap="round"/>`}<path d="M54 68 H66" stroke="${LINE}" stroke-width="1.2"/>`;
    case "visor":
      return `<path d="M40 44 Q60 38 80 44 L79 55 Q60 50 41 55 Z" fill="${c}" opacity=".92" ${s(1.6)}/><path d="M44 46 Q60 42 76 46" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>`;
    case "ninja":
      return `<path d="M41 56 Q60 52 79 56 L79 70 Q70 79 60 80 Q50 79 41 70 Z" fill="${c}" ${s(1.8)}/>`;
    case "bandages":
      return `<g stroke="${shade("#e7dcc4", -0.25)}" stroke-width="1.2" fill="none"><path d="M42 38 L78 34 M41 44 L79 41 M42 60 L78 56 M44 66 L76 63 M48 72 L72 70"/></g>`;
    default:
      return "";
  }
}

function hairFront(a) {
  const c = a.hairColor;
  const sw = s(2);
  switch (a.hair) {
    case "short":
      return `<path d="M40 50 Q37 23 60 23 Q83 23 80 50 Q77 35 64 34 Q52 33 44 40 Q41 44 40 50 Z" fill="${c}" ${sw}/>`;
    case "side":
      return `<path d="M40 52 Q36 22 62 22 Q85 24 80 48 Q72 33 54 37 Q45 41 40 52 Z" fill="${c}" ${sw}/>`;
    case "slick":
      return `<path d="M40 48 Q39 24 60 23 Q81 24 80 48 Q76 34 60 42 Q44 34 40 48 Z" fill="${c}" ${sw}/>`;
    case "spiky":
      return `<path d="M39 50 L36 30 L46 34 L46 20 L55 30 L60 16 L65 30 L74 20 L74 34 L84 30 L81 50 Q74 36 60 36 Q46 36 39 50 Z" fill="${c}" ${sw}/>`;
    case "mohawk":
      return `<path d="M54 36 L52 12 L60 18 L62 8 L67 18 L70 12 L66 36 Z" fill="${c}" ${sw}/><path d="M41 46 Q42 34 52 31 M79 46 Q78 34 68 31" stroke="${shade(c, -0.3)}" stroke-width="2" fill="none"/>`;
    case "long":
    case "wavy":
    case "verylong":
    case "bob":
      return `<path d="M39 54 Q37 25 60 25 Q83 25 81 54 Q78 38 66 33 Q60 42 46 40 Q41 45 39 54 Z" fill="${c}" ${sw}/>`;
    case "braid":
    case "ponytail":
      return `<path d="M40 50 Q38 24 60 24 Q82 24 80 50 Q76 34 60 33 Q44 34 40 50 Z" fill="${c}" ${sw}/>`;
    case "bun":
      return `<circle cx="60" cy="20" r="9" fill="${c}" ${sw}/><path d="M40 50 Q38 25 60 25 Q82 25 80 50 Q76 35 60 33 Q44 35 40 50 Z" fill="${c}" ${sw}/>`;
    case "curly":
      return [[44, 34, 8], [52, 28, 8], [60, 26, 8], [68, 28, 8], [76, 34, 8], [42, 44, 6], [78, 44, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${s(1.6)}/>`).join("");
    case "afro":
      return `<path d="M34 56 Q24 20 60 14 Q96 20 86 56 Q82 38 60 36 Q38 38 34 56 Z" fill="${c}" ${sw}/>`;
    case "snakes":
      return Array.from({ length: 6 }, (_, i) => `<path d="M${44 + i * 6.4} 34 Q${40 + i * 6.4} 22 ${46 + i * 6.4} 16" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="${46 + i * 6.4}" cy="16" r="3" fill="${c}" ${s(1)}/>`).join("") + `<path d="M40 48 Q40 28 60 28 Q80 28 80 48 Q72 36 60 36 Q48 36 40 48 Z" fill="${c}" ${sw}/>`;
    case "buzz":
      return `<path d="M41 46 Q40 26 60 26 Q80 26 79 46 Q74 33 60 32 Q46 33 41 46 Z" fill="${c}" opacity=".9"/>`;
    default:
      return "";
  }
}

function hat(a) {
  const c = a.hatColor ?? "#facc15";
  switch (a.hat) {
    case "tiara":
      return `<path d="M44 34 Q60 28 76 34 L74 37 Q60 32 46 37 Z" fill="${c}" ${s(1.2)}/><path d="M60 24 L64 31 L60 34 L56 31 Z" fill="${a.gemColor ?? "#38bdf8"}" ${s(1.2)}/>`;
    case "crown":
      return `<path d="M44 30 L46 14 L53 22 L60 10 L67 22 L74 14 L76 30 Z" fill="${c}" ${s(1.6)}/><circle cx="60" cy="24" r="2.4" fill="${a.gemColor ?? "#ef4444"}"/>`;
    case "horns":
      return `<path d="M44 32 Q32 22 34 8 Q40 22 50 28 Z M76 32 Q88 22 86 8 Q80 22 70 28 Z" fill="${c}" ${s(1.6)}/>`;
    case "witch":
      return `<path d="M26 34 Q60 26 94 34 Q60 42 26 34 Z" fill="${c}" ${s(1.8)}/><path d="M42 33 Q50 18 56 4 Q66 2 78 18 L80 34 Z" fill="${c}" ${s(1.8)}/><path d="M43 30 Q60 26 79 30 L79 34 Q60 30 43 34 Z" fill="${a.gemColor ?? "#a855f7"}"/>`;
    case "wolf":
      return `<path d="M40 38 L36 12 L52 28 Z M80 38 L84 12 L68 28 Z" fill="${c}" ${s(1.8)}/><path d="M41 34 L39 20 L48 29 Z M79 34 L81 20 L72 29 Z" fill="#fda4af" opacity=".7"/>`;
    case "headset":
      return `<path d="M38 50 Q38 20 60 20 Q82 20 82 50" fill="none" stroke="${c}" stroke-width="4"/><rect x="33" y="46" width="9" height="14" rx="4" fill="${c}" ${s(1.4)}/><rect x="78" y="46" width="9" height="14" rx="4" fill="${c}" ${s(1.4)}/><path d="M38 58 Q40 70 52 70" fill="none" stroke="${c}" stroke-width="2"/><circle cx="53" cy="70" r="2.2" fill="${a.gemColor ?? "#22d3ee"}"/>`;
    case "cap":
      return `<path d="M39 42 Q40 22 60 22 Q80 22 81 42 Z" fill="${c}" ${s(1.8)}/><path d="M74 36 Q92 34 98 42 Q86 44 74 42 Z" fill="${shade(c, -0.25)}" ${s(1.6)}/><path d="M56 30 H64" stroke="#fff" stroke-width="2"/>`;
    case "hood":
      return `<path d="M30 70 Q28 14 60 14 Q92 14 90 70 Q86 46 80 40 Q70 30 60 30 Q50 30 40 40 Q34 46 30 70 Z" fill="${c}" ${s(2)}/>`;
    case "wings":
      return `<path d="M40 40 Q40 22 60 22 Q80 22 80 40 Z" fill="#cbd5e1" ${s(1.6)}/><path d="M40 34 Q26 26 22 12 Q34 20 42 26 Z M80 34 Q94 26 98 12 Q86 20 78 26 Z" fill="#f8fafc" ${s(1.4)}/>`;
    case "bandana":
      return `<path d="M40 40 Q60 34 80 40 L80 46 Q60 40 40 46 Z" fill="${c}" ${s(1.4)}/><path d="M80 42 L94 36 M80 44 L92 50" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    case "wizard":
      return `<path d="M30 36 Q60 28 90 36 Q60 44 30 36 Z" fill="${c}" ${s(1.8)}/><path d="M42 35 L62 0 L78 35 Z" fill="${c}" ${s(1.8)}/><path d="M60 14 L62 18 L66 18 L63 21 L64 25 L60 22 L56 25 L57 21 L54 18 L58 18 Z" fill="#fde047"/>`;
    case "veil":
      return `<path d="M36 40 Q60 20 84 40 L96 124 L24 124 Z" fill="#f8fafc" opacity=".45" ${s(1.2)}/><path d="M44 32 Q60 26 76 32" fill="none" stroke="#e2e8f0" stroke-width="3"/>`;
    case "flower":
      return `<g transform="translate(76 34)">${Array.from({ length: 5 }, (_, i) => `<circle cx="${4 * Math.cos((i * 2 * Math.PI) / 5)}" cy="${4 * Math.sin((i * 2 * Math.PI) / 5)}" r="3.2" fill="${c}" ${s(0.8)}/>`).join("")}<circle r="2" fill="#fde047"/></g>`;
    case "helmet-knight":
      return `<path d="M38 52 Q36 18 60 18 Q84 18 82 52 L78 52 Q78 30 60 28 Q42 30 42 52 Z" fill="${c}" ${s(1.8)}/><path d="M60 18 Q66 6 74 8 Q68 12 64 20" fill="#ef4444" ${s(1.2)}/>`;
    case "beanie":
      return `<path d="M39 42 Q38 18 60 18 Q82 18 81 42 Z" fill="${c}" ${s(1.8)}/><rect x="38" y="38" width="44" height="7" rx="3" fill="${shade(c, -0.2)}" ${s(1.4)}/><circle cx="60" cy="16" r="4" fill="${shade(c, 0.3)}" ${s(1.2)}/>`;
    case "ears-cat":
      return `<path d="M42 36 L44 18 L54 30 Z M78 36 L76 18 L66 30 Z" fill="${c}" ${s(1.6)}/>`;
    default:
      return "";
  }
}

function extras(a) {
  let out = "";
  if (a.bolts) out += `<rect x="45" y="80" width="5" height="5" fill="#94a3b8" ${s(1)}/><rect x="70" y="80" width="5" height="5" fill="#94a3b8" ${s(1)}/>`;
  if (a.scythe) out += `<path d="M104 124 L98 30" stroke="#78350f" stroke-width="3"/><path d="M98 30 Q80 20 70 34 Q86 28 98 38 Z" fill="#cbd5e1" ${s(1.4)}/>`;
  if (a.sword) out += `<path d="M14 124 L28 72" stroke="#cbd5e1" stroke-width="4"/><path d="M20 98 L32 102" stroke="#a16207" stroke-width="4"/>`;
  if (a.bow) out += `<path d="M100 120 Q116 84 100 52" fill="none" stroke="#92400e" stroke-width="3"/><path d="M100 52 L100 120" stroke="#e5e7eb" stroke-width="1"/>`;
  if (a.staff) out += `<path d="M104 124 L102 40" stroke="#78350f" stroke-width="3"/><circle cx="102" cy="36" r="6" fill="${a.staff}" ${s(1.4)}/><circle cx="102" cy="36" r="10" fill="${a.staff}" opacity=".25"/>`;
  if (a.sparkles) out += [[20, 40], [100, 44], [92, 16]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5} Z" fill="${a.sparkles}"/>`).join("");
  return out;
}

function svg(a) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${background(a)}<g clip-path="url(#c)">${backdrop(a)}${extras({ scythe: a.scythe, staff: a.staff, bow: a.bow, sword: a.sword })}${cape(a)}${hairBack(a)}${torso(a)}${neckAndHead(a)}${eyes(a)}${face(a)}${mask(a)}${a.hat === "hood" ? "" : hairFront(a)}${hat(a)}${extras({ bolts: a.bolts, sparkles: a.sparkles })}</g></svg>`;
}

// ───────── personagens ─────────
const BG = {
  azul: ["#3b82f6", "#1e3a8a"],
  vermelho: ["#ef4444", "#7f1d1d"],
  roxo: ["#8b5cf6", "#3b0764"],
  verde: ["#22c55e", "#14532d"],
  noite: ["#334155", "#0f172a"],
  laranja: ["#fb923c", "#7c2d12"],
  dourado: ["#fbbf24", "#78350f"],
  ciano: ["#22d3ee", "#164e63"],
  rosa: ["#f472b6", "#831843"],
  gelo: ["#bae6fd", "#1e40af"],
  halloween: ["#7c3aed", "#1e1b4b"],
  sangue: ["#991b1b", "#1c0a0a"],
  pantano: ["#4d7c0f", "#1a2e05"],
};

export const AVATARS = [
  // ── Heróis (cidade): teia, escudo, armadura, trovão, garra... ──
  { id: "h-teia", label: "Teia", category: "herois", gender: "M", free: true, bg: BG.ciano, deco: "grid", skin: SKIN.clara, mask: "full", maskColor: "#18181b", lensColor: "#5eead4", suit: "#18181b", suit2: "#0f766e", pattern: "web", emblem: "spider", emblemColor: "#2dd4bf" },
  { id: "h-escudo", label: "Capitão Escudo", category: "herois", gender: "M", bg: BG.azul, deco: "stars", skin: SKIN.clara, hair: "short", hairColor: "#a16207", mask: "cowl", maskColor: "#1e40af", suit: "#1e3a8a", suit2: "#ef4444", pattern: "stripes", emblem: "star", emblemColor: "#f8fafc", stubble: true },
  { id: "h-armadura", label: "Armadura", category: "herois", gender: "M", bg: BG.dourado, deco: "rays", skin: SKIN.morena, mask: "helmet", maskColor: "#b91c1c", faceplate: "#fbbf24", lensColor: "#a5f3fc", suit: "#b91c1c", suit2: "#fbbf24", pattern: "armor" },
  { id: "h-trovao", label: "Trovão", category: "herois", gender: "M", bg: BG.noite, deco: "stars", skin: SKIN.clara, hair: "long", hairColor: "#facc15", beard: "#ca8a04", eyes: "#38bdf8", suit: "#334155", suit2: "#94a3b8", pattern: "armor", cape: "#b91c1c", hat: "wings", brows: "angry" },
  { id: "h-garra", label: "Garra", category: "herois", gender: "M", bg: BG.roxo, deco: "grid", skin: SKIN.negra, mask: "cowl", maskColor: "#18181b", cowlEars: true, suit: "#18181b", suit2: "#a855f7", pattern: "collar", emblem: "x", emblemColor: "#c084fc", stubble: true },
  { id: "h-teia-f", label: "Teia Rosa", category: "herois", gender: "F", free: true, female: true, bg: BG.rosa, deco: "grid", skin: SKIN.clara, mask: "full", maskColor: "#f8fafc", lensColor: "#ffffff", hair: "bob", hairColor: "#f9a8d4", suit: "#f8fafc", suit2: "#ec4899", pattern: "web", emblem: "spider", emblemColor: "#ec4899", hat: "hood", hatColor: "#ec4899" },
  { id: "h-feiticeira", label: "Feiticeira", category: "herois", gender: "F", female: true, bg: BG.vermelho, deco: "stars", skin: SKIN.clara, hair: "wavy", hairColor: "#b91c1c", eyes: "#ef4444", glow: true, suit: "#991b1b", suit2: "#7f1d1d", pattern: "collar", hat: "tiara", hatColor: "#dc2626", gemColor: "#7f1d1d", sparkles: "#fca5a5" },
  { id: "h-espia", label: "Espiã", category: "herois", gender: "F", female: true, bg: BG.noite, deco: "grid", skin: SKIN.clara, hair: "wavy", hairColor: "#c2410c", eyes: "#15803d", suit: "#111827", suit2: "#374151", pattern: "jacket", emblem: "crosshair", emblemColor: "#ef4444" },
  { id: "h-estelar", label: "Estelar", category: "herois", gender: "F", female: true, bg: BG.azul, deco: "stars", skin: SKIN.morena, hair: "long", hairColor: "#fde68a", eyes: "#2563eb", suit: "#1d4ed8", suit2: "#dc2626", pattern: "stripes", emblem: "star", emblemColor: "#facc15", sparkles: "#fde68a" },
  { id: "h-tempestade", label: "Tempestade", category: "herois", gender: "F", female: true, bg: BG.noite, deco: "moon", skin: SKIN.negra, hair: "long", hairColor: "#f1f5f9", eyes: "#e0f2fe", glow: true, suit: "#0f172a", suit2: "#facc15", pattern: "collar", cape: "#1e293b", emblem: "bolt", emblemColor: "#facc15" },

  // ── Super-heróis (lendários): capa, noturno, relâmpago, amazona, esmeralda... ──
  { id: "s-capa", label: "Capa Vermelha", category: "lendarios", gender: "M", free: true, bg: BG.azul, deco: "rays", skin: SKIN.clara, hair: "slick", hairColor: "#111827", eyes: "#2563eb", suit: "#1d4ed8", suit2: "#1e3a8a", cape: "#dc2626", emblem: "diamond", emblemColor: "#dc2626" },
  { id: "s-noturno", label: "Noturno", category: "lendarios", gender: "M", bg: BG.noite, deco: "moon", skin: SKIN.clara, mask: "cowl", maskColor: "#27272a", cowlEars: true, suit: "#3f3f46", suit2: "#18181b", cape: "#18181b", emblem: "wing", emblemColor: "#facc15", stubble: true, brows: "angry" },
  { id: "s-relampago", label: "Relâmpago", category: "lendarios", gender: "M", bg: BG.laranja, deco: "rays", skin: SKIN.morena, hair: "spiky", hairColor: "#facc15", mask: "domino", maskColor: "#f97316", suit: "#f97316", suit2: "#18181b", pattern: "stripes", emblem: "bolt", emblemColor: "#fef08a" },
  { id: "s-esmeralda", label: "Esmeralda", category: "lendarios", gender: "M", bg: BG.verde, deco: "stars", skin: SKIN.negra, hair: "buzz", hairColor: "#111827", mask: "domino", maskColor: "#16a34a", suit: "#15803d", suit2: "#111827", pattern: "stripes", emblem: "ring", emblemColor: "#bbf7d0", glow: true, eyes: "#4ade80" },
  { id: "s-mares", label: "Rei dos Mares", category: "lendarios", gender: "M", bg: BG.ciano, deco: "bubbles", skin: SKIN.oliva, hair: "long", hairColor: "#a16207", beard: "#854d0e", suit: "#ea580c", suit2: "#15803d", pattern: "armor", emblem: "trident", emblemColor: "#facc15" },
  { id: "s-amazona", label: "Amazona", category: "lendarios", gender: "F", free: true, female: true, bg: BG.vermelho, deco: "stars", skin: SKIN.oliva, hair: "wavy", hairColor: "#1c1917", eyes: "#1e40af", suit: "#b91c1c", suit2: "#facc15", pattern: "armor", hat: "tiara", hatColor: "#facc15", gemColor: "#dc2626", emblem: "star", emblemColor: "#facc15", earrings: "#facc15" },
  { id: "s-gata", label: "Gata Noturna", category: "lendarios", gender: "F", female: true, bg: BG.noite, deco: "moon", skin: SKIN.clara, hair: "bob", hairColor: "#111827", mask: "domino", maskColor: "#111827", suit: "#18181b", suit2: "#3f3f46", pattern: "jacket", hat: "ears-cat", hatColor: "#111827", lips: "#9f1239" },
  { id: "s-estrela", label: "Estrela do Norte", category: "lendarios", gender: "F", female: true, bg: BG.azul, deco: "rays", skin: SKIN.clara, hair: "long", hairColor: "#fde047", eyes: "#2563eb", suit: "#1d4ed8", suit2: "#facc15", cape: "#dc2626", emblem: "diamond", emblemColor: "#dc2626" },
  { id: "s-aguia", label: "Águia", category: "lendarios", gender: "F", female: true, bg: BG.dourado, deco: "rays", skin: SKIN.parda, hair: "wavy", hairColor: "#7c2d12", mask: "helmet", maskColor: "#facc15", faceplate: "#facc15", lenses: true, lensColor: "#fef3c7", suit: "#a16207", suit2: "#facc15", pattern: "armor", emblem: "wing", emblemColor: "#fef3c7" },
  { id: "s-arlequina", label: "Coringa", category: "lendarios", gender: "F", female: true, bg: BG.rosa, deco: "stars", skin: SKIN.clara, hair: "ponytail", hairColor: "#f8fafc", mask: "domino", maskColor: "#111827", suit: "#dc2626", suit2: "#1e3a8a", pattern: "stripes", lips: "#be123c", blush: true, emblem: "diamond", emblemColor: "#111827" },

  // ── Halloween (monstros) ──
  { id: "m-vampira", label: "Vampira", category: "halloween", gender: "F", free: true, female: true, bg: BG.sangue, deco: "moon", skin: "#f1e4ec", hair: "long", hairColor: "#111827", eyes: "#dc2626", glow: true, mouth: "fangs", suit: "#7f1d1d", suit2: "#111827", pattern: "collar", cape: "#111827", necklace: "#dc2626" },
  { id: "m-bruxa", label: "Bruxa", category: "halloween", gender: "F", female: true, bg: BG.halloween, deco: "moon", skin: "#bbf7d0", hair: "long", hairColor: "#3f3f46", eyes: "#a855f7", suit: "#3b0764", suit2: "#111827", pattern: "robe", hat: "witch", hatColor: "#1c1917", gemColor: "#a855f7", sparkles: "#c4b5fd" },
  { id: "m-noiva", label: "Noiva Cadáver", category: "halloween", gender: "F", female: true, bg: BG.noite, deco: "moon", skin: "#a5b4fc", hair: "verylong", hairColor: "#1e3a8a", eyes: "#0f172a", lips: "#312e81", suit: "#e2e8f0", suit2: "#94a3b8", pattern: "dress", hat: "veil", stitches: false, necklace: "#94a3b8" },
  { id: "m-medusa", label: "Medusa", category: "halloween", gender: "F", female: true, bg: BG.pantano, deco: "stars", skin: "#a7f3d0", hair: "snakes", hairColor: "#16a34a", eyes: "#facc15", glow: true, suit: "#14532d", suit2: "#facc15", pattern: "collar", earrings: "#facc15", lips: "#065f46" },
  { id: "m-caveira", label: "Catrina", category: "halloween", gender: "F", female: true, bg: BG.laranja, deco: "stars", skin: "#f8fafc", hair: "long", hairColor: "#111827", eyes: "#f97316", facepaint: "skull", suit: "#111827", suit2: "#f97316", pattern: "dress", hat: "flower", hatColor: "#ef4444", lips: "#111827" },
  { id: "m-vampiro", label: "Vampiro", category: "halloween", gender: "M", free: true, bg: BG.sangue, deco: "moon", skin: "#f1e4ec", hair: "slick", hairColor: "#111827", eyes: "#dc2626", glow: true, mouth: "fangs", suit: "#111827", suit2: "#7f1d1d", pattern: "collar", cape: "#7f1d1d", brows: "angry" },
  { id: "m-lobisomem", label: "Lobisomem", category: "halloween", gender: "M", bg: BG.noite, deco: "moon", skin: "#a8a29e", hair: "spiky", hairColor: "#57534e", eyes: "#facc15", glow: true, mouth: "fangs", beard: "#57534e", suit: "#44403c", suit2: "#292524", pattern: "jacket", hat: "wolf", hatColor: "#57534e", noEars: true, brows: "angry" },
  { id: "m-frank", label: "Frankenstein", category: "halloween", gender: "M", bg: BG.pantano, deco: "grid", skin: "#86efac", hair: "short", hairColor: "#111827", eyes: "#f8fafc", stitches: true, bolts: true, mouth: "stitched", suit: "#1c1917", suit2: "#3f3f46", pattern: "jacket", scar: true },
  { id: "m-mumia", label: "Múmia", category: "halloween", gender: "M", bg: BG.dourado, deco: "stars", skin: "#e7dcc4", mask: "bandages", eyes: "#22c55e", glow: true, suit: "#e7dcc4", suit2: "#c8b994", pattern: "bandage", faceShade: false, noEars: true },
  { id: "m-ceifador", label: "Ceifador", category: "halloween", gender: "M", bg: BG.halloween, deco: "moon", skin: "#e5e7eb", facepaint: "skull", eyes: "#a855f7", glow: true, suit: "#111827", suit2: "#1f2937", pattern: "robe", hat: "hood", hatColor: "#111827", scythe: true, mouth: "stitched" },

  // ── MVP (games) ──
  { id: "g-pro-f", label: "Pro Gamer", category: "mvp", gender: "F", free: true, female: true, bg: BG.roxo, deco: "grid", skin: SKIN.parda, hair: "long", hairColor: "#7c3aed", eyes: "#3b2a1f", suit: "#111827", suit2: "#a855f7", pattern: "hoodie", hat: "headset", hatColor: "#18181b", gemColor: "#22d3ee", emblem: "controller", emblemColor: "#a855f7" },
  { id: "g-sniper-f", label: "Atiradora", category: "mvp", gender: "F", female: true, bg: BG.verde, deco: "grid", skin: SKIN.clara, hair: "ponytail", hairColor: "#a16207", warpaint: "#14532d", suit: "#3f6212", suit2: "#1a2e05", pattern: "armor", hat: "bandana", hatColor: "#365314", emblem: "crosshair", emblemColor: "#bef264" },
  { id: "g-maga", label: "Maga", category: "mvp", gender: "F", female: true, bg: BG.azul, deco: "stars", skin: SKIN.morena, hair: "verylong", hairColor: "#e2e8f0", eyes: "#38bdf8", glow: true, suit: "#1e40af", suit2: "#facc15", pattern: "robe", staff: "#38bdf8", gem: "#38bdf8", sparkles: "#bae6fd" },
  { id: "g-ninja-f", label: "Ninja", category: "mvp", gender: "F", female: true, bg: BG.vermelho, deco: "moon", skin: SKIN.clara, hair: "ponytail", hairColor: "#111827", mask: "ninja", maskColor: "#111827", suit: "#18181b", suit2: "#dc2626", pattern: "collar", hat: "bandana", hatColor: "#dc2626", sword: true, brows: "angry" },
  { id: "g-cyber-f", label: "Cyberpunk", category: "mvp", gender: "F", female: true, bg: BG.rosa, deco: "grid", skin: SKIN.clara, hair: "bob", hairColor: "#22d3ee", mask: "visor", maskColor: "#ec4899", suit: "#18181b", suit2: "#ec4899", pattern: "jacket", earrings: "#22d3ee", lips: "#a21caf" },
  { id: "g-pro", label: "Pro Player", category: "mvp", gender: "M", free: true, bg: BG.ciano, deco: "grid", skin: SKIN.morena, hair: "short", hairColor: "#111827", suit: "#111827", suit2: "#22d3ee", pattern: "hoodie", hat: "headset", hatColor: "#18181b", gemColor: "#22d3ee", emblem: "controller", emblemColor: "#22d3ee", stubble: true },
  { id: "g-soldado", label: "Soldado", category: "mvp", gender: "M", bg: BG.verde, deco: "grid", skin: SKIN.parda, hair: "buzz", hairColor: "#1c1917", warpaint: "#1a2e05", suit: "#4d7c0f", suit2: "#365314", pattern: "armor", hat: "beanie", hatColor: "#3f6212", stubble: true, brows: "angry", emblem: "crosshair", emblemColor: "#bef264" },
  { id: "g-cavaleiro", label: "Cavaleiro", category: "mvp", gender: "M", bg: BG.dourado, deco: "rays", skin: SKIN.clara, hair: "short", hairColor: "#78350f", beard: "#78350f", suit: "#94a3b8", suit2: "#475569", pattern: "armor", hat: "helmet-knight", hatColor: "#94a3b8", sword: true },
  { id: "g-mago", label: "Mago", category: "mvp", gender: "M", bg: BG.roxo, deco: "stars", skin: SKIN.clara, hair: "long", hairColor: "#e5e7eb", beard: "#f1f5f9", eyes: "#38bdf8", suit: "#4c1d95", suit2: "#facc15", pattern: "robe", hat: "wizard", hatColor: "#4c1d95", staff: "#a78bfa" },
  { id: "g-hacker", label: "Hacker", category: "mvp", gender: "M", bg: BG.noite, deco: "grid", skin: SKIN.negra, hair: "afro", hairColor: "#111827", mask: "visor", maskColor: "#22c55e", suit: "#111827", suit2: "#22c55e", pattern: "hoodie", hat: "cap", hatColor: "#16a34a" },

  // ── Princesas (personagens próprios, estilo conto de fadas) ──
  { id: "p-gelo", label: "Princesa do Gelo", category: "princesas", gender: "F", free: true, female: true, bg: BG.gelo, deco: "snow", skin: SKIN.clara, hair: "braid", hairColor: "#f1f5f9", eyes: "#1d4ed8", suit: "#7dd3fc", suit2: "#e0f2fe", pattern: "dress", emblem: "snowflake", emblemColor: "#f8fafc", hat: "tiara", hatColor: "#e0f2fe", gemColor: "#7dd3fc", lips: "#be185d", sparkles: "#ffffff" },
  { id: "p-mar", label: "Princesa do Mar", category: "princesas", gender: "F", free: true, female: true, bg: BG.ciano, deco: "bubbles", skin: SKIN.clara, hair: "wavy", hairColor: "#dc2626", eyes: "#0e7490", suit: "#14b8a6", suit2: "#a855f7", pattern: "dress", emblem: "shell", emblemColor: "#c084fc", freckles: false, blush: true },
  { id: "p-rosas", label: "Princesa das Rosas", category: "princesas", gender: "F", female: true, bg: BG.dourado, deco: "sparkles", skin: SKIN.rosada, hair: "bun", hairColor: "#78350f", eyes: "#78350f", suit: "#facc15", suit2: "#fde68a", pattern: "dress", emblem: "rose", emblemColor: "#e11d48", earrings: "#fde68a", necklace: "#fde68a" },
  { id: "p-floresta", label: "Princesa da Floresta", category: "princesas", gender: "F", female: true, bg: BG.verde, deco: "stars", skin: SKIN.clara, hair: "bob", hairColor: "#111827", eyes: "#3b2a1f", lips: "#dc2626", suit: "#1d4ed8", suit2: "#facc15", pattern: "dress", hat: "tiara", hatColor: "#dc2626", gemColor: "#dc2626", blush: true },
  { id: "p-deserto", label: "Princesa do Deserto", category: "princesas", gender: "F", female: true, bg: BG.laranja, deco: "stars", skin: SKIN.morena, hair: "verylong", hairColor: "#111827", eyes: "#3b2a1f", suit: "#0d9488", suit2: "#5eead4", pattern: "dress", earrings: "#facc15", gem: "#14b8a6", necklace: "#facc15" },
  { id: "p-guerreira", label: "Princesa Guerreira", category: "princesas", gender: "F", female: true, bg: BG.vermelho, deco: "rays", skin: SKIN.oliva, hair: "bun", hairColor: "#111827", eyes: "#3b2a1f", suit: "#b91c1c", suit2: "#facc15", pattern: "armor", sword: true, hat: "flower", hatColor: "#f472b6" },
  { id: "p-torre", label: "Princesa da Torre", category: "princesas", gender: "F", female: true, bg: BG.roxo, deco: "sparkles", skin: SKIN.clara, hair: "verylong", hairColor: "#fcd34d", eyes: "#15803d", suit: "#a855f7", suit2: "#f0abfc", pattern: "dress", hat: "flower", hatColor: "#f9a8d4", freckles: true, sparkles: "#fde68a" },
  { id: "p-sol", label: "Princesa do Sol", category: "princesas", gender: "F", female: true, bg: BG.dourado, deco: "rays", skin: SKIN.negra, hair: "afro", hairColor: "#1c1917", eyes: "#3b2a1f", suit: "#16a34a", suit2: "#facc15", pattern: "dress", hat: "crown", hatColor: "#facc15", gemColor: "#16a34a", emblem: "sun", emblemColor: "#facc15", earrings: "#facc15" },
  { id: "p-ilha", label: "Princesa da Ilha", category: "princesas", gender: "F", female: true, bg: BG.ciano, deco: "bubbles", skin: SKIN.parda, hair: "wavy", hairColor: "#1c1917", eyes: "#3b2a1f", suit: "#ef4444", suit2: "#fde68a", pattern: "dress", hat: "flower", hatColor: "#f472b6", necklace: "#f8fafc", emblem: "flower", emblemColor: "#fef3c7" },
  { id: "p-sonho", label: "Princesa dos Sonhos", category: "princesas", gender: "F", female: true, bg: BG.rosa, deco: "stars", skin: SKIN.clara, hair: "long", hairColor: "#fde047", eyes: "#7c3aed", suit: "#f472b6", suit2: "#fbcfe8", pattern: "dress", hat: "crown", hatColor: "#facc15", gemColor: "#ec4899", necklace: "#facc15", blush: true },
];

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith(".svg")) unlinkSync(`${OUT}/${f}`);
for (const a of AVATARS) {
  if (a.deco === "sparkles") a.deco = "stars";
  writeFileSync(`${OUT}/${a.id}.svg`, svg(a));
}
// lista para o app (src/lib/avatars.ts usa este arquivo)
writeFileSync(
  "src/lib/avatar-list.json",
  JSON.stringify(AVATARS.map(({ id, label, category, gender, free }) => ({ id, label, category, gender, ...(free ? { free: true } : {}) })), null, 1) + "\n",
);
console.log(`${AVATARS.length} avatares gerados em ${OUT}`);
