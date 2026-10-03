"use client";
import { useEffect, useState } from "react";
import { Sparkles, Timer } from "lucide-react";

/** Contagem regressiva do tempo escolhido. Quando acaba, o relógio só some: o aluno continua revisando à vontade. */
export function StudyTimer({ startedAt, minutes }: { startedAt: string; minutes: number }) {
  const end = new Date(startedAt).getTime() + minutes * 60_000;
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null || now >= end) return null;
  const left = Math.ceil((end - now) / 1000);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="sticky top-2 z-20 space-y-1" role="timer" aria-label={`Faltam ${mm} minutos e ${ss} segundos`}>
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-surface/95 px-3 py-2 shadow-sm backdrop-blur">
        <Timer size={18} className="shrink-0 text-primary" />
        <span className="font-mono text-lg font-bold tabular-nums">{mm}:{ss}</span>
        <span className="text-xs leading-snug text-muted">Sei que pode parecer muito ou pouco tempo. Mas foque. Isso é para o seu próprio bem.</span>
      </div>
    </div>
  );
}

/** Aviso de que a IA terminou de criar o conteúdo (aparece ao abrir a sessão recém-criada e some ao rolar). */
export function ContentReadyToast() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let fresh = false;
    try {
      fresh = sessionStorage.getItem("eduvia:session-fresh") === "1";
      sessionStorage.removeItem("eduvia:session-fresh");
    } catch {}
    if (!fresh) return;
    setShow(true);
    const hide = () => window.scrollY > 400 && setShow(false);
    const t = setTimeout(() => setShow(false), 9000);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", hide);
    };
  }, []);
  if (!show) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
      <div className="flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-white shadow-lg">
        <Sparkles size={16} /> Pronto! A IA terminou de criar o seu conteúdo. Role e bons estudos.
      </div>
    </div>
  );
}

/** Mensagem de conforto ao concluir: escolheu bastante tempo e usou pouco? Tudo bem. */
export function finishMessage(startedAt: string, minutes: number) {
  const used = Math.max(1, Math.round((Date.now() - new Date(startedAt).getTime()) / 60_000));
  if (used < minutes * 0.6) {
    return `Você escolheu ${minutes} min e terminou em ${used} min. Tudo bem! Cada um tem o seu ritmo. Se quiser, use o tempo que sobrou para reler os destaques ou descansar.`;
  }
  return `Você focou por ${used} min. Isso é constância, e constância é o que aprova.`;
}
