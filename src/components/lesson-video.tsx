"use client";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen, Captions, CheckCircle2, Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Zap } from "lucide-react";
import { FoxShape } from "@/components/brand";
import { SubjectArt } from "@/components/subject-art";
import { Button } from "@/components/ui/button";
import { LessonAudio, wordOffsets, type WholeAudio } from "@/components/lesson-narrator";
import { lessonVideo, slideOfPart, type SlideEl } from "@/lib/lesson-slides";
import { splitWords } from "@/lib/speech-align";
import { toBlocks } from "@/lib/speech-text";
import { cn } from "@/lib/utils";

/** Atraso entre o tempo do tocador e o som que se ouve (igual ao do "Ouvir"). */
const SOUND_LAG = 0.12;
const SPEEDS = [1, 1.25, 1.5, 0.85];
const LOADING = ["Preparando o vídeo da aula…", "Preparando a voz do robô…", "Montando os slides…", "Estamos quase lá…", "Só mais um instante…"];

type Phase = "cover" | "loading" | "playing" | "paused" | "done";
export type VideoInfo = { slug: string; materia: string; lesson: number; title: string; highlights: string[] };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Negrito e itálico simples (o texto das aulas só usa isso). */
function inline(md: string): ReactNode[] {
  return md.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((t, i) =>
    t.startsWith("**") && t.endsWith("**") && t.length > 4 ? <b key={i}>{t.slice(2, -2)}</b> : t.startsWith("*") && t.endsWith("*") && t.length > 2 ? <em key={i}>{t.slice(1, -1)}</em> : <Fragment key={i}>{t}</Fragment>,
  );
}

/**
 * Modo vídeo da aula: o texto vira slides animados, com a voz do robô, legenda que grifa a palavra falada,
 * pausa, voltar/avançar 10 s, velocidade, partes e tela cheia. Não é arquivo de vídeo: roda na hora, no aparelho.
 */
export function LessonVideo({ text, info, onQuiz, onRead, quizLabel }: { text: string; info: VideoInfo; onQuiz: () => void; onRead: () => void; quizLabel: string }) {
  const v = useMemo(() => lessonVideo(text, info.title), [text, info.title]);
  const blocks = useMemo(() => toBlocks(v.parts), [v.parts]);
  const offsets = useMemo(() => wordOffsets(v.parts), [v.parts]);
  const stopped = useRef(false);
  const loader = useMemo(() => new LessonAudio(v.parts, blocks, offsets, () => stopped.current), [v.parts, blocks, offsets]);
  const [phase, setPhase] = useState<Phase>("cover");
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [part, setPart] = useState(0);
  const [word, setWord] = useState(-1);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [subs, setSubs] = useState(true);
  const [full, setFull] = useState(false);
  const [device, setDevice] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const whole = useRef<WholeAudio | null>(null);
  const raf = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const slideBox = useRef<HTMLDivElement>(null);
  const devicePart = useRef(0);

  // começo (em segundos) de cada frase no áudio
  const startsRef = useRef<number[]>([]);
  const duration = whole.current?.seconds ?? 0;
  // estimativa antes do áudio chegar (para a capa): ~2,6 palavras por segundo
  const estMin = Math.max(1, Math.round(offsets.length ? (offsets.at(-1)! + splitWords(v.parts.at(-1) ?? "").length) / 2.6 / 60 : 1));

  useEffect(() => {
    return () => {
      stopped.current = true;
      cancelAnimationFrame(raf.current);
      audio.current?.pause();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      loader.dispose();
    };
  }, [loader]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => setMsg((m) => (m + 1) % LOADING.length), 3000);
    return () => clearInterval(id);
  }, [phase]);

  // tela cheia de verdade (Android/computador); no iPhone, a tela cheia é o vídeo por cima de tudo
  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  const toggleFull = async () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) return void document.exitFullscreen().catch(() => {});
    if (full) return setFull(false);
    try {
      await el.requestFullscreen();
      await (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.("landscape").catch(() => {});
    } catch {
      setFull(true);
    }
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

  /** Voz do aparelho (reserva, quando a voz do robô não responde): lê frase por frase. */
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
    const voice = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase() === "pt-br");
    if (voice) u.voice = voice;
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

  const start = async (from = 0) => {
    stopped.current = false;
    if (device) return speakDevice(from);
    // cria o tocador já no toque (o iPhone só libera áudio iniciado por um toque)
    const a = audio.current ?? (audio.current = new Audio());
    a.preload = "auto";
    (a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
    let w = whole.current;
    if (!w) {
      setPhase("loading");
      try {
        w = await loader.prepare(setPct);
      } catch (e) {
        if (stopped.current || (e as Error).message === "cancelado") return;
        setDevice(true);
        setNote(`${(e as Error).message} Usando a voz do aparelho.`);
        return speakDevice(from);
      }
      if (stopped.current) return;
      whole.current = w;
      const st: number[] = [];
      for (const x of w.words) if (st[x.s] === undefined) st[x.s] = x.t;
      for (let i = 0; i < v.parts.length; i++) st[i] ??= st[i - 1] ?? 0;
      startsRef.current = st;
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
    if (!a || !whole.current) return void start();
    void a.play().then(() => {
      setPhase("playing");
      follow(whole.current!, a);
    }).catch(() => {});
  };
  const toggle = () => (phase === "playing" ? pause() : phase === "paused" ? resume() : phase === "loading" ? undefined : void start());

  /** Vai para um momento (segundos) do vídeo; o slide e a legenda já mudam, mesmo pausado. */
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
  const slide = v.slides[slideIndex];
  const started = phase !== "cover" && !(phase === "loading" && !whole.current);

  // o pedaço que está sendo falado fica sempre à vista dentro do slide
  useEffect(() => {
    const c = slideBox.current;
    const now = c?.querySelector<HTMLElement>("[data-now]");
    if (!c || !now) return;
    // o primeiro pedaço do slide: mostra o título junto
    if (now === c.querySelector(".lv-el")) return void c.scrollTo({ top: 0, behavior: "smooth" });
    const top = now.offsetTop - c.offsetTop;
    if (top < c.scrollTop || top + now.offsetHeight > c.scrollTop + c.clientHeight) c.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
  }, [part, slideIndex]);

  // a parte atual fica sempre à vista na lista de partes (sem rolar a página)
  const chapters = useRef<HTMLElement>(null);
  const sectionNow = v.slides[slideIndex]?.section ?? 0;
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
    const j = word - offsets[part];
    const w = ws[j];
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
  const sectionOf = sectionNow;
  const summary = v.summary.length ? v.summary : info.highlights.slice(0, 3);

  return (
    <div
      ref={box}
      tabIndex={-1}
      className={cn("lv outline-none", full && "lv-full")}
      data-full={full || undefined}
      aria-label={`Vídeo da aula: ${info.title}`}
    >
      {phase === "done" ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="text-success" size={52} />
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
          <div className="lv-stage" onClick={(e) => e.target === e.currentTarget && toggle()}>
            <SubjectArt slug={info.slug} className="lv-bgart" />
            {!started ? (
              <div className="lv-cover">
                <span className="lv-logo lv-logo-big"><svg viewBox="0 0 64 64"><FoxShape /></svg></span>
                <span className="lv-kicker">{info.materia} · Aula {info.lesson}</span>
                <span className="lv-cover-title">{info.title}</span>
                <span className="lv-meta">{v.sections.length} partes · cerca de {estMin} min</span>
                {phase === "loading" ? (
                  <div className="lv-loading" role="progressbar" aria-label="Preparando o vídeo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                    <span aria-live="polite">{LOADING[msg]} {pct}%</span>
                    <div><i style={{ width: `${pct}%` }} /></div>
                  </div>
                ) : (
                  <button type="button" className="lv-bigplay" onClick={() => void start()} aria-label="Assistir à aula">
                    <Play size={30} fill="currentColor" /> Assistir
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="lv-top">
                  <span className="lv-tag"><span className="lv-logo"><svg viewBox="0 0 64 64"><FoxShape /></svg></span>{info.materia}</span>
                  <span className="lv-count">parte {sectionOf + 1} de {v.sections.length}</span>
                </div>
                <div className="lv-body">
                  <div key={slideIndex} ref={slideBox} className="lv-slide">
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
                      return (
                        <div key={i} {...common}>
                          {(el.kind === "bullet" || el.kind === "num") && <span className="lv-dot">{el.kind === "num" ? el.n : "•"}</span>}
                          {el.kind === "enem" && <Zap className="lv-zap" size={18} fill="currentColor" />}
                          <span>{inline(el.md)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="lv-side"><SubjectArt slug={info.slug} className="lv-art" /></div>
                </div>
                {subs && subtitle && <div className="lv-sub">{subtitle}</div>}
                {phase === "paused" && (
                  <button type="button" className="lv-paused" onClick={resume} aria-label="Continuar">
                    <Play size={34} fill="currentColor" />
                  </button>
                )}
                {phase === "loading" && <div className="lv-paused" aria-hidden>…</div>}
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
              <button type="button" className={cn("lv-btn", !subs && "opacity-50")} onClick={() => setSubs(!subs)} aria-label={subs ? "Esconder a legenda" : "Mostrar a legenda"} aria-pressed={subs}><Captions size={20} /></button>
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
                  className={cn("lv-chap", started && i === sectionOf && "lv-chap-on", started && i < sectionOf && "lv-chap-ok")}
                >
                  {started && i < sectionOf ? "✓ " : ""}{s.title}
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
