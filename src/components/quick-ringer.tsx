"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Offer = { id: string; bookingId: string; category: string; qty: string; price: string; distance: string; place: string; notes: string | null; expiresAt: string };

/** Som de chamado (dois tons repetidos, tipo app de corrida), feito no próprio navegador. */
function useRingtone() {
  const ctx = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [locked, setLocked] = useState(false);
  const ensure = useCallback(() => {
    try {
      ctx.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (ctx.current.state === "suspended") void ctx.current.resume();
      setLocked(ctx.current.state !== "running");
    } catch {
      setLocked(true);
    }
  }, []);
  useEffect(() => {
    const unlock = () => ensure();
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, [ensure]);
  const beep = () => {
    const c = ctx.current;
    if (!c || c.state !== "running") return;
    [880, 660, 880, 660].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "square";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, c.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + i * 0.18 + 0.16);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.18);
      o.stop(c.currentTime + i * 0.18 + 0.17);
    });
    navigator.vibrate?.([400, 150, 400]);
  };
  const start = () => {
    ensure();
    if (timer.current) return;
    beep();
    timer.current = setInterval(beep, 1600);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  return { start, stop, locked, ensure };
}

/**
 * Fica ligado em todas as telas do prestador: pergunta ao servidor se chegou chamado do Contrate rápido e,
 * se chegou, toca o som e abre a tela para aceitar ou recusar. (Com o app fechado, quem avisa é a notificação.)
 */
export function QuickRinger() {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const ring = useRingtone();

  const poll = useCallback(async () => {
    const r = await fetch("/api/rapido/ofertas", { cache: "no-store" }).then((x) => (x.ok ? x.json() : null)).catch(() => null);
    if (!r) return;
    setOn(!!r.on);
    setOffer((cur) => (r.offers[0] ? (cur?.id === r.offers[0].id ? cur : r.offers[0]) : null));
  }, []);

  useEffect(() => {
    void poll();
    const t = setInterval(() => document.visibilityState === "visible" && void poll(), 4000);
    const onShow = () => document.visibilityState === "visible" && void poll();
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [poll]);

  useEffect(() => {
    if (!offer) {
      ring.stop();
      return;
    }
    setMsg(null);
    ring.start();
    const tick = () => {
      const s = Math.max(0, Math.round((Date.parse(offer.expiresAt) - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0) setOffer(null);
    };
    tick();
    const t = setInterval(tick, 500);
    return () => {
      clearInterval(t);
      ring.stop();
    };
  }, [offer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = async (action: "aceitar" | "recusar") => {
    if (!offer) return;
    setBusy(true);
    ring.stop();
    const r = await fetch(`/api/rapido/ofertas/${offer.id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) }).catch(() => null);
    const body = (await r?.json().catch(() => null)) as { bookingId?: string; error?: string } | null;
    setBusy(false);
    if (action === "aceitar" && r?.ok && body?.bookingId) {
      setOffer(null);
      router.push(`/pedidos/${body.bookingId}`);
      return;
    }
    if (action === "aceitar") setMsg(body?.error ?? "Não deu para aceitar.");
    setOffer(null);
  };

  return (
    <>
      {on && ring.locked && !offer && (
        <button type="button" onClick={ring.ensure} className="fixed bottom-20 right-3 z-40 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-lg md:bottom-4">
          <BellRing size={14} /> Toque para ligar o som dos chamados
        </button>
      )}
      {msg && !offer && (
        <div role="status" className="fixed inset-x-3 bottom-20 z-50 rounded-xl bg-foreground px-4 py-3 text-sm text-background shadow-xl md:bottom-4 md:left-auto md:w-96">
          {msg}
          <button className="float-right" onClick={() => setMsg(null)} aria-label="Fechar"><X size={16} /></button>
        </div>
      )}
      {offer && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3 sm:items-center" role="alertdialog" aria-labelledby="chamado-titulo">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="dp-ring flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><BellRing /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Contrate rápido</p>
                <h2 id="chamado-titulo" className="text-xl font-bold">{offer.category}</h2>
              </div>
              <span className="ml-auto rounded-full bg-surface-2 px-2.5 py-1 text-sm font-bold tabular-nums">{left}s</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-surface-2 p-3"><p className="text-muted">Você recebe</p><p className="text-lg font-bold">{offer.price}</p><p className="text-xs text-muted">{offer.qty}</p></div>
              <div className="rounded-xl bg-surface-2 p-3"><p className="text-muted">Distância</p><p className="text-lg font-bold">{offer.distance}</p><p className="flex items-center gap-1 text-xs text-muted"><MapPin size={12} /> {offer.place}</p></div>
            </div>
            {offer.notes && <p className="rounded-xl bg-surface-2 p-3 text-sm">“{offer.notes}”</p>}
            <p className="text-xs text-muted">Aceitando, você tem até 2 horas para chegar. O endereço completo aparece depois do aceite.</p>
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <Button variant="outline" size="lg" disabled={busy} onClick={() => answer("recusar")}>Recusar</Button>
              <Button size="lg" disabled={busy} onClick={() => answer("aceitar")}>{busy && <Loader2 className="animate-spin" size={18} />} Aceitar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
