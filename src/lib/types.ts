export type SeverityLevel = "contraindicated" | "major" | "moderate" | "minor";

export interface Drug {
  rxcui: string;
  name: string;
  genericName: string;
  drugClass: string;
  route: "oral" | "injectable" | "topical" | "inhaled";
}

export interface EvidenceRef {
  sourceType:
    | "FDA Label"
    | "Clinical Pharmacology Reference"
    | "Case Reports"
    | "Pharmacokinetic Study";
  summary: string;
  strength: "Established" | "Probable" | "Theoretical";
}

export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: SeverityLevel;
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  evidence: EvidenceRef[];
  alternatives?: string[];
}

export type HepaticImpairment = "none" | "mild" | "moderate" | "severe";

export interface PatientProfile {
  age: number | null;
  weightKg: number | null;
  egfr: number | null;
  hepaticImpairment: HepaticImpairment;
  pregnant: boolean;
  allergies: string[];
}

export interface EscalationNote {
  interactionId: string;
  reason: string;
}

export const emptyPatientProfile: PatientProfile = {
  age: null,
  weightKg: null,
  egfr: null,
  hepaticImpairment: "none",
  pregnant: false,
  allergies: [],
};
