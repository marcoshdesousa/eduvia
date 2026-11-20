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

/**
 * Distância em tempo real, igual app de corrida. O prestador (depois de aceitar) manda a posição do celular; o cliente vê
 * só "a 1,2 km de você", nunca o ponto exato.
 */
export function LiveDistance({ bookingId, as }: { bookingId: string; as: "PRO" | "CLIENT" }) {
  const [distance, setDistance] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  useEffect(() => {
    let stop = false;
    if (as === "PRO") {
      if (!("geolocation" in navigator)) return;
      let last = 0;
      const send = async (lat: number, lng: number) => {
        if (Date.now() - last < 8000) return; // no máximo a cada 8 s
        last = Date.now();
        const r = await fetch(`/api/pedidos/${bookingId}/posicao`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lat, lng }) }).then((x) => x.json()).catch(() => null);
        if (!stop && r?.distance) setDistance(r.distance);
      };
      const w = navigator.geolocation.watchPosition(
        (p) => void send(p.coords.latitude, p.coords.longitude),
        (e) => e.code === e.PERMISSION_DENIED && setDenied(true),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 20_000 },
      );
      return () => {
        stop = true;
        navigator.geolocation.clearWatch(w);
      };
    }
    const poll = async () => {
      if (document.visibilityState !== "visible") return;
      const r = await fetch(`/api/pedidos/${bookingId}/posicao`, { cache: "no-store" }).then((x) => x.json()).catch(() => null);
      if (!stop) setDistance(r?.distance ?? null);
    };
    void poll();
    const t = setInterval(poll, 8000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [bookingId, as]);
  if (as === "PRO") {
    if (denied) return <p className="text-xs text-warning">Ligue a localização do celular para o cliente ver a sua distância em tempo real.</p>;
    return distance ? <p className="text-sm font-semibold" data-testid="distancia-ao-vivo">Faltam {distance} até o cliente</p> : <p className="text-xs text-muted">Compartilhando sua distância com o cliente…</p>;
  }
  return distance ? (
    <p className="text-sm font-semibold" data-testid="distancia-ao-vivo">O prestador está a {distance} de você</p>
  ) : (
    <p className="text-xs text-muted">A distância aparece quando o prestador estiver a caminho com a localização ligada.</p>
  );
}
