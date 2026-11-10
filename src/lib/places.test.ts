import { describe, expect, it } from "vitest";
import { UFS, citiesOf, localParts, localToUtc, officialCity } from "./places";

describe("municípios e horário", () => {
  it("27 estados e a lista de municípios", () => {
    expect(UFS).toHaveLength(27);
    expect(citiesOf("SP").length).toBeGreaterThan(600);
    expect(officialCity("PA", "belem")).toBe("Belém");
    expect(officialCity("PA", "Cidade Que Não Existe")).toBeNull();
  });
  it("horário da limpeza é o do estado", () => {
    expect(localToUtc("2026-12-01", "08:00", "SP")!.toISOString()).toBe("2026-12-01T11:00:00.000Z");
    expect(localToUtc("2026-12-01", "08:00", "AM")!.toISOString()).toBe("2026-12-01T12:00:00.000Z");
    expect(localToUtc("2026-12-01", "08:00", "AC")!.toISOString()).toBe("2026-12-01T13:00:00.000Z");
    expect(localParts(new Date("2026-12-01T11:00:00Z"), "SP")).toEqual({ weekday: 2, minutes: 480 });
  });
});
