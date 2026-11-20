"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, LocateFixed, Search } from "lucide-react";
import { geocode, lookupCep, reverseGeocode } from "@/lib/geo-client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

const MapPicker = dynamic(() => import("@/components/map-picker").then((m) => m.MapPicker), { ssr: false, loading: () => <div className="h-[260px] animate-pulse rounded-xl bg-surface-2" /> });

export type PickedPlace = { lat: number; lng: number; district: string; city: string; uf: string; street?: string; number?: string; cep?: string };

/**
 * Escolha de um ponto no mapa: pela localização do aparelho, pelo CEP ou tocando no mapa.
 * Grava campos escondidos (lat, lng, district, city, uf) para o formulário.
 */
export function PlacePicker({ initial, onChange, withHidden = true, hint }: { initial?: PickedPlace | null; onChange?: (p: PickedPlace | null) => void; withHidden?: boolean; hint?: string }) {
  const [place, setPlace] = useState<PickedPlace | null>(initial ?? null);
  const [cep, setCep] = useState("");
  const [busy, setBusy] = useState<"gps" | "cep" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const update = (p: PickedPlace | null) => {
    setPlace(p);
    onChange?.(p);
  };

  async function fromPoint(lat: number, lng: number) {
    const r = await reverseGeocode(lat, lng);
    update({ lat, lng, district: r?.district ?? place?.district ?? "", city: r?.city ?? place?.city ?? "", uf: r?.uf ?? place?.uf ?? "", street: r?.street, number: r?.number, cep: r?.cep });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!!busy}
          onClick={() => {
            setMsg(null);
            if (!navigator.geolocation) return setMsg("Este aparelho não informa a localização. Use o CEP.");
            setBusy("gps");
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                await fromPoint(pos.coords.latitude, pos.coords.longitude);
                setBusy(null);
              },
              () => {
                setBusy(null);
                setMsg("Não conseguimos a sua localização. Libere a permissão ou use o CEP.");
              },
              { enableHighAccuracy: true, timeout: 15000 },
            );
          }}
        >
          {busy === "gps" ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />} Usar minha localização
        </Button>
        <div className="flex min-w-0 flex-1 gap-2">
          <Input value={cep} onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" placeholder="ou digite o CEP" aria-label="CEP" className="min-w-0" />
          <Button
            type="button"
            variant="secondary"
            disabled={!!busy || cep.length !== 8}
            aria-label="Buscar CEP"
            onClick={async () => {
              setMsg(null);
              setBusy("cep");
              const a = await lookupCep(cep);
              if (!a) {
                setBusy(null);
                return setMsg("CEP não encontrado.");
              }
              const pt = (await geocode(`${a.street}, ${a.district}, ${a.city} - ${a.uf}`)) ?? (await geocode(`${a.city} - ${a.uf}`));
              setBusy(null);
              if (!pt) return setMsg("Achamos o CEP, mas não o ponto no mapa. Toque no mapa para marcar.");
              update({ ...pt, district: a.district, city: a.city, uf: a.uf, street: a.street, cep: a.cep });
            }}
          >
            {busy === "cep" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </Button>
        </div>
      </div>
      <MapPicker value={place} onPick={(p) => void fromPoint(p.lat, p.lng)} />
      <p className="text-xs text-muted">{hint ?? "Toque no mapa ou arraste o marcador para acertar o ponto."}</p>
      {msg && <p className="text-sm text-danger">{msg}</p>}
      {place && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="pp-district">Bairro</Label>
            <Input id="pp-district" value={place.district} onChange={(e) => update({ ...place, district: e.target.value })} maxLength={80} />
          </div>
          <div>
            <Label htmlFor="pp-city">Município</Label>
            <Input id="pp-city" value={place.city} onChange={(e) => update({ ...place, city: e.target.value })} maxLength={80} required />
          </div>
          <div>
            <Label htmlFor="pp-uf">UF</Label>
            <Input id="pp-uf" value={place.uf} onChange={(e) => update({ ...place, uf: e.target.value.toUpperCase().slice(0, 2) })} maxLength={2} required />
          </div>
        </div>
      )}
      {withHidden && place && (
        <>
          <input type="hidden" name="lat" value={place.lat} />
          <input type="hidden" name="lng" value={place.lng} />
          <input type="hidden" name="district" value={place.district} />
          <input type="hidden" name="city" value={place.city} />
          <input type="hidden" name="uf" value={place.uf} />
        </>
      )}
    </div>
  );
}
