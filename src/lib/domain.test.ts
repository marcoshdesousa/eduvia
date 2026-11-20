import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  MAX_PACKS,
  PLANS,
  ageOn,
  containsPhone,
  distanceKm,
  estimateCents,
  formatBRL,
  monthlyCents,
  normalizeInstagram,
  parseBRL,
  parseDateOnly,
  placesLimit,
  providerVisible,
  quickEligible,
  rankProviders,
  rankQuick,
  acceptRate,
  acceptTier,
  quickPrice,
  transitionRule,
  upgradeCents,
  referralPct,
  discountedCents,
} from "./domain";

const brl = (c: number) => formatBRL(c).replace(/\s/g, " ");

describe("planos do prestador", () => {
  it("Completo R$ 15,85 = R$ 10,00 + R$ 5,85; Básico R$ 6,85 = R$ 3,00 + R$ 3,85", () => {
    expect(brl(PLANS.FULL.priceCents)).toBe("R$ 15,85");
    expect(PLANS.FULL.platformCents + PLANS.FULL.feesCents).toBe(1585);
    expect(PLANS.FULL.platformCents).toBe(1000);
    expect(brl(PLANS.BASIC.priceCents)).toBe("R$ 6,85");
    expect(PLANS.BASIC.platformCents + PLANS.BASIC.feesCents).toBe(685);
    expect(PLANS.BASIC.platformCents).toBe(300);
  });
  it("endereços: Básico 1, Completo 3, cada pacote de R$ 3,85 dá mais 2, no máximo 11", () => {
    expect(placesLimit("BASIC", 0)).toBe(1);
    expect(placesLimit("BASIC", 3)).toBe(1); // Básico não tem pacote
    expect(placesLimit("FULL", 0)).toBe(3);
    expect(placesLimit("FULL", 1)).toBe(5);
    expect(MAX_PACKS).toBe(4);
    expect(placesLimit("FULL", 4)).toBe(11);
    expect(placesLimit("FULL", 9)).toBe(11);
  });
  it("valor do mês soma os pacotes", () => {
    expect(monthlyCents("FULL", 0)).toBe(1585);
    expect(monthlyCents("FULL", 1)).toBe(1970);
    expect(monthlyCents("FULL", 4)).toBe(1585 + 4 * 385);
    expect(monthlyCents("BASIC", 2)).toBe(685);
  });
  it("subir para o Completo paga o Completo inteiro, sem desconto", () => {
    expect(upgradeCents()).toBe(1585);
  });
  it("indicação: 0,5% por pessoa até 30%; Básico nunca abaixo de R$ 4,85", () => {
    expect(referralPct(10)).toBe(5);
    expect(referralPct(100)).toBe(30);
    expect(discountedCents(1585, "FULL", 10)).toBe(1506);
    expect(discountedCents(1585, "FULL", 999)).toBe(1110);
    expect(discountedCents(685, "BASIC", 999)).toBe(485);
    expect(discountedCents(685, "BASIC", 0)).toBe(685);
  });
});

describe("prestador visível e Contrate rápido", () => {
  const future = new Date(Date.now() + 86_400_000);
  const base = { status: "ACTIVE" as const, paused: false, subscriptionEnd: future, services: 1, places: 1 };
  it("aparece com plano em dia, foto, serviço e endereço", () => {
    expect(providerVisible(base)).toBe(true);
    expect(providerVisible({ ...base, subscriptionEnd: new Date(Date.now() - 1) })).toBe(false);
    expect(providerVisible({ ...base, services: 0 })).toBe(false);
    expect(providerVisible({ ...base, places: 0 })).toBe(false);
    expect(providerVisible({ ...base, status: "SUSPENDED" })).toBe(false);
  });
  it("Contrate rápido: precisa estar Disponível e sem penalidade", () => {
    expect(quickEligible({ ...base, quickOn: true, quickBannedUntil: null })).toBe(true);
    expect(quickEligible({ ...base, quickOn: false, quickBannedUntil: null })).toBe(false);
    expect(quickEligible({ ...base, quickOn: true, quickBannedUntil: future })).toBe(false);
  });
  it("vitrine: Completo primeiro, depois quem cabe no valor, depois o mais perto", () => {
    const list = [
      { id: "basico-perto", plan: "BASIC" as const, distanceKm: 0.5, priceCents: 10000 },
      { id: "completo-longe", plan: "FULL" as const, distanceKm: 8, priceCents: 12000 },
      { id: "completo-perto-caro", plan: "FULL" as const, distanceKm: 1, priceCents: 30000 },
      { id: "completo-perto", plan: "FULL" as const, distanceKm: 2, priceCents: 15000 },
    ];
    expect(rankProviders(list, 20000).map((p) => p.id)).toEqual(["completo-perto", "completo-longe", "completo-perto-caro", "basico-perto"]);
  });
  it("Contrate rápido: quem aceita mais toca primeiro; quem recusa muito fica por último", () => {
    const list = [
      { id: "longe-bom", distanceKm: 12, acceptRate: 0.95 },
      { id: "perto-recusa", distanceKm: 0.5, acceptRate: 0.2 },
      { id: "perto-novo", distanceKm: 1.8, acceptRate: null },
      { id: "perto-otimo", distanceKm: 1.9, acceptRate: 1 },
      { id: "perto-medio", distanceKm: 1, acceptRate: 0.5 },
    ];
    expect(rankQuick(list).map((p) => p.id)).toEqual(["perto-novo", "perto-otimo", "longe-bom", "perto-medio", "perto-recusa"]);
  });
  it("taxa de aceite só vale depois de alguns chamados", () => {
    expect(acceptRate({ accepted: 1, missed: 2 })).toBeNull();
    expect(acceptRate({ accepted: 3, missed: 7 })).toBe(0.3);
    expect(acceptTier(0.3)).toBe(2);
    expect(acceptTier(0.75)).toBe(0);
  });
  it("Contrate rápido tem preço fixo por profissão (o admin pode trocar)", () => {
    expect(quickPrice("pedreiro")).toBe(18000);
    expect(quickPrice("pedreiro", { pedreiro: 17000 })).toBe(17000);
    expect(quickPrice("nada")).toBeNull();
    for (const c of CATEGORIES) expect(c.quick).toBeGreaterThan(0);
  });
  it("distância em km", () => {
    // Parauapebas → Marabá ~ 125 km em linha reta
    const d = distanceKm({ lat: -6.0675, lng: -49.9022 }, { lat: -5.3686, lng: -49.1178 });
    expect(d).toBeGreaterThan(110);
    expect(d).toBeLessThan(130);
  });
});

describe("proibido telefone / WhatsApp", () => {
  it("bloqueia telefone em vários formatos", () => {
    for (const t of ["me chama 94 99123-4567", "(94) 99123 4567", "+55 94 991234567", "991234567", "9 9123-4567", "chama no zap", "manda no WhatsApp", "nove nove um dois tres quatro cinco seis sete"]) expect(containsPhone(t), t).toBe(true);
  });
  it("libera endereço, CEP, valores e datas", () => {
    for (const t of ["Rua 10, número 550, CEP 68515-000", "Cobro R$ 150,00 a diária", "Chego às 14:30 do dia 21/11/2026", "Apto 1203, bloco 4", "Faço 8 horas por dia"]) expect(containsPhone(t), t).toBe(false);
  });
  it("Instagram", () => {
    expect(normalizeInstagram("@Joao.Pintor")).toBe("joao.pintor");
    expect(normalizeInstagram("https://instagram.com/joao_pintor/")).toBe("joao_pintor");
    expect(normalizeInstagram("joão pintor")).toBeNull();
  });
});

describe("serviços e contratação", () => {
  it("tem as categorias pedidas", () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    for (const s of ["diarista", "pedreiro", "cuidador-idoso", "baba", "compras", "pintor", "encanador", "eletricista"]) expect(slugs).toContain(s);
  });
  it("valor estimado = preço × quantidade", () => {
    expect(estimateCents(12000, 3, "DIARIA")).toBe(36000);
    expect(() => estimateCents(12000, 13, "HORA")).toThrow();
    expect(parseBRL("R$ 1.200,50")).toBe(120050);
  });
  it("Contrate rápido: só prestador aceita; não chegou em 2 h vira 'não chegou'", () => {
    expect(transitionRule("SEARCHING", "ACCEPTED", "PRO", "QUICK")).toBeTruthy();
    expect(transitionRule("SEARCHING", "ACCEPTED", "CLIENT", "QUICK")).toBeNull();
    expect(transitionRule("WAITING_PRO", "ACCEPTED", "PRO", "QUICK")).toBeNull();
    expect(transitionRule("ACCEPTED", "NO_SHOW_PRO", "SYSTEM", "QUICK")).toBeTruthy();
    expect(transitionRule("ARRIVED", "NO_SHOW_CLIENT", "PRO", "QUICK")).toBeTruthy();
    expect(transitionRule("ARRIVED", "NO_SHOW_CLIENT", "PRO", "NORMAL")).toBeNull();
  });
  it("idade mínima de 18", () => {
    const b = parseDateOnly("2008-11-21")!;
    expect(ageOn(b, new Date(Date.UTC(2026, 10, 20)))).toBe(17);
    expect(ageOn(b, new Date(Date.UTC(2026, 10, 21)))).toBe(18);
  });
});

describe("hora, diárias e redes", () => {
  it("hora sai mais cara que a diária ÷ 8", async () => {
    const { hourFromDaily, quickHourPrice, quickUnitPrice, MAX_QTY } = await import("./domain");
    expect(hourFromDaily(8000)).toBe(1500);
    expect(hourFromDaily(15000)).toBe(2900);
    expect(MAX_QTY.HORA).toBe(8);
    expect(MAX_QTY.DIARIA).toBe(30);
    expect(quickHourPrice("diarista", { diarista: 8000 })).toBe(1500);
    expect(quickHourPrice("diarista", {}, { diarista: 2000 })).toBe(2000);
    expect(quickUnitPrice("diarista", "HORA", { diarista: 8000 })).toBe(1500);
    expect(quickUnitPrice("diarista", "DIARIA", { diarista: 8000 })).toBe(8000);
  });
  it("normaliza WhatsApp, TikTok e YouTube", async () => {
    const { normalizeWhatsapp, normalizeTiktok, normalizeYoutube, whatsappLink, youtubeLink } = await import("./domain");
    expect(normalizeWhatsapp("(91) 98888-7777")).toBe("5591988887777");
    expect(normalizeWhatsapp("+55 91 98888-7777")).toBe("5591988887777");
    expect(normalizeWhatsapp("1234")).toBeNull();
    expect(whatsappLink("5591988887777")).toBe("https://wa.me/5591988887777");
    expect(normalizeTiktok("@Maria.Diarista")).toBe("maria.diarista");
    expect(normalizeTiktok("https://www.tiktok.com/@maria.diarista?lang=pt")).toBe("maria.diarista");
    expect(normalizeYoutube("@canaldamaria")).toBe("@canaldamaria");
    expect(youtubeLink("@canaldamaria")).toBe("https://www.youtube.com/@canaldamaria");
    expect(normalizeYoutube("https://youtube.com/watch?v=abc")).toMatch(/^https:\/\/youtube\.com/);
    expect(normalizeYoutube("https://evil.com/x")).toBeNull();
  });
});

describe("profissões do Contrate rápido", () => {
  it("só as combinadas entram no rápido e motorista saiu", async () => {
    const { QUICK_SLUGS, isQuickCategory, quickPrice, quickHourPrice, category } = await import("./domain");
    expect(QUICK_SLUGS).toHaveLength(19);
    for (const s of QUICK_SLUGS) expect(category(s), s).not.toBeNull();
    for (const s of ["diarista", "pedreiro", "compras", "manicure", "garcom", "seguranca", "mecanico", "enfermagem"]) expect(isQuickCategory(s), s).toBe(true);
    for (const s of ["vidraceiro", "serralheiro", "frete", "cozinheira", "pintor", "azulejista", "ar-condicionado"]) {
      expect(isQuickCategory(s), s).toBe(false);
      expect(quickPrice(s), s).toBeNull();
      expect(quickHourPrice(s), s).toBeNull();
    }
    expect(category("motorista")).toBeNull();
    expect(quickPrice("compras")).toBe(4000);
  });
});
