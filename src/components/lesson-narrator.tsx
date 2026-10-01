"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tira a marcação do texto (Markdown, referências [T1]) para ser lido em voz alta. */
export function toSpeech(markdown: string): string[] {
  const plain = markdown
    .replace(/\[T\d+\]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`>|]/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\n{2,}/g, "\n");
  // frases curtas: alguns navegadores cortam falas longas
  const parts: string[] = [];
  for (const line of plain.split("\n")) {
    const sentences = line.match(/[^.!?;:]+[.!?;:]*/g) ?? [];
    for (const s of sentences) {
      const t = s.trim();
      if (!t) continue;
      if (t.length <= 220) parts.push(t);
      else parts.push(...(t.match(/.{1,200}(\s|$)/g) ?? [t]).map((x) => x.trim()));
    }
  }
  return parts.filter(Boolean);
}

/**
 * Junta frases em blocos para a voz natural. O primeiro bloco é curto (começa a falar rápido);
 * os seguintes são maiores (menos pedidos, fala mais fluida).
 */
export function toBlocks(parts: string[], max = 1200, firstMax = 260): string[] {
  const blocks: string[] = [];
  let cur = "";
  for (const p of parts) {
    const limit = blocks.length === 0 ? firstMax : max;
    if (cur && cur.length + p.length + 1 > limit) {
      blocks.push(cur);
      cur = "";
    }
    cur = cur ? `${cur} ${p}` : p;
  }
  if (cur) blocks.push(cur);
  return blocks;
}

const FEMALE = /francisca|thalita|luciana|maria|vit[oó]ria|raquel|leila|fernanda|helo[ií]sa|female|feminina|joana|catarina/i;
const MALE = /antonio|ant[oô]nio|felipe|daniel|ricardo|duarte|julio|j[uú]lio|male|masculin|fabio|humberto/i;

/** Voz do aparelho (reserva): natural/online primeiro e do gênero escolhido. */
function rankVoice(v: SpeechSynthesisVoice, gender: "f" | "m") {
  const n = v.name.toLowerCase();
  let score = 0;
  if (v.lang.toLowerCase() === "pt-br") score += 10;
  if (/natural|online|neural/.test(n)) score += 8;
  if (/google/.test(n)) score += 4;
  if ((gender === "f" ? FEMALE : MALE).test(n)) score += 6;
  if ((gender === "f" ? MALE : FEMALE).test(n)) score -= 6;
  return score;
}

type Mode = "natural" | "device";

/**
 * Robozinho que lê o texto da aula em voz alta. Usa a voz natural do Gemini (feminina ou masculina),
 * guardada para não gastar de novo; se não der, cai para a voz do aparelho, mais devagar.
 */
export function LessonNarrator({ text }: { text: string }) {
  const parts = useMemo(() => toSpeech(text), [text]);
  const blocks = useMemo(() => toBlocks(parts), [parts]);
  const [gender, setGender] = useState<"f" | "m">("f");
  const [rate, setRate] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("natural");
  const [note, setNote] = useState<string | null>(null);
  // voz natural: os trechos tocam emendados num só tocador (Web Audio), sem troca de arquivo entre eles
  const ctx = useRef<AudioContext | null>(null);
  const sources = useRef<AudioBufferSourceNode[]>([]);
  const nextAt = useRef(0);
  const cache = useRef(new Map<string, Promise<ArrayBuffer>>());
  const stopped = useRef(false);
  const run = useRef(0);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  useEffect(() => {
    try {
      const g = localStorage.getItem("eduvia:voz");
      if (g === "f" || g === "m") setGender(g);
    } catch {}
    return () => {
      stopped.current = true;
      ctx.current?.close().catch(() => {});
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, []);

  /** Baixa o áudio de um trecho (fica guardado; ouvir de novo não gasta a cota). */
  const fetchBlock = (i: number) => {
    const k = `${gender}:${i}`;
    if (!cache.current.has(k)) {
      const p = fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: blocks[i], voice: gender }) }).then(async (r) => {
        if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "voz indisponível");
        return r.arrayBuffer();
      });
      p.catch(() => cache.current.delete(k));
      cache.current.set(k, p);
    }
    return cache.current.get(k)!;
  };

  const finish = () => {
    setState("idle");
    setIndex(0);
  };

  /** Pausa natural entre trechos (fim de frase/parágrafo): curta, sem estalo. */
  const GAP = 0.32;

  const playNatural = async (from: number) => {
    const myRun = ++run.current;
    // iPhone: toca mesmo com o celular no modo silencioso (como um vídeo ou música)
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";
    const ac = ctx.current && ctx.current.state !== "closed" ? ctx.current : (ctx.current = new AudioContext());
    await ac.resume().catch(() => {});
    nextAt.current = ac.currentTime + 0.05;
    setIndex(from);
    setState("loading");
    let playing = false;
    for (let i = from; i < blocks.length; i++) {
      if (stopped.current || run.current !== myRun) return;
      let buffer: AudioBuffer;
      try {
        // já pede os próximos enquanto este toca
        for (const k of [i + 1, i + 2]) if (k < blocks.length) fetchBlock(k).catch(() => {});
        buffer = await ac.decodeAudioData((await fetchBlock(i)).slice(0));
      } catch (e) {
        if (stopped.current || run.current !== myRun) return;
        if (i > from) break; // o que já foi agendado termina; depois para
        // sem voz natural agora: segue com a voz do aparelho, sem travar a aula
        setMode("device");
        setNote(`${(e as Error).message} Usando a voz do aparelho.`);
        playDevice(Math.max(0, parts.findIndex((p) => blocks[i].startsWith(p))));
        return;
      }
      if (stopped.current || run.current !== myRun) return;
      const src = ac.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = rateRef.current;
      src.connect(ac.destination);
      const at = Math.max(nextAt.current, ac.currentTime + 0.03);
      src.start(at);
      nextAt.current = at + buffer.duration / rateRef.current + GAP;
      sources.current.push(src);
      const n = i;
      // atualiza "Lendo X de Y" quando cada trecho começa
      setTimeout(() => run.current === myRun && !stopped.current && setIndex(n), Math.max(0, (at - ac.currentTime) * 1000));
      src.onended = () => {
        sources.current = sources.current.filter((x) => x !== src);
        if (n === blocks.length - 1 && run.current === myRun && !stopped.current) finish();
      };
      if (!playing) {
        playing = true;
        setState("playing");
      }
    }
  };

  const stopNatural = () => {
    run.current++;
    for (const src of sources.current) {
      try {
        src.stop();
      } catch {}
    }
    sources.current = [];
  };

  const playDevice = (i: number) => {
    if (!("speechSynthesis" in window)) {
      setNote("Seu navegador não tem leitura em voz alta.");
      return finish();
    }
    if (stopped.current) return;
    if (i >= parts.length) return finish();
    const u = new SpeechSynthesisUtterance(parts[i]);
    u.lang = "pt-BR";
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("pt"));
    voices.sort((a, b) => rankVoice(b, gender) - rankVoice(a, gender));
    if (voices[0]) u.voice = voices[0];
    u.rate = rateRef.current;
    u.pitch = gender === "m" ? 0.9 : 1.05;
    u.onend = () => {
      if (stopped.current) return;
      playDevice(i + 1);
    };
    setIndex(i);
    setState("playing");
    speechSynthesis.speak(u);
  };

  const play = () => {
    if (state === "paused") {
      if (mode === "natural") ctx.current?.resume();
      else speechSynthesis.resume();
      setState("playing");
      return;
    }
    stopped.current = false;
    if (mode === "natural") playNatural(index);
    else {
      speechSynthesis.cancel();
      playDevice(index);
    }
  };
  const pause = () => {
    if (mode === "natural") ctx.current?.suspend();
    else speechSynthesis.pause();
    setState("paused");
  };
  const stop = () => {
    stopped.current = true;
    stopNatural();
    ctx.current?.resume().catch(() => {});
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    finish();
  };
  const chooseGender = (g: "f" | "m") => {
    setGender(g);
    try {
      localStorage.setItem("eduvia:voz", g);
    } catch {}
  };

  if (!parts.length) return null;
  const total = mode === "natural" ? blocks.length : parts.length;
  const busy = state === "playing" || state === "loading";
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={state === "playing" ? pause : play}
          aria-label={state === "playing" ? "Pausar a leitura" : "Ouvir a aula"}
          className="rounded-full transition hover:scale-105 active:scale-95"
        >
          <Robot speaking={state === "playing"} />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Ouvir a aula</p>
          <p className="text-xs text-muted">
            {state === "idle" ? "Toque no robô: uma voz natural lê o texto para você." : state === "loading" ? "Preparando a voz…" : `Lendo ${index + 1} de ${total}…`}
          </p>
          {note && <p className="text-xs text-warning">{note}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {busy ? (
          <Button size="sm" onClick={pause} disabled={state === "loading"} aria-label="Pausar">
            {state === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Pause size={16} />} Pausar
          </Button>
        ) : (
          <Button size="sm" onClick={play} aria-label={state === "paused" ? "Continuar" : "Ouvir"}><Play size={16} /> {state === "paused" ? "Continuar" : "Ouvir"}</Button>
        )}
        {state !== "idle" && <Button size="sm" variant="ghost" onClick={stop} aria-label="Parar"><Square size={14} /></Button>}
        <div className="flex rounded-lg border border-border p-0.5 text-xs" role="radiogroup" aria-label="Voz">
          {(["f", "m"] as const).map((g) => (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={gender === g}
              disabled={state !== "idle"}
              onClick={() => chooseGender(g)}
              className={cn("rounded-md px-2 py-1", gender === g ? "bg-primary text-primary-foreground" : "text-muted")}
            >
              {g === "f" ? "Feminina" : "Masculina"}
            </button>
          ))}
        </div>
        <select aria-label="Velocidade" value={rate} disabled={state !== "idle"} onChange={(e) => setRate(Number(e.target.value))} className="h-8 rounded-lg border border-border bg-surface px-2 text-xs">
          {[0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r === 1 ? "Normal" : r < 1 ? "Devagar" : `${r}x`}</option>)}
        </select>
      </div>
    </div>
  );
}

/** Robozinho simpático: a boca e as antenas se mexem enquanto ele fala. */
function Robot({ speaking }: { speaking: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-12 shrink-0", speaking && "robot-talk")} aria-hidden>
      <line x1="32" y1="6" x2="32" y2="14" stroke="currentColor" strokeWidth="3" className="text-primary" />
      <circle cx="32" cy="6" r="4" className={cn("fill-primary", speaking && "robot-blink")} />
      <rect x="10" y="14" width="44" height="36" rx="12" className="fill-surface stroke-primary" strokeWidth="3" />
      <rect x="4" y="26" width="6" height="12" rx="3" className="fill-primary" />
      <rect x="54" y="26" width="6" height="12" rx="3" className="fill-primary" />
      <circle cx="24" cy="29" r="5" className="fill-foreground" />
      <circle cx="40" cy="29" r="5" className="fill-foreground" />
      <circle cx="25.5" cy="27.5" r="1.6" fill="#fff" />
      <circle cx="41.5" cy="27.5" r="1.6" fill="#fff" />
      <rect x="24" y="39" width="16" height="5" rx="2.5" className={cn("fill-primary robot-mouth", speaking && "robot-mouth-talk")} />
      <rect x="20" y="52" width="24" height="8" rx="3" className="fill-primary/60" />
    </svg>
  );
}
