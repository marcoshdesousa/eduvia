"use client";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BookOpen, Captions, CheckCircle2, Lightbulb, Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Zap } from "lucide-react";
import { FoxShape } from "@/components/brand";
import { SubjectArt, subjectAccent } from "@/components/subject-art";
import { Button } from "@/components/ui/button";
import { wordOffsets, type WholeAudio } from "@/components/lesson-narrator";
import { lessonVideo, slideOfPart, type Slide, type SlideEl } from "@/lib/lesson-slides";
import { splitWords } from "@/lib/speech-align";
import { cn } from "@/lib/utils";

/** Atraso entre o tempo do tocador e o som que se ouve. */
const SOUND_LAG = 0.12;
const SPEEDS = [1, 1.25, 1.5, 0.85];
type VoiceStatus = { ready: true; url: string; seconds: number; times: number[] } | { ready: false; done: number; total: number; error?: string };
const TERM_SECONDS = 7;

type Phase = "cover" | "loading" | "playing" | "paused" | "done";
export type VideoInfo = { topicId: string; slug: string; materia: string; lesson: number; title: string; highlights: string[]; keyPoints?: { term: string; explanation: string }[] };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const norm = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const WORD = /([\p{L}\p{N}][\p{L}\p{N}'’-]*)/u;

/** Negrito e itálico simples (o texto das aulas só usa isso). */
function segments(md: string) {
  return md
    .split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
    .filter(Boolean)
    .map((t) =>
      t.startsWith("**") && t.endsWith("**") && t.length > 4 ? { text: t.slice(2, -2), bold: true, italic: false } : t.startsWith("*") && t.endsWith("*") && t.length > 2 ? { text: t.slice(1, -1), bold: false, italic: true } : { text: t, bold: false, italic: false },
    );
}
function inline(md: string): ReactNode[] {
  return segments(md).map((s, i) => (s.bold ? <b key={i}>{s.text}</b> : s.italic ? <em key={i}>{s.text}</em> : <Fragment key={i}>{s.text}</Fragment>));
}

/**
 * Texto de um pedaço do slide, palavra por palavra: as já faladas acesas, a atual em laranja, as próximas mais
 * apagadas. O negrito vira "marca-texto" quando a voz chega nele (e fica marcado depois).
 * firstWord: número (na aula toda) da primeira palavra deste pedaço; word: palavra falada agora.
 */
function Karaoke({ md, firstWord, word, live }: { md: string; firstWord: number; word: number; live: boolean }) {
  let k = firstWord;
  return (
    <>
      {segments(md).map((s, si) => {
        const pieces = s.text.split(WORD);
        const start = k;
        const nodes = pieces.map((p, pi) => {
          if (pi % 2 === 0) return <Fragment key={pi}>{p}</Fragment>;
          const w = k++;
          if (!live) return <Fragment key={pi}>{p}</Fragment>;
          return <span key={pi} className={w === word ? "lv-cw" : w > word ? "lv-nw" : undefined}>{p}</span>;
        });
        if (s.bold) return <b key={si} className={cn("lv-mark", (!live || start <= word) && "lv-mark-on")}>{nodes}</b>;
        if (s.italic) return <em key={si}>{nodes}</em>;
        return <Fragment key={si}>{nodes}</Fragment>;
      })}
    </>
  );
}

/**
 * Modo vídeo da aula: o texto vira slides animados com uma voz natural (Francisca ou Antônio). Cada parte abre com
 * um cartão; os tópicos entram quando a voz chega neles e acendem palavra por palavra; o negrito ganha marca-texto;
 * os termos importantes aparecem em cartões. Tem pausa, ±10 s, velocidade, partes, legenda e tela cheia.
 * Não é arquivo de vídeo: roda na hora, no aparelho.
 */
export function LessonVideo({ text, info, onQuiz, onRead, quizLabel }: { text: string; info: VideoInfo; onQuiz: () => void; onRead: () => void; quizLabel: string }) {
  const v = useMemo(() => lessonVideo(text, info.title), [text, info.title]);
  const offsets = useMemo(() => wordOffsets(v.parts), [v.parts]);
  const stopped = useRef(false);
  const [phase, setPhase] = useState<Phase>("cover");
  const [note, setNote] = useState<string | null>(null);
  const [part, setPart] = useState(0);
  const [word, setWord] = useState(-1);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [subs, setSubs] = useState(false);
  const [full, setFull] = useState(false);
  const [device, setDevice] = useState(false);
  const [term, setTerm] = useState<{ term: string; explanation: string } | null>(null);
  const shownTerms = useRef(new Set<string>());
  const audio = useRef<HTMLAudioElement | null>(null);
  const whole = useRef<WholeAudio | null>(null);
  const raf = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const slideBox = useRef<HTMLDivElement>(null);
  const devicePart = useRef(0);
  const startsRef = useRef<number[]>([]);
  const duration = whole.current?.seconds ?? 0;
  // estimativa antes do áudio chegar (para a capa): ~2,6 palavras por segundo
  const estMin = Math.max(1, Math.round(offsets.length ? (offsets.at(-1)! + splitWords(v.parts.at(-1) ?? "").length) / 2.6 / 60 : 1));

  // a voz é gravada uma vez por aula e guardada: ao abrir, já confere se está pronta
  const status = useCallback(async (): Promise<VoiceStatus | null> => {
    const r = await fetch(`/api/aulas/video-voz?aula=${encodeURIComponent(info.topicId)}`).catch(() => null);
    return r?.ok ? ((await r.json()) as VoiceStatus) : null;
  }, [info.topicId]);
  const first = useRef<Promise<VoiceStatus | null> | null>(null);
  useEffect(() => {
    first.current = status();
  }, [status]);

  useEffect(() => {
    return () => {
      stopped.current = true;
      cancelAnimationFrame(raf.current);
      audio.current?.pause();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);


  // Tela cheia: o vídeo fica deitado, como no YouTube. No Android o celular gira sozinho (tela cheia de verdade +
  // trava na horizontal). Onde o site não pode girar o celular (iPhone), o vídeo é desenhado deitado ocupando
  // a tela toda: é só virar o celular. Se a pessoa já estiver com o celular deitado, nada é girado.
  const [turn, setTurn] = useState(false);
  const locked = useRef(false);
  // tela cheia do próprio app (sem a do navegador): onde o celular não gira sozinho
  const pseudo = useRef(false);
  type Orient = ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void };
  const portraitPhone = () => window.innerHeight > window.innerWidth && window.matchMedia("(pointer: coarse)").matches;
  useEffect(() => {
    const on = () => {
      if (pseudo.current) return;
      const isFull = document.fullscreenElement === box.current;
      if (!isFull) {
        locked.current = false;
        (screen.orientation as Orient | undefined)?.unlock?.();
      }
      setFull(isFull);
    };
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  useEffect(() => {
    if (!full) return setTurn(false);
    const check = () => setTurn(!locked.current && portraitPhone());
    check();
    window.addEventListener("resize", check);
    // a página de trás não rola enquanto o vídeo ocupa a tela
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", check);
      document.body.style.overflow = overflow;
    };
  }, [full]);
  const toggleFull = async () => {
    const el = box.current;
    if (!el) return;
    if (full) {
      pseudo.current = false;
      locked.current = false;
      (screen.orientation as Orient | undefined)?.unlock?.();
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setFull(false);
      return;
    }
    const real = await el.requestFullscreen?.({ navigationUI: "hide" }).then(() => true, () => false);
    try {
      await (screen.orientation as Orient).lock!("landscape");
      locked.current = true;
    } catch {
      locked.current = false;
    }
    if (!locked.current && portraitPhone()) {
      // o celular não girou: na tela cheia do navegador não dá para desenhar deitado, então usa a do app
      pseudo.current = true;
      if (real && document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setFull(true);
      setTurn(true);
      return;
    }
    setFull(true);
    setTurn(false);
  };

  const follow = useCallback((w: WholeAudio, a: HTMLAudioElement) => {
    let lastT = -1;
    const tick = () => {
      if (stopped.current) return;
      const t = Math.max(0, a.currentTime - SOUND_LAG);
      let lo = 0;
      let hi = w.words.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (w.words[mid].t <= t) lo = mid;
        else hi = mid - 1;
      }
      const cur = w.words[lo];
      if (cur) {
        setWord(cur.k);
        setPart(cur.s);
      }
      if (Math.abs(t - lastT) > 0.25) {
        lastT = t;
        setTime(a.currentTime);
      }
      raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, []);

  /** Voz do aparelho (última reserva): lê frase por frase. */
  const speakDevice = (i: number) => {
    if (!("speechSynthesis" in window)) {
      setNote("Seu navegador não tem leitura em voz alta.");
      return setPhase("paused");
    }
    speechSynthesis.cancel();
    if (stopped.current) return;
    if (i >= v.parts.length) return setPhase("done");
    devicePart.current = i;
    setPart(i);
    setWord(offsets[i]);
    const u = new SpeechSynthesisUtterance(v.parts[i]);
    u.lang = "pt-BR";
    const pt = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase() === "pt-br");
    if (pt) u.voice = pt;
    u.rate = rate * 0.95;
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      const ws = splitWords(v.parts[i]);
      let j = 0;
      while (j + 1 < ws.length && ws[j + 1].at <= e.charIndex) j++;
      setWord(offsets[i] + j);
    };
    u.onend = () => {
      if (!stopped.current && devicePart.current === i) speakDevice(i + 1);
    };
    setPhase("playing");
    speechSynthesis.speak(u);
  };

  const start = async (from = 0): Promise<void> => {
    stopped.current = false;
    if (device) return speakDevice(from);
    // cria o tocador já no toque (o iPhone só libera áudio iniciado por um toque)
    const a = audio.current ?? (audio.current = new Audio());
    a.preload = "auto";
    (a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
    let w = whole.current;
    if (!w) {
      setPhase("loading");
      // voz da aula: já gravada (abre na hora); se ainda não foi gravada, usa a voz do aparelho por enquanto
      const st = await (first.current ?? status());
      if (stopped.current) return;
      if (!st?.ready) {
        setDevice(true);
        setNote("A voz desta aula ainda está sendo gravada. Por enquanto, usando a voz do aparelho.");
        return speakDevice(from);
      }
      const words: WholeAudio["words"] = [];
      v.parts.forEach((p, si) => splitWords(p).forEach((_, j) => words.push({ k: offsets[si] + j, s: si, t: st.times[offsets[si] + j] ?? 0 })));
      w = { url: st.url, words, seconds: st.seconds };
      whole.current = w;
      const starts: number[] = [];
      for (const x of w.words) if (starts[x.s] === undefined) starts[x.s] = x.t;
      for (let i = 0; i < v.parts.length; i++) starts[i] ??= starts[i - 1] ?? 0;
      startsRef.current = starts;
      a.src = w.url;
      a.onended = () => {
        cancelAnimationFrame(raf.current);
        setPhase("done");
        box.current?.scrollIntoView({ block: "nearest" });
      };
    }
    a.playbackRate = rate;
    if (from > 0) a.currentTime = startsRef.current[from] ?? 0;
    else if (phase === "done" || a.ended) a.currentTime = 0;
    try {
      await a.play();
    } catch {
      return setPhase("paused");
    }
    setPhase("playing");
    follow(w, a);
  };

  const pause = () => {
    cancelAnimationFrame(raf.current);
    if (device) speechSynthesis.cancel();
    else audio.current?.pause();
    setPhase("paused");
  };
  const resume = () => {
    if (device) return speakDevice(devicePart.current);
    const a = audio.current;
    if (!a || !whole.current) return void start(part);
    void a
      .play()
      .then(() => {
        setPhase("playing");
        follow(whole.current!, a);
      })
      .catch(() => {});
  };
  const toggle = () => (phase === "playing" ? pause() : phase === "paused" ? resume() : phase === "loading" ? undefined : void start());

  /** Vai para um momento (segundos) do vídeo; o slide e o texto já mudam, mesmo pausado. */
  const seekTime = (t: number) => {
    const a = audio.current;
    if (!a || !whole.current) return;
    a.currentTime = Math.max(0, Math.min(t, whole.current.seconds - 0.05));
    setTime(a.currentTime);
    const st = startsRef.current;
    let i = 0;
    while (i + 1 < st.length && st[i + 1] <= a.currentTime) i++;
    setPart(i);
    setWord(offsets[i]);
  };
  const seekPart = (p: number) => {
    if (device) return speakDevice(p);
    if (!whole.current) return void start(p);
    seekTime(startsRef.current[p] ?? 0);
    if (phase !== "playing") resume();
  };
  const skip = (secs: number) => {
    if (device) return speakDevice(Math.max(0, Math.min(v.parts.length - 1, devicePart.current + (secs > 0 ? 2 : -2))));
    seekTime((audio.current?.currentTime ?? 0) + secs);
  };

  // teclado: espaço pausa/continua, setas voltam/avançam 10 s
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const key = (e: KeyboardEvent) => {
      const act = e.key === " " || e.key === "k" ? toggle : e.key === "ArrowLeft" ? () => skip(-10) : e.key === "ArrowRight" ? () => skip(10) : null;
      if (!act) return;
      e.preventDefault();
      act();
    };
    el.addEventListener("keydown", key);
    return () => el.removeEventListener("keydown", key);
  });

  const slideIndex = slideOfPart(v, Math.max(0, part));
  const slide: Slide = v.slides[slideIndex];
  const started = phase !== "cover" && !(phase === "loading" && !whole.current);
  const sectionNow = slide?.section ?? 0;
  // enquanto a voz lê o título da parte, aparece o cartão de abertura da parte
  const firstEl = slide?.els[0]?.from ?? slide?.to ?? 0;
  const opening = started && slide && slide.cont === 0 && firstEl > slide.from && part < firstEl;

  // termos importantes da aula: quando a voz fala um deles pela primeira vez, aparece um cartão
  const keyTerms = useMemo(() => (info.keyPoints ?? []).filter((k) => norm(k.term).length >= 4).map((k) => ({ ...k, n: norm(k.term) })), [info.keyPoints]);
  useEffect(() => {
    if (!started || phase !== "playing") return;
    const said = ` ${norm(v.parts[part] ?? "")} `;
    // começo de palavra: "produtor" também vale para "produtores"
    const hit = keyTerms.find((k) => !shownTerms.current.has(k.n) && said.includes(` ${k.n}`));
    if (!hit) return;
    shownTerms.current.add(hit.n);
    setTerm({ term: hit.term, explanation: hit.explanation });
  }, [part, started, phase, keyTerms, v.parts]);
  useEffect(() => {
    if (!term || phase !== "playing") return;
    const id = setTimeout(() => setTerm(null), (TERM_SECONDS * 1000) / rate);
    return () => clearTimeout(id);
  }, [term, phase, rate]);

  // o pedaço que está sendo falado fica sempre à vista dentro do slide
  useEffect(() => {
    const c = slideBox.current;
    const now = c?.querySelector<HTMLElement>("[data-now]");
    if (!c || !now) return;
    if (now === c.querySelector(".lv-el")) return void c.scrollTo({ top: 0, behavior: "smooth" });
    const top = now.offsetTop - c.offsetTop;
    if (top < c.scrollTop || top + now.offsetHeight > c.scrollTop + c.clientHeight) c.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
  }, [part, slideIndex]);

  // a parte atual fica sempre à vista na lista de partes (sem rolar a página)
  const chapters = useRef<HTMLElement>(null);
  useEffect(() => {
    const c = chapters.current;
    const on = c?.children[sectionNow] as HTMLElement | undefined;
    if (c && on) c.scrollTo({ left: Math.max(0, on.offsetLeft - c.offsetLeft - 24), behavior: "smooth" });
  }, [sectionNow]);

  const elState = (el: SlideEl) => (part >= el.to ? "done" : part >= el.from ? "now" : "later");
  const subtitle = (() => {
    const p = v.parts[part];
    if (!p) return null;
    const ws = splitWords(p);
    const w = ws[word - offsets[part]];
    if (!w) return <span className="lv-said">{p}</span>;
    return (
      <>
        <span className="lv-said">{p.slice(0, w.at)}</span>
        <span className="lv-word">{p.slice(w.at, w.at + w.word.length)}</span>
        {p.slice(w.at + w.word.length)}
      </>
    );
  })();

  // na voz do aparelho não há tempo exato: a barra anda por frase
  const shownTime = device ? part : time;
  const total = device ? v.parts.length - 1 : duration;
  const summary = v.summary.length ? v.summary : info.highlights.slice(0, 3);
  const accent = { "--lv-accent": subjectAccent(info.slug) } as CSSProperties;

  return (
    <div ref={box} tabIndex={-1} className={cn("lv outline-none", full && "lv-full", turn && "lv-turn")} data-full={full || undefined} style={accent} aria-label={`Vídeo da aula: ${info.title}`}>
      {phase === "done" ? (
        <div className="lv-end space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="lv-pop text-success" size={52} />
            <p className="text-xl font-bold">Vídeo assistido!</p>
            <p className="text-sm text-muted">Agora é a hora do quiz para liberar a próxima aula.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted">
            <div className="rounded-xl bg-surface-2 p-2"><b className="block text-base text-foreground">{Math.max(1, Math.round((duration || estMin * 60) / 60))} min</b>de aula</div>
            <div className="rounded-xl bg-surface-2 p-2"><b className="block text-base text-foreground">{v.sections.length}</b>partes</div>
            <div className="rounded-xl bg-surface-2 p-2"><b className="block text-base text-foreground">{v.slides.length}</b>slides</div>
          </div>
          {summary.length > 0 && (
            <div className="rounded-xl border border-border p-3">
              <p className="font-semibold">Resumo</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">{summary.map((s, i) => <li key={i}>{inline(s)}</li>)}</ul>
            </div>
          )}
          <div className="grid gap-2">
            <Button size="lg" onClick={onQuiz}>{quizLabel}</Button>
            <Button variant="secondary" onClick={() => void start()}><RotateCcw size={16} /> Ver o vídeo de novo</Button>
            <Button variant="ghost" onClick={onRead}><BookOpen size={16} /> Ler o texto da aula</Button>
          </div>
        </div>
      ) : (
        <>
          <div className={cn("lv-stage", phase === "playing" && "lv-talking")} onClick={(e) => e.target === e.currentTarget && toggle()}>
            <div className="lv-blobs" aria-hidden><i /><i /><i /></div>
            {started && <div className="lv-topbar" aria-hidden><i style={{ width: `${total ? (shownTime / total) * 100 : 0}%` }} /></div>}
            {!started ? (
              <div className="lv-cover">
                <SubjectArt slug={info.slug} className="lv-cover-art" />
                <span className="lv-logo lv-logo-big"><svg viewBox="0 0 64 64"><FoxShape /></svg></span>
                <span className="lv-kicker">{info.materia} · Aula {info.lesson}</span>
                <span className="lv-cover-title">{info.title}</span>
                <span className="lv-meta">{v.sections.length} partes · cerca de {estMin} min</span>
                {phase === "loading" ? (
                  <div className="lv-loading" role="status">
                    <span aria-live="polite">Abrindo a aula…</span>
                  </div>
                ) : (
                  <>
                    <button type="button" className="lv-bigplay" onClick={() => void start()} aria-label="Assistir à aula">
                      <Play size={30} fill="currentColor" /> Assistir
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {!opening && <SubjectArt slug={info.slug} className="lv-bgart" />}
                <div className="lv-top">
                  <span className="lv-tag">
                    <span className="lv-logo"><svg viewBox="0 0 64 64"><FoxShape /></svg></span>
                    {info.materia}
                    <span className="lv-eq-bars" aria-hidden><i /><i /><i /><i /></span>
                  </span>
                  <span className="lv-count">parte {sectionNow + 1} de {v.sections.length}</span>
                </div>
                {opening ? (
                  <div key={`open-${slideIndex}`} className="lv-opening">
                    <SubjectArt slug={info.slug} className="lv-opening-art" />
                    <span className="lv-opening-num">Parte {sectionNow + 1}</span>
                    <span className="lv-opening-title">{slide.title}</span>
                    {slide.enem && <span className="lv-badge"><Zap size={14} fill="currentColor" /> Cai muito no ENEM</span>}
                  </div>
                ) : (
                  <div className="lv-body">
                    <div key={slideIndex} ref={slideBox} className={cn("lv-slide", `lv-tr-${slideIndex % 4}`)}>
                      {slide.enem && <span className="lv-badge"><Zap size={14} fill="currentColor" /> Cai muito no ENEM</span>}
                      <h2 className="lv-title">{slide.title}{slide.cont > 0 && <span className="lv-cont"> (continuação)</span>}</h2>
                      {slide.els.map((el, i) => {
                        const st = elState(el);
                        const common = { "data-now": st === "now" || undefined, className: cn("lv-el", `lv-${el.kind}`, `lv-${st}`) };
                        if (el.kind === "table")
                          return (
                            <div key={i} {...common}>
                              <table>
                                <tbody>{el.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => (ri === 0 ? <th key={ci}>{inline(c)}</th> : <td key={ci}>{inline(c)}</td>))}</tr>)}</tbody>
                              </table>
                            </div>
                          );
                        // a primeira palavra deste pedaço na aula (o número do item "1." também é falado)
                        const first = offsets[el.from] + (el.kind === "num" && el.n ? splitWords(el.n).length : 0);
                        return (
                          <div key={i} {...common}>
                            {(el.kind === "bullet" || el.kind === "num") && <span className="lv-dot">{el.kind === "num" ? el.n : "•"}</span>}
                            {el.kind === "enem" && <Zap className="lv-zap" size={18} fill="currentColor" />}
                            <span><Karaoke md={el.md} firstWord={first} word={word} live={st === "now"} /></span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="lv-side">
                      {term ? (
                        <div key={term.term} className="lv-term lv-term-side">
                          <span className="lv-term-k"><Lightbulb size={14} /> Termo importante</span>
                          <b>{term.term}</b>
                          <span>{term.explanation}</span>
                        </div>
                      ) : (
                        <SubjectArt slug={info.slug} className="lv-art" />
                      )}
                    </div>
                  </div>
                )}
                {term && !opening && (
                  <div key={term.term} className={cn("lv-term lv-term-float", subs && "lv-term-up")}>
                    <span className="lv-term-k"><Lightbulb size={14} /> Termo importante</span>
                    <b>{term.term}</b>
                    <span>{term.explanation}</span>
                  </div>
                )}
                {subs && subtitle && <div className="lv-sub">{subtitle}</div>}
                {phase === "paused" && (
                  <button type="button" className="lv-paused" onClick={resume} aria-label="Continuar">
                    <Play size={34} fill="currentColor" />
                  </button>
                )}
                {phase === "loading" && <div className="lv-paused lv-spin" aria-hidden />}
              </>
            )}
          </div>

          <div className="lv-controls">
            <input
              type="range"
              className="lv-range"
              aria-label="Posição no vídeo"
              min={0}
              max={Math.max(1, total)}
              step={0.5}
              value={Math.min(shownTime, Math.max(1, total))}
              disabled={!total}
              onChange={(e) => (device ? speakDevice(Number(e.target.value)) : seekTime(Number(e.target.value)))}
              style={{ ["--p" as string]: `${total ? (shownTime / total) * 100 : 0}%` }}
            />
            <div className="lv-times">
              {device ? <span>frase {part + 1} de {v.parts.length}</span> : <><span>{mmss(shownTime)}</span><span>{total ? mmss(total) : `~${estMin}:00`}</span></>}
            </div>
            <div className="lv-buttons">
              <button type="button" className={cn("lv-btn", subs && "lv-btn-on")} onClick={() => setSubs(!subs)} aria-label={subs ? "Esconder a legenda" : "Mostrar a legenda"} aria-pressed={subs}><Captions size={20} /></button>
              <button type="button" className="lv-btn" onClick={() => skip(-10)} disabled={!started} aria-label="Voltar 10 segundos"><RotateCcw size={20} /></button>
              <button type="button" className="lv-btn lv-btn-main" onClick={toggle} disabled={phase === "loading"} aria-label={phase === "playing" ? "Pausar" : "Assistir"}>
                {phase === "playing" ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
              </button>
              <button type="button" className="lv-btn" onClick={() => skip(10)} disabled={!started} aria-label="Avançar 10 segundos"><RotateCw size={20} /></button>
              <button type="button" className="lv-btn lv-speed" onClick={() => setRate(SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length])} aria-label="Velocidade">{String(rate).replace(".", ",")}x</button>
              <button type="button" className="lv-btn" onClick={toggleFull} aria-label={full ? "Sair da tela cheia" : "Tela cheia"}>{full ? <Minimize size={20} /> : <Maximize size={20} />}</button>
            </div>
            <nav ref={chapters} className="lv-chapters" aria-label="Partes da aula">
              {v.sections.map((s, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => seekPart(v.slides[s.slide].from)}
                  className={cn("lv-chap", started && i === sectionNow && "lv-chap-on", started && i < sectionNow && "lv-chap-ok")}
                >
                  {started && i < sectionNow ? "✓ " : ""}{s.title}
                </button>
              ))}
            </nav>
            {note && <p className="text-xs text-warning">{note}</p>}
          </div>
        </>
      )}
    </div>
  );
}
