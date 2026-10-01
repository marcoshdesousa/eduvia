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

/** Junta frases em blocos maiores para a voz natural (menos pedidos, fala mais fluida). */
export function toBlocks(parts: string[], max = 1500): string[] {
  const blocks: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (cur && cur.length + p.length + 1 > max) {
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
  const [rate, setRate] = useState(0.9);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("natural");
  const [note, setNote] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const cache = useRef(new Map<string, Promise<string>>());
  const stopped = useRef(false);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  useEffect(() => {
    try {
      const g = localStorage.getItem("eduvia:voz");
      if (g === "f" || g === "m") setGender(g);
    } catch {}
    return () => {
      stopped.current = true;
      audio.current?.pause();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      for (const p of cache.current.values()) p.then((u) => URL.revokeObjectURL(u)).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  const fetchBlock = (i: number) => {
    const k = `${gender}:${i}`;
    if (!cache.current.has(k)) {
      const p = fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: blocks[i], voice: gender }) }).then(async (r) => {
        if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "voz indisponível");
        return URL.createObjectURL(await r.blob());
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

  const playNatural = async (i: number) => {
    if (stopped.current) return;
    if (i >= blocks.length) return finish();
    setIndex(i);
    setState("loading");
    try {
      const url = await fetchBlock(i);
      if (stopped.current) return;
      if (i + 1 < blocks.length) fetchBlock(i + 1).catch(() => {}); // já prepara o próximo
      const a = audio.current ?? (audio.current = new Audio());
      a.src = url;
      a.playbackRate = rateRef.current;
      a.onended = () => playNatural(i + 1);
      await a.play();
      setState("playing");
    } catch (e) {
      if (stopped.current) return;
      // sem voz natural agora: segue com a voz do aparelho, sem travar a aula
      setMode("device");
      setNote(`${(e as Error).message} Usando a voz do aparelho.`);
      playDevice(Math.max(0, parts.findIndex((p) => blocks[i].startsWith(p))));
    }
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
      if (mode === "natural") audio.current?.play();
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
    if (mode === "natural") audio.current?.pause();
    else speechSynthesis.pause();
    setState("paused");
  };
  const stop = () => {
    stopped.current = true;
    audio.current?.pause();
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
        <Robot speaking={state === "playing"} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Ouvir a aula</p>
          <p className="text-xs text-muted">
            {state === "idle" ? "Uma voz natural lê o texto para você." : state === "loading" ? "Preparando a voz…" : `Lendo ${index + 1} de ${total}…`}
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
        <select aria-label="Velocidade" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="h-8 rounded-lg border border-border bg-surface px-2 text-xs">
          {[0.75, 0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r === 0.9 ? "Normal" : `${r}x`}</option>)}
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
