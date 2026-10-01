"use client";

// Bonequinho em pixel art no estilo dos jogos de plataforma antigos (boné e macacão), personagem próprio do Eduvia.
// Sem fundo: silhueta de uma cor só (preto no tema claro, branco no escuro); os detalhes são vãos. K = pixel, . = vazio.
const HERO = [
  "...KKKKK....",
  "..KKKKKKKKK.",
  "..KKKKK.K...",
  ".KKKKKK.KKK.",
  ".KKKKKKKKKKK",
  ".KKKKKK.....",
  "...KKKKKKK..",
  "..KK.KKK....",
  ".KKK.KK.KKK.",
  "KKKKK..KKKKK",
  "KK.K.KK.K.KK",
  "KKKKKKKKKKKK",
  "KKKKK..KKKKK",
  "..KKK..KKK..",
  ".KKKK..KKKK.",
  "KKKKK..KKKKK",
];
// olhos em X quando erra
const HERO_KO = HERO.map((row, i) => (i === 2 ? "..KKKKK.K.K." : i === 3 ? ".KKKKKKK.KK." : row));

function Sprite({ map, px }: { map: string[]; px: number }) {
  const w = map[0].length;
  const h = map.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * px} height={h * px} shapeRendering="crispEdges" aria-hidden>
      {map.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="currentColor" />,
        ),
      )}
    </svg>
  );
}

export type StageState = "idle" | "win" | "lose";

/** Bonequinho do teste rápido: pula enquanto o aluno responde, dá um pulo alto ao acertar e cai ao errar. */
export function PixelStage({ state, level, animKey }: { state: StageState; level: number; animKey: number }) {
  return (
    <div className="flex items-end gap-3 text-foreground" aria-hidden>
      <div className="relative h-[72px] w-12">
        <div key={animKey} className={`absolute bottom-0 left-0 ${state === "win" ? "px-jump" : state === "lose" ? "px-fall" : "px-idle"}`}>
          <Sprite map={state === "lose" ? HERO_KO : HERO} px={4} />
        </div>
      </div>
      <div className="pb-0.5 font-mono text-xs font-bold leading-tight tracking-widest">
        <div>FASE {String(level).padStart(2, "0")}</div>
        <div key={animKey} className={state === "idle" ? "invisible" : "px-pop"}>{state === "win" ? "+1 FASE!" : state === "lose" ? "OPS!" : "."}</div>
      </div>
    </div>
  );
}
