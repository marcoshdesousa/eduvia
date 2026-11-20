// Busca de endereço feita pelo navegador (serviços públicos e gratuitos): ViaCEP para o CEP e
// Nominatim (OpenStreetMap) para achar o ponto no mapa e o endereço da localização atual.
export type FoundAddress = { street: string; district: string; city: string; uf: string; cep: string };

const UF_BY_NAME: Record<string, string> = {
  acre: "AC", alagoas: "AL", amapa: "AP", amazonas: "AM", bahia: "BA", ceara: "CE", "distrito federal": "DF", "espirito santo": "ES", goias: "GO",
  maranhao: "MA", "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG", para: "PA", paraiba: "PB", parana: "PR", pernambuco: "PE",
  piaui: "PI", "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS", rondonia: "RO", roraima: "RR", "santa catarina": "SC",
  "sao paulo": "SP", sergipe: "SE", tocantins: "TO",
};
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export async function lookupCep(cep: string): Promise<FoundAddress | null> {
  const d = cep.replace(/\D/g, "");
  if (d.length !== 8) return null;
  const r = await fetch(`https://viacep.com.br/ws/${d}/json/`).then((x) => x.json()).catch(() => null);
  if (!r || r.erro) return null;
  return { street: r.logradouro ?? "", district: r.bairro ?? "", city: r.localidade ?? "", uf: r.uf ?? "", cep: d };
}

export async function geocode(q: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(q)}`;
  const r = (await fetch(url).then((x) => x.json()).catch(() => null)) as { lat: string; lon: string }[] | null;
  return r?.[0] ? { lat: Number(r[0].lat), lng: Number(r[0].lon) } : null;
}

export async function reverseGeocode(lat: number, lng: number): Promise<(FoundAddress & { number: string }) | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=pt-BR&lat=${lat}&lon=${lng}`;
  const r = await fetch(url).then((x) => x.json()).catch(() => null);
  const a = r?.address;
  if (!a) return null;
  const state = fold(a.state ?? "");
  return {
    street: a.road ?? a.pedestrian ?? "",
    number: a.house_number ?? "",
    district: a.suburb ?? a.neighbourhood ?? a.quarter ?? "",
    city: a.city ?? a.town ?? a.village ?? a.municipality ?? "",
    uf: UF_BY_NAME[state] ?? (a["ISO3166-2-lvl4"]?.split("-")[1] ?? ""),
    cep: (a.postcode ?? "").replace(/\D/g, ""),
  };
}
