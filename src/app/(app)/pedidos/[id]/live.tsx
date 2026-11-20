"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Atualiza a tela sozinha a cada poucos segundos (ex.: enquanto procura prestador). */
export function AutoRefresh({ every = 4000 }: { every?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => document.visibilityState === "visible" && router.refresh(), every);
    return () => clearInterval(t);
  }, [router, every]);
  return null;
}

/** Contagem regressiva até um horário ("1h 23min"). */
export function Countdown({ to, done = "Tempo esgotado" }: { to: string; done?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = new Date(to).getTime() - now;
  if (left <= 0) return <>{done}</>;
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return <span className="tabular-nums">{h > 0 ? `${h}h ${String(m).padStart(2, "0")}min` : `${m}:${String(s).padStart(2, "0")}`}</span>;
}

/** Radar animado do Contrate rápido. */
export function Radar({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="dp-radar relative grid h-28 w-28 place-items-center rounded-full bg-primary/10">
        <span />
        <span />
        <span />
        <div className="relative text-4xl">{label}</div>
      </div>
    </div>
  );
}
