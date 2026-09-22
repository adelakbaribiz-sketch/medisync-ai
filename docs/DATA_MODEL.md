# Data Model

All types are defined in [`src/lib/types.ts`](../src/lib/types.ts).

## `Drug`

| Field | Type | Notes |
|---|---|---|
| `rxcui` | `string` | Synthetic `DEMO-####` id in this prototype. A real build resolves actual RxNorm RxCUIs. |
| `name` | `string` | Brand/common name shown in the UI. |
| `genericName` | `string` | |
| `drugClass` | `string` | Free-text pharmacological class, used for search matching and for the patient-context adjustment rules. |
| `route` | `"oral" \| "injectable" \| "topical" \| "inhaled"` | |

## `DrugInteraction`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `drugA`, `drugB` | `string` | `rxcui` references. |
| `severity` | `"contraindicated" \| "major" \| "moderate" \| "minor"` | Four-level scale matching common clinical reference conventions. |
| `mechanism` | `string` | Pharmacological mechanism (e.g. CYP3A4 inhibition). |
| `clinicalEffect` | `string` | What actually happens to the patient. |
| `recommendation` | `string` | Actionable guidance. |
| `evidence` | `EvidenceRef[]` | See below. |
| `alternatives?` | `string[]` | Free-text alternative suggestions (not `rxcui` references in this version — kept as text since the demo dataset doesn't model a full alternatives graph). |

## `EvidenceRef`

| Field | Type | Notes |
|---|---|---|
| `sourceType` | `"FDA Label" \| "Clinical Pharmacology Reference" \| "Case Reports" \| "Pharmacokinetic Study"` | Category of evidence, not a specific citation. |
| `summary` | `string` | Paraphrased for this prototype — **not** a live-fetched excerpt. |
| `strength` | `"Established" \| "Probable" \| "Theoretical"` | Editorial judgment made when curating the demo dataset, modeled loosely on GRADE-style evidence strength tiers. |

## `PatientProfile`

| Field | Type | Notes |
|---|---|---|
| `age` | `number \| null` | |
| `weightKg` | `number \| null` | |
| `egfr` | `number \| null` | Estimated glomerular filtration rate (mL/min/1.73m²). |
| `hepaticImpairment` | `"none" \| "mild" \| "moderate" \| "severe"` | |
| `pregnant` | `boolean` | |
| `allergies` | `string[]` | Free-text; not cross-checked against the drug catalog in this version. |

## Persistence

Both the current medication list (`Drug[]`) and the `PatientProfile` are
persisted to the browser's `localStorage` under the keys
`medisync_demo_medication_list` and `medisync_demo_patient_profile`
(see `src/state/app-state.tsx`). No data is sent to, or stored on, any
server. Clearing browser storage or using "Clear all local demo data" in
Settings permanently removes it — this cannot be undone client-side, and
there is no server-side backup.

## Proposed production data model additions (not implemented)

- Real `rxcui` values resolved live against RxNorm.
- A structured `alternatives` relation (drug → drug, with its own rationale)
  instead of free text.
- Versioned evidence records with an actual source URL, publication date,
  and retrieval date, to support the "shown evidence must be traceable"
  requirement from the original dossier.
- A patient record model aligned to the FHIR `Patient` resource, for real EHR
  integration.
