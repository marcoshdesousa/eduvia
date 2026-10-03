"use client";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeTimes, splitWords } from "@/lib/speech-align";
import { toBlocks, toSpeech } from "@/lib/speech-text";
import { cn } from "@/lib/utils";

export { toBlocks, toSpeech };

/** "Peso" de fala de uma frase: letras + pausas de vírgula e de fim de frase (aproxima o tempo que a voz leva). */
export function speechWeight(p: string) {
  const letters = p.replace(/\s+/g, "").length;
  const commas = (p.match(/[,;:]/g) ?? []).length;
  const stops = (p.match(/[.!?]/g) ?? []).length || 1;
  return letters + commas * 4 + stops * 7;
}

/** Momento (em segundos) em que cada frase começa no áudio da aula: tempo exato de cada trecho, dividido pelo peso das frases. */
export function sentenceTimeline(parts: string[], blocks: { from: number; to: number }[], seconds: number[], tailPause = 0.35): number[] {
  const starts: number[] = [];
  let t = 0;
  blocks.forEach((b, i) => {
    const speech = Math.max(0.1, seconds[i] - tailPause);
    const weights = parts.slice(b.from, b.to + 1).map(speechWeight);
    const total = weights.reduce((x, y) => x + y, 0) || 1;
    let acc = 0;
    for (let k = b.from; k <= b.to; k++) {
      starts[k] = t + (acc / total) * speech;
      acc += weights[k - b.from];
    }
    t += seconds[i];
  });
  return starts;
}

export { splitWords };

/**
 * Tempo de cada palavra na aula inteira: usa os tempos medidos no áudio de cada trecho (quando vieram)
 * e, se faltarem, a estimativa pelo tamanho das palavras.
 */
export function mergeWordTimes(parts: string[], blocks: { from: number; to: number }[], seconds: number[], measured: (number[] | null)[], estimate: { s: number; t: number }[]) {
  const words = estimate.map((w) => ({ ...w }));
  let offset = 0;
  let k = 0;
  blocks.forEach((b, i) => {
    const count = parts.slice(b.from, b.to + 1).reduce((x, p) => x + splitWords(p).length, 0);
    const m = measured[i];
    if (m && m.length === count) for (let j = 0; j < count; j++) words[k + j].t = offset + m[j];
    k += count;
    offset += seconds[i];
  });
  return words;
}

const plainChar = (c: string) =>
  c
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/**
 * Acha cada frase no texto da aula, EM ORDEM e sempre para a frente (nunca volta para cima):
 * compara só letras e números (ignora acentos, pontuação e as marcações "p.3").
 * Devolve, para cada frase, o início e o fim no texto (ou null se não achou).
 */
export function mapSentences(flat: string, parts: string[]): ({ start: number; end: number } | null)[] {
  let norm = "";
  const back: number[] = [];
  for (let i = 0; i < flat.length; i++) {
    const c = plainChar(flat[i]);
    for (const ch of c) {
      norm += ch;
      back.push(i);
    }
  }
  let cursor = 0;
  return parts.map((p) => {
    const target = [...p].map(plainChar).join("");
    if (target.length < 2) return null;
    let at = norm.indexOf(target, cursor);
    let len = target.length;
    if (at === -1 || at - cursor > 4000) {
      // frase com algo diferente no meio: procura pelo começo dela, perto de onde paramos
      const head = target.slice(0, Math.min(30, target.length));
      at = norm.indexOf(head, cursor);
      if (at === -1 || at - cursor > 4000) return null;
      len = Math.min(target.length, norm.length - at);
    }
    cursor = at + len;
    let end = back[Math.min(at + len, back.length) - 1] + 1;
    while (end < flat.length && /[.,;:!?)"”'»]/.test(flat[end])) end++; // inclui a pontuação do fim
    return { start: back[at], end };
  });
}

/**
 * Momento em que cada palavra começa no áudio: o tempo de cada frase dividido pelo peso das palavras.
 * Devolve a lista de palavras de todas as frases, em ordem, com a frase de cada uma.
 */
export function wordTimeline(parts: string[], sentenceStarts: number[], totalSeconds: number) {
  const words: { s: number; t: number }[] = [];
  parts.forEach((p, i) => {
    const ws = splitWords(p);
    const start = sentenceStarts[i] ?? 0;
    const end = sentenceStarts[i + 1] ?? totalSeconds;
    // a pausa do fim da frase não é fala: tira ~0,3 s (ou 15%) antes de dividir entre as palavras
    const dur = Math.max(0.2, end - start - Math.min(0.3, (end - start) * 0.15));
    const total = ws.reduce((x, w) => x + w.weight, 0) || 1;
    let acc = 0;
    for (const w of ws) {
      words.push({ s: i, t: start + (acc / total) * dur });
      acc += w.weight;
    }
  });
  return words;
}

/**
 * Acha cada palavra no texto da aula, EM ORDEM e sempre para a frente (nunca volta):
 * compara só letras e números; se uma palavra não aparece logo adiante, ela fica sem marcação (não pula).
 */
export function mapWords(flat: string, parts: string[]): ({ start: number; end: number } | null)[] {
  let norm = "";
  const back: number[] = [];
  for (let i = 0; i < flat.length; i++) {
    for (const ch of plainChar(flat[i])) {
      norm += ch;
      back.push(i);
    }
  }
  let cursor = 0;
  const out: ({ start: number; end: number } | null)[] = [];
  for (const p of parts) {
    for (const w of splitWords(p)) {
      const target = [...w.word].map(plainChar).join("");
      const at = target ? norm.indexOf(target, cursor) : -1;
      if (at === -1 || at - cursor > 80) {
        out.push(null);
        continue;
      }
      cursor = at + target.length;
      out.push({ start: back[at], end: back[at + target.length - 1] + 1 });
    }
  }
  return out;
}

/**
 * Marca em laranja a palavra falada no texto da aula.
 * Usa uma caixinha por cima da página (e não o CSS Custom Highlight, que no iPhone deixava
 * restos de marcação em várias palavras ao mesmo tempo): só existe uma marcação, sempre.
 */
function makeHighlighter(root: HTMLElement | null, parts: string[]) {
  if (!root || typeof document === "undefined") return { show: (_k: number) => {}, clear: () => {}, destroy: () => {} };
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.dataset.leitura = "";
  layer.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:5";
  document.body.appendChild(layer);
  const paint = (range: Range | null) => {
    layer.replaceChildren();
    if (!range) return;
    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 1 || r.height < 1) continue;
      const box = document.createElement("div");
      box.style.cssText = `position:absolute;left:${r.left + window.scrollX - 2}px;top:${r.top + window.scrollY}px;width:${r.width + 4}px;height:${r.height}px;background:rgb(249 115 22 / 0.45);border-radius:4px`;
      layer.appendChild(box);
    }
  };
  // texto da aula, sem as marcações de fonte ("p.3"), que o robô não lê
  const nodes: { node: Text; start: number }[] = [];
  let flat = "";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest(".source-mark") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    nodes.push({ node: n as Text, start: flat.length });
    flat += (n as Text).data + " ";
  }
  const spots = mapWords(flat, parts);
  const at = (offset: number): [Text, number] => {
    let i = nodes.length - 1;
    while (i > 0 && nodes[i].start > offset) i--;
    return [nodes[i].node, Math.max(0, Math.min(offset - nodes[i].start, nodes[i].node.data.length))];
  };
  return {
    /** Marca a palavra k (na ordem de todas as palavras da aula). */
    show(k: number) {
      const spot = spots[k];
      if (!spot || !nodes.length) return; // palavra não achada: mantém a marcação anterior (nunca pula)
      const range = document.createRange();
      const [sn, so] = at(spot.start);
      const [en, eo] = at(spot.end);
      range.setStart(sn, so);
      range.setEnd(en, eo);
      paint(range);
      const rect = range.getBoundingClientRect();
      if (rect.top < 140 || rect.bottom > window.innerHeight - 140) window.scrollBy({ top: rect.top - window.innerHeight / 3, behavior: "smooth" });
    },
    clear() {
      paint(null);
    },
    destroy() {
      layer.remove();
    },
  };
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

/** Atraso entre o tempo do tocador e o som que se ouve (codificação do MP3 + saída de áudio do celular). */
const SOUND_LAG = 0.12;

type Prepared = { url: string; words: { s: number; t: number }[] };
type State = "idle" | "loading" | "playing" | "paused";

/**
 * Robô que lê a aula em voz alta. Voz Piper (grátis e sem limite, gerada no servidor): baixa o áudio da aula
 * INTEIRO antes de começar (com porcentagem), junta num áudio só e toca sem travar entre os trechos.
 * Enquanto lê, a frase atual fica marcada em laranja no texto. Se a voz do servidor falhar, usa a voz do aparelho.
 */
export function LessonNarrator({ text, labels = [], targetRef }: { text: string; labels?: string[]; targetRef?: RefObject<HTMLElement | null> }) {
  const parts = useMemo(() => toSpeech(text, labels), [text, labels]);
  const blocks = useMemo(() => toBlocks(parts), [parts]);
  // onde começam as palavras de cada frase na lista de todas as palavras da aula
  const wordOffset = useMemo(() => {
    const off: number[] = [];
    let n = 0;
    for (const p of parts) {
      off.push(n);
      n += splitWords(p).length;
    }
    return off;
  }, [parts]);
  // a voz do robô (Piper) é masculina; a voz do aparelho (reserva) segue o mesmo tom
  const gender = "m" as "f" | "m";
  const [rate, setRate] = useState(1);
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  // porcentagem mostrada: sobe de 1 em 1 (rápido no começo, mais devagar perto do próximo trecho pronto)
  const [shown, setShown] = useState(0);
  const [sentence, setSentence] = useState(-1);
  const [mode, setMode] = useState<"natural" | "device">("natural");
  const [note, setNote] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const prepared = useRef(new Map<string, Prepared>());
  const highlighter = useRef<ReturnType<typeof makeHighlighter> | null>(null);
  const raf = useRef(0);
  const current = useRef(-1);
  const stopped = useRef(false);
  const run = useRef(0);

  useEffect(() => {
    const cache = prepared.current;
    return () => {
      stopped.current = true;
      cancelAnimationFrame(raf.current);
      audio.current?.pause();
      highlighter.current?.destroy();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      for (const p of cache.values()) URL.revokeObjectURL(p.url);
    };
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    if (state !== "loading") return;
    let ticks = 0;
    const id = setInterval(() => {
      ticks++;
      setShown((s) => {
        if (s < progress) return s + 1; // trecho pronto: alcança logo, contando de 1 em 1
        const cap = progress >= 100 ? 100 : Math.min(99, progress + Math.floor((100 / Math.max(1, blocks.length)) * 0.9));
        if (s >= cap) return s;
        const near = (s - progress) / Math.max(1, cap - progress); // 0 = acabou de chegar, 1 = no limite
        const every = 1 + Math.floor(near * near * 25);
        return ticks % every === 0 ? s + 1 : s;
      });
    }, 70);
    return () => clearInterval(id);
  }, [state, progress, blocks.length]);

  /** Marca a palavra k (lista de todas as palavras) e mostra em qual frase está. */
  const markWord = (k: number, sentenceIndex: number) => {
    current.current = k;
    setSentence(sentenceIndex);
    if (!highlighter.current) highlighter.current = makeHighlighter(targetRef?.current ?? null, parts);
    if (k >= 0) highlighter.current.show(k);
    else highlighter.current.clear();
  };

  const finish = () => {
    cancelAnimationFrame(raf.current);
    highlighter.current?.destroy();
    highlighter.current = null;
    current.current = -1;
    setSentence(-1);
    setState("idle");
  };

  /** Baixa todos os trechos (2 de cada vez), mostrando a porcentagem, e junta num MP3 só. */
  const prepare = async (myRun: number): Promise<Prepared> => {
    const key = gender;
    const hit = prepared.current.get(key);
    if (hit) return hit;
    const chunks: ArrayBuffer[] = new Array(blocks.length);
    const seconds: number[] = new Array(blocks.length).fill(0);
    const measured: (number[] | null)[] = new Array(blocks.length).fill(null);
    let done = 0;
    let next = 0;
    setProgress(0);
    setShown(0);
    const worker = async () => {
      while (next < blocks.length) {
        const i = next++;
        let lastError: Error | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          if (stopped.current || run.current !== myRun) throw new Error("cancelado");
          const r = await fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: blocks[i].text }) }).catch(
            (e: Error) => e,
          );
          if (r instanceof Response && r.ok) {
            chunks[i] = await r.arrayBuffer();
            seconds[i] = Number(r.headers.get("x-audio-seconds")) || chunks[i].byteLength / 6000;
            measured[i] = decodeTimes(r.headers.get("x-word-times"));
            lastError = null;
            break;
          }
          lastError = r instanceof Response ? new Error(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "voz indisponível") : r;
          if (r instanceof Response && r.status !== 503 && r.status < 500) break;
          await new Promise((res) => setTimeout(res, 1500 * (attempt + 1)));
        }
        if (lastError) throw lastError;
        done++;
        setProgress(Math.round((done / blocks.length) * 100));
      }
    };
    await Promise.all([worker(), worker()]);
    const url = URL.createObjectURL(new Blob(chunks, { type: "audio/mpeg" }));
    const starts = sentenceTimeline(parts, blocks, seconds);
    const estimate = wordTimeline(parts, starts, seconds.reduce((x, y) => x + y, 0));
    const p = { url, words: mergeWordTimes(parts, blocks, seconds, measured, estimate) };
    prepared.current.set(key, p);
    return p;
  };

  const follow = (p: Prepared, a: HTMLAudioElement, myRun: number) => {
    const tick = () => {
      if (run.current !== myRun || stopped.current) return;
      // o som sai do alto-falante um pouquinho depois do tempo do tocador: a marcação espera esse instante
      const t = a.currentTime - SOUND_LAG;
      // palavra falada agora (busca binária na lista de palavras)
      let lo = 0;
      let hi = p.words.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (p.words[mid].t <= t) lo = mid;
        else hi = mid - 1;
      }
      if (p.words.length && current.current !== lo) markWord(lo, p.words[lo].s);
      raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  const playNatural = async () => {
    const myRun = ++run.current;
    // cria o tocador já no toque (o iPhone só libera áudio iniciado por um toque)
    const a = audio.current ?? (audio.current = new Audio());
    a.preload = "auto";
    (a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
    setState("loading");
    try {
      const p = await prepare(myRun);
      if (stopped.current || run.current !== myRun) return;
      if (a.src !== p.url) a.src = p.url;
      a.currentTime = 0;
      a.playbackRate = rate;
      a.onended = () => run.current === myRun && finish();
      await a.play();
      setState("playing");
      follow(p, a, myRun);
    } catch (e) {
      if (stopped.current || run.current !== myRun || (e as Error).message === "cancelado") return;
      // voz do robô indisponível agora: usa a voz do aparelho, sem travar a aula
      setMode("device");
      setNote(`${(e as Error).message} Usando a voz do aparelho.`);
      playDevice(0);
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
    u.rate = rate * 0.95;
    u.pitch = gender === "m" ? 0.9 : 1.05;
    u.onstart = () => markWord(wordOffset[i], i);
    // voz do aparelho: o navegador avisa o começo de cada palavra
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      const ws = splitWords(parts[i]);
      let j = 0;
      while (j + 1 < ws.length && ws[j + 1].at <= e.charIndex) j++;
      markWord(wordOffset[i] + j, i);
    };
    u.onend = () => {
      if (stopped.current) return;
      playDevice(i + 1);
    };
    setState("playing");
    speechSynthesis.speak(u);
  };

  const play = () => {
    stopped.current = false;
    if (state === "paused") {
      if (mode === "natural") {
        audio.current?.play();
        if (audio.current) {
          const p = prepared.current.get(gender);
          if (p) follow(p, audio.current, run.current);
        }
      } else speechSynthesis.resume();
      setState("playing");
      return;
    }
    if (mode === "natural") void playNatural();
    else {
      speechSynthesis.cancel();
      playDevice(Math.max(0, sentence));
    }
  };
  const pause = () => {
    cancelAnimationFrame(raf.current);
    highlighter.current?.clear(); // parou de falar: a marcação some
    current.current = -1;
    if (mode === "natural") audio.current?.pause();
    else speechSynthesis.pause();
    setState("paused");
  };
  const stop = () => {
    stopped.current = true;
    run.current++;
    audio.current?.pause();
    if (audio.current) audio.current.currentTime = 0;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    finish();
  };

  if (!parts.length) return null;
  const busy = state === "playing" || state === "loading";
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={state === "playing" ? pause : state === "loading" ? undefined : play}
          aria-label={state === "playing" ? "Pausar a leitura" : "Ouvir a aula"}
          className="rounded-full transition hover:scale-105 active:scale-95"
        >
          <Robot speaking={state === "playing"} />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Ouvir a aula</p>
          {state === "loading" ? (
            <div className="w-44 max-w-full" role="progressbar" aria-label="Preparando o áudio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown}>
              <p className="text-xs text-muted tabular-nums">Preparando o áudio… {shown}%</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary transition-[width] duration-100" style={{ width: `${shown}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted">
              {state === "idle"
                ? "Toque no robô: ele lê o texto para você, sem limite."
                : `${state === "paused" ? "Pausado na frase" : "Lendo a frase"} ${Math.max(1, sentence + 1)} de ${parts.length}`}
            </p>
          )}
          {note && <p className="text-xs text-warning">{note}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {busy ? (
          <Button size="sm" onClick={pause} disabled={state === "loading"} aria-label="Pausar"><Pause size={16} /> Pausar</Button>
        ) : (
          <Button size="sm" onClick={play} aria-label={state === "paused" ? "Continuar" : "Ouvir"}><Play size={16} /> {state === "paused" ? "Continuar" : "Ouvir"}</Button>
        )}
        {state !== "idle" && <Button size="sm" variant="ghost" onClick={stop} aria-label="Parar"><Square size={14} /></Button>}
        <select aria-label="Velocidade" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="h-8 rounded-lg border border-border bg-surface px-2 text-xs">
          {[0.85, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r === 1 ? "Normal" : r < 1 ? "Devagar" : `${r}x`}</option>)}
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
