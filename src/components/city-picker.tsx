"use client";
import { useEffect, useId, useState } from "react";
import { Input, Label, Select } from "@/components/ui/form";

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const cache = new Map<string, Promise<string[]>>();
function loadCities(uf: string) {
  if (!cache.has(uf)) cache.set(uf, fetch(`/api/cidades?uf=${uf}`).then((r) => (r.ok ? r.json() : [])).catch(() => []));
  return cache.get(uf)!;
}

/** Estado + município (só aceita município da lista oficial daquele estado). */
export function CityPicker({
  ufs,
  defaultUf = "",
  defaultCity = "",
  ufName = "uf",
  cityName = "cidade",
  required = true,
  compact = false,
  onChange,
}: {
  ufs: { uf: string; name: string }[];
  defaultUf?: string;
  defaultCity?: string;
  ufName?: string;
  cityName?: string;
  required?: boolean;
  compact?: boolean;
  onChange?: (v: { uf: string; city: string; valid: boolean }) => void;
}) {
  const id = useId();
  const [uf, setUf] = useState(defaultUf);
  const [city, setCity] = useState(defaultCity);
  const [cities, setCities] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    if (uf) void loadCities(uf).then((l) => live && setCities(l));
    else setCities([]);
    return () => {
      live = false;
    };
  }, [uf]);
  const match = cities.find((c) => fold(c) === fold(city)) ?? null;
  const invalid = !!city && cities.length > 0 && !match;
  useEffect(() => onChange?.({ uf, city: match ?? city, valid: !!match }), [uf, city, match]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={compact ? "grid grid-cols-[5.5rem_1fr] gap-2" : "grid gap-3 sm:grid-cols-[12rem_1fr]"}>
      <div>
        {!compact && <Label htmlFor={`${id}-uf`}>Estado</Label>}
        <Select
          id={`${id}-uf`}
          name={ufName}
          value={uf}
          required={required}
          aria-label="Estado"
          onChange={(e) => {
            setUf(e.target.value);
            setCity("");
          }}
        >
          <option value="">{compact ? "UF" : "Escolha"}</option>
          {ufs.map((u) => (
            <option key={u.uf} value={u.uf}>
              {compact ? u.uf : `${u.name} (${u.uf})`}
            </option>
          ))}
        </Select>
      </div>
      <div>
        {!compact && <Label htmlFor={`${id}-city`}>Município</Label>}
        <Input
          id={`${id}-city`}
          list={`${id}-list`}
          value={city}
          disabled={!uf}
          required={required}
          autoComplete="off"
          aria-label="Município"
          aria-invalid={invalid || undefined}
          placeholder={uf ? "Digite e escolha na lista" : "Escolha o estado primeiro"}
          onChange={(e) => {
            setCity(e.target.value);
            const ok = !e.target.value || cities.length === 0 || cities.some((c) => fold(c) === fold(e.target.value));
            e.target.setCustomValidity(ok ? "" : "Escolha um município da lista.");
          }}
        />
        {/* o valor enviado é sempre o nome oficial */}
        <input type="hidden" name={cityName} value={match ?? city} />
        <datalist id={`${id}-list`}>
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {invalid && <p className="mt-1 text-xs text-danger">Município não encontrado em {uf}. Escolha na lista.</p>}
      </div>
    </div>
  );
}
