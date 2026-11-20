"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { geocode, lookupCep, reverseGeocode } from "@/lib/geo-client";
import { cn } from "@/lib/utils";

const MapPicker = dynamic(() => import("@/components/map-picker").then((m) => m.MapPicker), { ssr: false, loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-surface-2" /> });

export type SavedAddress = { id: string; label: string; street: string; number: string; complement: string; district: string; city: string; uf: string; cep: string; lat: number | null; lng: number | null };
type LatLng = { lat: number; lng: number };
const EMPTY = { street: "", number: "", complement: "", district: "", city: "", uf: "", cep: "", reference: "" };

/**
 * Endereço do serviço: salvos, localização do aparelho ou CEP, mais o ponto no mapa.
 * `needPoint` exige o ponto (Contrate rápido precisa da localização). `autoLocate` já pede a localização ao abrir.
 */
export function AddressFields({ saved, ufs, needPoint = false, autoLocate = false, onPoint }: { saved: SavedAddress[]; ufs: { uf: string; name: string }[]; needPoint?: boolean; autoLocate?: boolean; onPoint?: (p: LatLng | null) => void }) {
  const [mode, setMode] = useState<"saved" | "here" | "other">(saved.length && !autoLocate ? "saved" : "here");
  const [addr, setAddr] = useState(EMPTY);
  const [point, setPointState] = useState<LatLng | null>(null);
  const [pick, setPick] = useState(saved[0]?.id ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const set = (k: keyof typeof EMPTY, v: string) => setAddr((a) => ({ ...a, [k]: v }));
  const setPoint = (p: LatLng | null) => {
    setPointState(p);
    onPoint?.(p);
  };

  const useSaved = (id: string) => {
    setPick(id);
    const a = saved.find((x) => x.id === id);
    if (!a) return;
    setAddr({ street: a.street, number: a.number, complement: a.complement, district: a.district, city: a.city, uf: a.uf, cep: a.cep, reference: "" });
    setPoint(a.lat != null && a.lng != null ? { lat: a.lat, lng: a.lng } : null);
  };

  const locate = () => {
    setMsg(null);
    if (!("geolocation" in navigator)) return setMsg("Este aparelho não informa a localização. Use “Outro endereço”.");
    setBusy("loc");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPoint(p);
        const f = await reverseGeocode(p.lat, p.lng);
        setBusy(null);
        if (!f) return setMsg("Achamos você no mapa. Preencha a rua e o número.");
        setAddr((a) => ({ ...a, street: f.street, number: f.number || a.number, district: f.district, city: f.city, uf: f.uf, cep: f.cep }));
        setMsg("Confira a rua e o número (a localização pode ter alguns metros de diferença).");
      },
      (err) => {
        setBusy(null);
        setMsg(err.code === err.PERMISSION_DENIED ? "Você não liberou a localização. Libere nas configurações do navegador ou use “Outro endereço”." : "Não foi possível pegar a localização agora. Use “Outro endereço”.");
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  };

  useEffect(() => {
    if (mode === "saved" && pick) useSaved(pick);
    else if (autoLocate && mode === "here") locate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const findCep = async () => {
    setBusy("cep");
    const r = await lookupCep(addr.cep);
    if (!r) {
      setBusy(null);
      return setMsg("CEP não encontrado. Preencha o endereço.");
    }
    setAddr((a) => ({ ...a, street: r.street || a.street, district: r.district || a.district, city: r.city, uf: r.uf }));
    const p = (await geocode(`${r.street}, ${r.city}, ${r.uf}`)) ?? (await geocode(`${r.city}, ${r.uf}`));
    setBusy(null);
    if (p) setPoint(p);
    setMsg(p ? "Confira o ponto no mapa e ajuste se precisar." : "Toque no mapa para marcar o local.");
  };

  const findOnMap = async () => {
    setBusy("map");
    const p = await geocode(`${addr.street} ${addr.number}, ${addr.district ? `${addr.district}, ` : ""}${addr.city}, ${addr.uf}`);
    setBusy(null);
    if (p) setPoint(p);
    else setMsg("Não achamos no mapa. Toque no mapa para marcar o local.");
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="lat" value={point?.lat ?? ""} />
      <input type="hidden" name="lng" value={point?.lng ?? ""} />
      <div className="grid grid-cols-3 gap-2" role="tablist">
        {(
          [
            ["saved", "Salvos", !saved.length],
            ["here", "Onde estou", false],
            ["other", "Outro endereço", false],
          ] as const
        ).map(([m, label, disabled]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            disabled={disabled}
            onClick={() => {
              setMode(m);
              setMsg(null);
              if (m === "saved" && pick) useSaved(pick);
              if (m === "here") locate();
            }}
            className={cn("rounded-lg border px-2 py-2 text-xs font-medium sm:text-sm", mode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted", disabled && "opacity-40")}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "saved" && (
        <div className="space-y-2">
          {saved.map((a) => (
            <label key={a.id} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary">
              <input type="radio" name="savedPick" checked={pick === a.id} onChange={() => useSaved(a.id)} className="mt-1 accent-[var(--primary)]" />
              <span><strong>{a.label}</strong><span className="block text-muted">{a.street}{a.number ? `, ${a.number}` : ""} — {a.city}/{a.uf}</span></span>
            </label>
          ))}
        </div>
      )}
      {mode === "here" && (
        <Button type="button" variant="secondary" onClick={locate} disabled={busy === "loc"}>
          {busy === "loc" ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />} {point ? "Atualizar minha localização" : "Usar minha localização"}
        </Button>
      )}
      {mode === "other" && (
        <div className="flex items-end gap-2">
          <div className="w-40">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" inputMode="numeric" placeholder="00000-000" value={addr.cep} onChange={(e) => set("cep", e.target.value)} />
          </div>
          <Button type="button" variant="outline" onClick={findCep} disabled={busy === "cep"}>
            {busy === "cep" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Buscar
          </Button>
        </div>
      )}
      <input type="hidden" name="cep" value={addr.cep} />

      <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
        <div>
          <Label htmlFor="street">Rua / avenida</Label>
          <Input id="street" name="street" required value={addr.street} onChange={(e) => set("street", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="number">Número</Label>
          <Input id="number" name="number" value={addr.number} onChange={(e) => set("number", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" placeholder="Apto, bloco, casa…" value={addr.complement} onChange={(e) => set("complement", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" name="district" value={addr.district} onChange={(e) => set("district", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-[6rem_1fr] gap-3">
        <div>
          <Label htmlFor="uf">UF</Label>
          <Select id="uf" name="uf" required value={addr.uf} onChange={(e) => set("uf", e.target.value)}>
            <option value="">--</option>
            {ufs.map((u) => <option key={u.uf} value={u.uf}>{u.uf}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="city">Município</Label>
          <Input id="city" name="city" required value={addr.city} onChange={(e) => set("city", e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="reference">Ponto de referência (opcional)</Label>
        <Input id="reference" name="reference" maxLength={200} placeholder="Ex.: portão verde, ao lado da padaria" value={addr.reference} onChange={(e) => set("reference", e.target.value)} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1 text-sm font-medium"><MapPin size={16} /> Local no mapa{needPoint && " (obrigatório)"}</p>
          <Button type="button" variant="ghost" size="sm" onClick={findOnMap} disabled={!addr.street || busy === "map"}>
            {busy === "map" ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Achar no mapa
          </Button>
        </div>
        <MapPicker value={point} onPick={setPoint} height={220} />
        <p className="text-xs text-muted">Toque no mapa ou arraste o marcador para acertar o ponto. O endereço só aparece para o prestador depois que ele aceitar.</p>
      </div>
      {msg && <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm">{msg}</p>}
      {mode !== "saved" && (
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <input type="checkbox" name="saveAddress" className="h-4 w-4 accent-[var(--primary)]" />
          Salvar este endereço como
          <Input name="saveLabel" placeholder="Casa" maxLength={40} className="h-8 w-32" />
        </label>
      )}
    </div>
  );
}
