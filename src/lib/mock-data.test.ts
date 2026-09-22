import { describe, expect, it } from "vitest";
import { drugs, interactions, interactionsForDrug } from "./mock-data";

describe("demo dataset integrity", () => {
  it("has no duplicate rxcui values", () => {
    const seen = new Set<string>();
    for (const drug of drugs) {
      expect(seen.has(drug.rxcui)).toBe(false);
      seen.add(drug.rxcui);
    }
  });

  it("has no duplicate interaction ids", () => {
    const seen = new Set<string>();
    for (const interaction of interactions) {
      expect(seen.has(interaction.id)).toBe(false);
      seen.add(interaction.id);
    }
  });

  it("references only rxcuis that exist in the drug catalog", () => {
    const validIds = new Set(drugs.map((d) => d.rxcui));
    for (const interaction of interactions) {
      expect(validIds.has(interaction.drugA)).toBe(true);
      expect(validIds.has(interaction.drugB)).toBe(true);
    }
  });

  it("never pairs a drug with itself", () => {
    for (const interaction of interactions) {
      expect(interaction.drugA).not.toBe(interaction.drugB);
    }
  });

  it("gives every interaction at least one evidence entry", () => {
    for (const interaction of interactions) {
      expect(interaction.evidence.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate drug pair listed twice (in either order)", () => {
    const seenPairs = new Set<string>();
    for (const interaction of interactions) {
      const key = [interaction.drugA, interaction.drugB].sort().join("|");
      expect(seenPairs.has(key)).toBe(false);
      seenPairs.add(key);
    }
  });
});

describe("interactionsForDrug", () => {
  it("finds interactions regardless of which side the drug is on", () => {
    const warfarinInteractions = interactionsForDrug("DEMO-0001");
    expect(warfarinInteractions.length).toBeGreaterThan(0);
    for (const interaction of warfarinInteractions) {
      expect(
        interaction.drugA === "DEMO-0001" || interaction.drugB === "DEMO-0001"
      ).toBe(true);
    }
  });

  it("returns an empty array for an unknown rxcui", () => {
    expect(interactionsForDrug("DEMO-9999")).toEqual([]);
  });
});
