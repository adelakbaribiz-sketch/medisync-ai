import { drugs, interactions } from "./mock-data";
import { Drug, DrugInteraction, PatientProfile } from "./types";

/**
 * Simulated API layer.
 * ------------------------------------------------------------------
 * These functions stand in for a real backend call. They are shaped
 * the way a real REST/FHIR endpoint response would be (async, with
 * latency and an error path) so that swapping in a real
 * `fetch("/api/...")` implementation later requires no changes to
 * calling components. See docs/ARCHITECTURE.md and docs/API_SPEC.md.
 */

const NETWORK_DELAY_MS = 450;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function searchDrugs(query: string): Promise<Drug[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay([]);
  const results = drugs.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.genericName.toLowerCase().includes(q) ||
      d.drugClass.toLowerCase().includes(q)
  );
  return delay(results, 250);
}

export interface InteractionQueryOptions {
  simulateError?: boolean;
}

export async function getInteractionsForList(
  rxcuis: string[],
  options: InteractionQueryOptions = {}
): Promise<DrugInteraction[]> {
  if (options.simulateError) {
    await delay(null, 400);
    throw new Error(
      "Interaction Engine is unreachable (simulated network failure for demo purposes)."
    );
  }
  const set = new Set(rxcuis);
  const results = interactions.filter(
    (i) => set.has(i.drugA) && set.has(i.drugB)
  );
  return delay(results);
}

const RENAL_ADJUSTED_CLASSES = [
  "Biguanide antidiabetic",
  "Cardiac glycoside",
  "Vitamin K antagonist anticoagulant",
];

/**
 * Mock patient-context adjustment: escalates severity presentation
 * when renal function is significantly reduced and the drug is
 * primarily renally cleared, or when the patient is pregnant and the
 * drug class carries a general pregnancy caution. This is a simple,
 * transparent demo rule set, NOT a validated clinical scoring model.
 */
export function adjustedSeverityNote(
  interaction: DrugInteraction,
  patient: PatientProfile,
  drugAName: string,
  drugBName: string,
  drugAClass: string,
  drugBClass: string
): string | null {
  const notes: string[] = [];

  if (
    patient.egfr !== null &&
    patient.egfr < 30 &&
    (RENAL_ADJUSTED_CLASSES.includes(drugAClass) ||
      RENAL_ADJUSTED_CLASSES.includes(drugBClass))
  ) {
    notes.push(
      `Patient eGFR ${patient.egfr} mL/min/1.73m² indicates severe renal impairment — renally cleared agents (${drugAName}/${drugBName}) warrant closer monitoring than the base severity implies.`
    );
  }

  if (patient.pregnant) {
    notes.push(
      `Patient is pregnant — reassess both agents against current pregnancy safety category guidance before treating this interaction as routine.`
    );
  }

  if (patient.hepaticImpairment === "severe") {
    notes.push(
      `Severe hepatic impairment reduces metabolic clearance for many interacting drugs — consider a lower dose or alternative agent.`
    );
  }

  return notes.length > 0 ? notes.join(" ") : null;
}
