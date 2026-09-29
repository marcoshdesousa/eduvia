"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
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

/** Escolhe a voz em português que soa mais natural (vozes "Natural"/"Online"/Google primeiro). */
function rankVoice(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase();
  let score = 0;
  if (v.lang.toLowerCase() === "pt-br") score += 10;
  if (/natural|online|neural/.test(n)) score += 8;
  if (/google/.test(n)) score += 5;
  if (/francisca|thalita|antonio|luciana|felipe|daniel|maria/.test(n)) score += 3;
  return score;
}

/** Robozinho que lê o texto da aula em voz alta (voz do próprio aparelho, sem custo). */
export function LessonNarrator({ text }: { text: string }) {
  const parts = useMemo(() => toSpeech(text), [text]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [index, setIndex] = useState(0);
  const [supported, setSupported] = useState(true);
  const stopped = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => {
      const pt = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("pt"));
      pt.sort((a, b) => rankVoice(b) - rankVoice(a));
      setVoices(pt);
      setVoiceName((cur) => cur || pt[0]?.name || "");
    };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", load);
      speechSynthesis.cancel();
    };
  }, []);

  const speakFrom = (i: number) => {
    if (i >= parts.length) {
      setState("idle");
      setIndex(0);
      return;
    }
    const u = new SpeechSynthesisUtterance(parts[i]);
    u.lang = "pt-BR";
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = () => {
      if (stopped.current) return;
      setIndex(i + 1);
      speakFrom(i + 1);
    };
    setIndex(i);
    speechSynthesis.speak(u);
  };

  const play = () => {
    if (state === "paused") {
      speechSynthesis.resume();
      setState("playing");
      return;
    }
    stopped.current = false;
    speechSynthesis.cancel();
    setState("playing");
    speakFrom(index);
  };
  const pause = () => {
    speechSynthesis.pause();
    setState("paused");
  };
  const stop = () => {
    stopped.current = true;
    speechSynthesis.cancel();
    setState("idle");
    setIndex(0);
  };

  if (!supported || !parts.length) return null;
  const speaking = state === "playing";
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <Robot speaking={speaking} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Ouvir a aula</p>
          <p className="truncate text-xs text-muted">{state === "idle" ? "O robozinho lê o texto para você." : `Lendo ${index + 1} de ${parts.length}…`}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {speaking ? (
          <Button size="sm" onClick={pause} aria-label="Pausar"><Pause size={16} /> Pausar</Button>
        ) : (
          <Button size="sm" onClick={play} aria-label={state === "paused" ? "Continuar" : "Ouvir"}><Play size={16} /> {state === "paused" ? "Continuar" : "Ouvir"}</Button>
        )}
        {state !== "idle" && <Button size="sm" variant="ghost" onClick={stop} aria-label="Parar"><Square size={14} /></Button>}
        <select
          aria-label="Velocidade"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          disabled={state !== "idle"}
          className="h-8 rounded-lg border border-border bg-surface px-2 text-xs"
        >
          {[0.8, 1, 1.2, 1.5].map((r) => <option key={r} value={r}>{r}x</option>)}
        </select>
        {voices.length > 1 && (
          <select
            aria-label="Voz"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            disabled={state !== "idle"}
            className="h-8 max-w-40 rounded-lg border border-border bg-surface px-2 text-xs"
          >
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/Microsoft |Google /, "").replace(/ Online \(Natural\)/, " (natural)")}</option>)}
          </select>
        )}
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
