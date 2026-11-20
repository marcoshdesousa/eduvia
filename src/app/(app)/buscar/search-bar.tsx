"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LocateFixed, Search } from "lucide-react";
import { CityPicker } from "@/components/city-picker";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { CATEGORIES, CATEGORY_GROUPS } from "@/lib/domain";
import { cn } from "@/lib/utils";

export function SearchBar({ ufs, initial }: { ufs: { uf: string; name: string }[]; initial: { servico: string; uf: string; cidade: string; max: string; lat: string; lng: string } }) {
  const router = useRouter();
  const [servico, setServico] = useState(initial.servico);
  const [where, setWhere] = useState<"near" | "city">(initial.lat || !initial.cidade ? "near" : "city");
  const [place, setPlace] = useState({ uf: initial.uf, city: initial.cidade });
  const [max, setMax] = useState(initial.max);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const go = (extra: Record<string, string>) => {
    const q = new URLSearchParams({ servico, ...(max ? { max } : {}), ...extra });
    router.push(`/buscar?${q}`);
  };

  const submit = () => {
    setMsg(null);
    if (!servico) return setMsg("Escolha o serviço.");
    if (where === "city") {
      if (!place.uf || !place.city) return setMsg("Escolha o estado e o município.");
      return go({ uf: place.uf, cidade: place.city });
    }
    if (initial.lat && initial.lng) return go({ lat: initial.lat, lng: initial.lng });
    if (!navigator.geolocation) return setMsg("Este aparelho não informa a localização. Busque pela cidade.");
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setBusy(false);
        go({ lat: p.coords.latitude.toFixed(4), lng: p.coords.longitude.toFixed(4) });
      },
      () => {
        setBusy(false);
        setWhere("city");
        setMsg("Não conseguimos a sua localização. Busque pela cidade.");
      },
      { timeout: 15000, maximumAge: 300_000 },
    );
  };

  return (
    <form
      className="space-y-3 rounded-2xl border border-border bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <Label htmlFor="servico">Serviço</Label>
        <Select id="servico" value={servico} onChange={(e) => setServico(e.target.value)} required>
          <option value="">Escolha…</option>
          {CATEGORY_GROUPS.map((g) => (
            <optgroup key={g} label={g}>
              {CATEGORIES.filter((c) => c.group === g).map((c) => <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>)}
            </optgroup>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-sm font-medium">
        {(["near", "city"] as const).map((w) => (
          <button key={w} type="button" onClick={() => setWhere(w)} className={cn("flex items-center justify-center gap-1 rounded-lg py-2", where === w ? "bg-surface shadow-sm" : "text-muted")}>
            {w === "near" ? <><LocateFixed size={14} /> Perto de mim</> : "Por cidade"}
          </button>
        ))}
      </div>
      {where === "city" && <CityPicker ufs={ufs} defaultUf={place.uf} defaultCity={place.city} compact onChange={(v) => setPlace({ uf: v.uf, city: v.city })} required={false} />}
      <div>
        <Label htmlFor="max">Pago até (R$, opcional)</Label>
        <Input id="max" inputMode="decimal" placeholder="Ex.: 150" value={max} onChange={(e) => setMax(e.target.value)} />
      </div>
      {msg && <p className="text-sm text-danger">{msg}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Buscar
      </Button>
    </form>
  );
}
