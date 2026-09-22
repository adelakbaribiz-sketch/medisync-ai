import { describe, expect, it } from "vitest";
import { adjustedSeverityNote, searchDrugs, getInteractionsForList } from "./api";
import { DrugInteraction, emptyPatientProfile } from "./types";

const stubInteraction: DrugInteraction = {
  id: "test-1",
  drugA: "DEMO-0001",
  drugB: "DEMO-0002",
  severity: "major",
  mechanism: "test mechanism",
  clinicalEffect: "test effect",
  recommendation: "test recommendation",
  evidence: [],
};

describe("adjustedSeverityNote", () => {
  it("returns null when no adjustment rule fires", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      emptyPatientProfile,
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toBeNull();
  });

  it("flags severe renal impairment for a renally cleared drug class", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      { ...emptyPatientProfile, egfr: 20 },
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toContain("severe renal impairment");
  });

  it("does not flag mild renal impairment (eGFR at the boundary)", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      { ...emptyPatientProfile, egfr: 30 },
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toBeNull();
  });

  it("flags pregnancy regardless of drug class", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      { ...emptyPatientProfile, pregnant: true },
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toContain("pregnant");
  });

  it("flags severe hepatic impairment", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      { ...emptyPatientProfile, hepaticImpairment: "severe" },
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toContain("hepatic impairment");
  });

  it("combines multiple firing rules into one note", () => {
    const note = adjustedSeverityNote(
      stubInteraction,
      { ...emptyPatientProfile, egfr: 15, pregnant: true },
      "Warfarin",
      "Aspirin",
      "Vitamin K antagonist anticoagulant",
      "NSAID / antiplatelet"
    );
    expect(note).toContain("renal impairment");
    expect(note).toContain("pregnant");
  });
});

describe("searchDrugs", () => {
  it("returns an empty array for a blank query without matching everything", async () => {
    const results = await searchDrugs("   ");
    expect(results).toEqual([]);
  });

  it("matches by generic name and drug class, case-insensitively", async () => {
    const byGeneric = await searchDrugs("acetylsalicylic");
    expect(byGeneric.some((d) => d.name === "Aspirin")).toBe(true);

    const byClass = await searchDrugs("ANTICOAGULANT");
    expect(byClass.some((d) => d.name === "Warfarin")).toBe(true);
  });
});

describe("getInteractionsForList", () => {
  it("only returns interactions where both drugs are in the given list", async () => {
    const results = await getInteractionsForList(["DEMO-0001", "DEMO-0002"]);
    expect(results.length).toBeGreaterThan(0);
    for (const interaction of results) {
      expect(["DEMO-0001", "DEMO-0002"]).toContain(interaction.drugA);
      expect(["DEMO-0001", "DEMO-0002"]).toContain(interaction.drugB);
    }
  });

  it("rejects when simulateError is set", async () => {
    await expect(
      getInteractionsForList(["DEMO-0001", "DEMO-0002"], { simulateError: true })
    ).rejects.toThrow();
  });
});
