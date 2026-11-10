"use client";
import { useActionState, useMemo, useState } from "react";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import { MapPicker, type LatLng } from "@/components/map-picker";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { HOME_SIZES, MAX_HOURS, MIN_HOURS, formatBRL } from "@/lib/domain";
import { geocode, lookupCep, reverseGeocode } from "@/lib/geo-client";
import { cn } from "@/lib/utils";
import { createBookingAction } from "./actions";

type Addr = { id: string; label: string; street: string; number: string; complement: string; district: string; city: string; uf: string; cep: string; lat: number | null; lng: number | null };
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function RequestForm(props: {
  proId: string;
  hourlyCents: number;
  services: { slug: string; label: string }[];
  areas: { uf: string; city: string }[];
  defaultArea: { uf: string; city: string };
  agenda: string[];
  addresses: Addr[];
  ufs: { uf: string; name: string }[];
}) {
  const [state, run] = useActionState(createBookingAction, null);
  const [hours, setHours] = useState(4);
  const [mode, setMode] = useState<"saved" | "here" | "other">(props.addresses.length ? "saved" : "other");
  const first = props.addresses[0];
  const firstArea = first && props.areas.find((a) => a.uf === first.uf && fold(a.city) === fold(first.city));
  const [addr, setAddr] = useState(
    first && firstArea
      ? { street: first.street, number: first.number, complement: first.complement, district: first.district, cep: first.cep, reference: "", area: `${firstArea.uf}|${firstArea.city}` }
      : { street: "", number: "", complement: "", district: "", cep: "", reference: "", area: `${props.defaultArea.uf}|${props.defaultArea.city}` },
  );
  const [point, setPoint] = useState<LatLng | null>(first && firstArea && first.lat != null && first.lng != null ? { lat: first.lat, lng: first.lng } : null);
  const [busy, setBusy] = useState<string | null>(null);
  const [geoMsg, setGeoMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState<string>(props.addresses[0]?.id ?? "");
  const [uf, city] = addr.area.split("|");
  const estimate = useMemo(() => props.hourlyCents * hours, [props.hourlyCents, hours]);
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

  const set = (k: keyof typeof addr, v: string) => setAddr((a) => ({ ...a, [k]: v }));
  const matchArea = (c: string, u: string) => props.areas.find((a) => a.uf === u && fold(a.city) === fold(c));

  const pickSaved = (id: string) => {
    setSaved(id);
    const a = props.addresses.find((x) => x.id === id);
    if (!a) return;
    const area = matchArea(a.city, a.uf);
    setAddr({ street: a.street, number: a.number, complement: a.complement, district: a.district, cep: a.cep, reference: "", area: area ? `${area.uf}|${area.city}` : addr.area });
    setPoint(a.lat != null && a.lng != null ? { lat: a.lat, lng: a.lng } : null);
    setGeoMsg(area ? null : `Este endereço fica em ${a.city}/${a.uf}, onde este profissional não atende.`);
  };

  const locate = () => {
    setGeoMsg(null);
    if (!("geolocation" in navigator)) return setGeoMsg("Este aparelho não permite pegar a localização. Use “Outro endereço”.");
    setBusy("loc");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPoint(p);
        const found = await reverseGeocode(p.lat, p.lng);
        setBusy(null);
        if (!found) return setGeoMsg("Achamos o ponto no mapa. Preencha a rua e o número abaixo.");
        const area = matchArea(found.city, found.uf);
        setAddr((a) => ({ ...a, street: found.street, number: found.number || a.number, district: found.district, cep: found.cep, area: area ? `${area.uf}|${area.city}` : a.area }));
        setGeoMsg(area ? "Confira a rua e o número (a localização pode ter alguns metros de diferença)." : `Sua localização parece ser em ${found.city}/${found.uf}, onde este profissional não atende.`);
      },
      (err) => {
        setBusy(null);
        setGeoMsg(err.code === err.PERMISSION_DENIED ? "Você não autorizou a localização. Tudo bem: use “Outro endereço”." : "Não foi possível pegar a localização agora. Use “Outro endereço”.");
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  };

  const findCep = async () => {
    setBusy("cep");
    const r = await lookupCep(addr.cep);
    setBusy(null);
    if (!r) return setGeoMsg("CEP não encontrado. Preencha o endereço à mão.");
    const area = matchArea(r.city, r.uf);
    setAddr((a) => ({ ...a, street: r.street || a.street, district: r.district || a.district, area: area ? `${area.uf}|${area.city}` : a.area }));
    setGeoMsg(area ? null : `Este CEP é de ${r.city}/${r.uf}, onde este profissional não atende.`);
    const p = await geocode(`${r.street}, ${r.city}, ${r.uf}`);
    if (p) setPoint(p);
  };

  const findOnMap = async () => {
    setBusy("map");
    const p = await geocode(`${addr.street} ${addr.number}, ${addr.district ? `${addr.district}, ` : ""}${city}, ${uf}`);
    setBusy(null);
    if (p) setPoint(p);
    else setGeoMsg("Não achamos no mapa. Toque no mapa para marcar o local.");
  };

  return (
    <form action={run} className="space-y-4">
      <input type="hidden" name="proId" value={props.proId} />
      <input type="hidden" name="lat" value={point?.lat ?? ""} />
      <input type="hidden" name="lng" value={point?.lng ?? ""} />
      <input type="hidden" name="tz" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

      <Card className="space-y-3">
        <CardTitle>1. Serviços</CardTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          {props.services.map((s, i) => (
            <label key={s.slug} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="checkbox" name="services" value={s.slug} defaultChecked={i === 0} className="h-4 w-4 accent-[var(--primary)]" />
              {s.label}
            </label>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="homeSize">Tamanho aproximado (opcional)</Label>
            <Select id="homeSize" name="homeSize" defaultValue="">
              <option value="">Não sei / prefiro não dizer</option>
              {HOME_SIZES.map((h) => <option key={h}>{h}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="rooms">Quantidade de cômodos (opcional)</Label>
            <Input id="rooms" name="rooms" type="number" min={1} max={40} inputMode="numeric" />
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <CardTitle>2. Data, horário e horas</CardTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" type="date" min={minDate} required />
          </div>
          <div>
            <Label htmlFor="time">Horário de início</Label>
            <Input id="time" name="time" type="time" step={1800} required defaultValue="08:00" />
          </div>
          <div>
            <Label htmlFor="hours">Quantidade de horas</Label>
            <Select id="hours" name="hours" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {Array.from({ length: MAX_HOURS - MIN_HOURS + 1 }, (_, i) => i + MIN_HOURS).map((h) => <option key={h} value={h}>{h} {h === 1 ? "hora" : "horas"}</option>)}
            </Select>
          </div>
        </div>
        {props.agenda.length > 0 && <p className="text-xs text-muted">Atende: {props.agenda.join(" · ")}</p>}
      </Card>

      <Card className="space-y-3">
        <CardTitle>3. Endereço da limpeza</CardTitle>
        <p className="text-xs text-muted">O endereço só é mostrado ao profissional depois que ele aceitar.</p>
        <div className="grid grid-cols-3 gap-2" role="tablist">
          {(
            [
              ["saved", "Salvos", !props.addresses.length],
              ["here", "Minha localização", false],
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
                setGeoMsg(null);
                if (m === "saved" && saved) pickSaved(saved);
              }}
              className={cn("rounded-lg border px-2 py-2 text-xs font-medium sm:text-sm", mode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted", disabled && "opacity-40")}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "saved" && (
          <div className="space-y-2">
            {props.addresses.map((a) => (
              <label key={a.id} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary">
                <input type="radio" name="savedPick" checked={saved === a.id} onChange={() => pickSaved(a.id)} className="mt-1 accent-[var(--primary)]" />
                <span><strong>{a.label}</strong><span className="block text-muted">{a.street}{a.number ? `, ${a.number}` : ""} — {a.city}/{a.uf}</span></span>
              </label>
            ))}
          </div>
        )}

        {mode === "here" && (
          <Button type="button" variant="secondary" onClick={locate} disabled={busy === "loc"}>
            {busy === "loc" ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />} Usar minha localização atual
          </Button>
        )}

        {mode === "other" && (
          <div className="flex items-end gap-2">
            <div className="w-40">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="cep" inputMode="numeric" placeholder="00000-000" value={addr.cep} onChange={(e) => set("cep", e.target.value)} />
            </div>
            <Button type="button" variant="outline" onClick={findCep} disabled={busy === "cep"}>
              {busy === "cep" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Buscar CEP
            </Button>
          </div>
        )}
        {mode !== "other" && <input type="hidden" name="cep" value={addr.cep} />}

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
        <div>
          <Label htmlFor="area">Município</Label>
          <Select id="area" value={addr.area} onChange={(e) => set("area", e.target.value)}>
            {props.areas.map((a) => <option key={`${a.uf}|${a.city}`} value={`${a.uf}|${a.city}`}>{a.city}/{a.uf}</option>)}
          </Select>
          <input type="hidden" name="uf" value={uf} />
          <input type="hidden" name="city" value={city} />
          <p className="mt-1 text-xs text-muted">Só aparecem os municípios onde este profissional atende.</p>
        </div>
        <div>
          <Label htmlFor="reference">Ponto de referência (opcional)</Label>
          <Input id="reference" name="reference" maxLength={200} placeholder="Ex.: portão verde, ao lado da padaria" value={addr.reference} onChange={(e) => set("reference", e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-sm font-medium"><MapPin size={16} /> Local no mapa</p>
            <Button type="button" variant="ghost" size="sm" onClick={findOnMap} disabled={!addr.street || busy === "map"}>
              {busy === "map" ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Achar no mapa
            </Button>
          </div>
          <MapPicker value={point} onPick={setPoint} />
          <p className="text-xs text-muted">Toque no mapa ou arraste o marcador para ajustar o ponto exato (opcional).</p>
        </div>
        {geoMsg && <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm">{geoMsg}</p>}
        {mode !== "saved" && (
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <input type="checkbox" name="saveAddress" className="h-4 w-4 accent-[var(--primary)]" />
            Salvar este endereço como
            <Input name="saveLabel" placeholder="Casa" maxLength={40} className="h-8 w-32" />
          </label>
        )}
      </Card>

      <Card className="space-y-3">
        <CardTitle>4. Observações</CardTitle>
        <Textarea name="notes" maxLength={1000} placeholder="Ex.: tenho um cachorro dócil; os produtos de limpeza ficam na área de serviço." />
        <fieldset className="flex flex-wrap items-center gap-4 text-sm">
          <legend className="mb-1 w-full text-sm font-medium">Como pretende pagar ao profissional (opcional)</legend>
          <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="PIX" className="accent-[var(--primary)]" /> Pix</label>
          <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="CASH" className="accent-[var(--primary)]" /> Dinheiro</label>
        </fieldset>
      </Card>

      <Card className="space-y-2 border-primary/40 bg-primary/5">
        <p className="text-sm text-muted">Valor estimado</p>
        <p className="text-3xl font-extrabold text-brand-ink">{formatBRL(estimate)}</p>
        <p className="text-sm text-muted">{formatBRL(props.hourlyCents)} por hora × {hours} {hours === 1 ? "hora" : "horas"}. Você paga direto ao profissional, em dinheiro ou Pix. A HoraLimp não cobra nada de você.</p>
        <p className="text-xs text-muted">Serviços extras e condições diferentes devem ser combinados no chat antes do serviço.</p>
      </Card>

      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Enviando…">Enviar solicitação</SubmitButton>
    </form>
  );
}
