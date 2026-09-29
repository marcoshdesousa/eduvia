"use client";
import { useMemo } from "react";

// Bonequinho em pixel art, preto e branco, estilo jogo de plataforma antigo (personagem próprio do Eduvia).
// K = preto, G = cinza, W = branco, . = vazio.
const HERO = [
  "....KKKKK...",
  "...KKKKKKK..",
  "..KKWWWWWKK.",
  "..KWWKWWKWK.",
  "..KWWWWWWWK.",
  "..KWWKKKWWK.",
  "...KWWWWWK..",
  "....KKKKK...",
  "...KGGGGGK..",
  "..KGGGGGGGK.",
  ".KWKGGGGGKWK",
  ".KWKGGGGGKWK",
  "...KKKKKKK..",
  "...KGK.KGK..",
  "...KKK.KKK..",
  "..KKKK.KKKK.",
];
// olhos em X quando erra
const HERO_KO = HERO.map((row, i) => (i === 3 ? "..KWKWKWKWK." : i === 4 ? "..KWWKWKWWK." : i === 5 ? "..KWWWWWWWK." : row));
// sorriso aberto quando acerta
const HERO_HAPPY = HERO.map((row, i) => (i === 5 ? "..KWKWWWKWK." : i === 6 ? "...KWKKKWK.." : row));

const BALLOON = ["..KKK..", ".KWWWK.", "KWWGWWK", "KWWWWWK", ".KWWWK.", "..KKK..", "...K...", "..K....", "...K...", "....K.."];

const COLORS: Record<string, string> = { K: "#000", G: "#8a8a8a", W: "#fff" };

function Sprite({ map, px, className }: { map: string[]; px: number; className?: string }) {
  const w = map[0].length;
  const h = map.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * px} height={h * px} shapeRendering="crispEdges" className={className} aria-hidden>
      {map.flatMap((row, y) =>
        [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={COLORS[c]} />)),
      )}
    </svg>
  );
}

export type StageState = "idle" | "win" | "lose";

/** Cenário do teste rápido: o bonequinho pula enquanto o aluno responde, comemora com balões ao acertar e cai ao errar. */
export function PixelStage({ state, level, animKey }: { state: StageState; level: number; animKey: number }) {
  const balloons = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ left: 8 + i * 15 + Math.round(Math.random() * 6), delay: Math.round(Math.random() * 250), scale: 0.8 + Math.random() * 0.5 })),
    // novos balões a cada acerto
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animKey],
  );
  const map = state === "lose" ? HERO_KO : state === "win" ? HERO_HAPPY : HERO;
  return (
    <div className="relative h-44 overflow-hidden rounded-xl border-2 border-black bg-white text-black" aria-hidden>
      <div className="absolute left-3 top-2 font-mono text-sm font-bold tracking-widest">FASE {String(level).padStart(2, "0")}</div>
      {/* nuvens */}
      <div className="px-cloud absolute top-6 h-3 w-10 bg-black/10" />
      <div className="px-cloud px-cloud-slow absolute top-14 h-2 w-7 bg-black/10" />
      {/* chão de blocos */}
      <div className="absolute inset-x-0 bottom-0 h-6 border-t-2 border-black bg-[repeating-linear-gradient(90deg,#fff_0_14px,#000_14px_16px)]" />
      <div key={animKey} style={{ marginLeft: -30 }} className={`absolute bottom-6 left-1/2 ${state === "win" ? "px-jump" : state === "lose" ? "px-fall" : "px-idle"}`}>
        <Sprite map={map} px={5} />
      </div>
      {state === "win" &&
        balloons.map((b, i) => (
          <div key={`${animKey}-${i}`} className="px-balloon absolute bottom-0" style={{ left: `${b.left}%`, animationDelay: `${b.delay}ms`, transform: `scale(${b.scale})` }}>
            <Sprite map={BALLOON} px={3} />
          </div>
        ))}
      {state === "win" && <div className="px-pop absolute right-3 top-2 font-mono text-sm font-bold">+1 FASE!</div>}
      {state === "lose" && <div className="px-pop absolute right-3 top-2 font-mono text-sm font-bold">OPS!</div>}
    </div>
  );
}
