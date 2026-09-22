# Product Requirements

## Problem

Clinicians and pharmacists checking multi-drug regimens today rely on tools
that (per published comparisons) disagree with each other significantly,
rarely explain *why* two drugs interact, and rarely adjust guidance for the
specific patient in front of them (renal function, hepatic function,
pregnancy). General-purpose LLM chatbots score poorly on interaction
screening accuracy. See `docs/ORIGINAL_DOSSIER_FA.md` §2 for the competitive
gap analysis this project started from.

## Target users (personas)

- **Prescribing clinician** — needs a fast, at-a-glance severity read before
  writing a new prescription onto an existing regimen.
- **Hospital/retail pharmacist** — needs the mechanism and an actionable
  alternative, not just a severity label, to counsel the patient or contact
  the prescriber.
- **Portfolio/technical reviewer** (this deliverable's actual primary
  audience today) — needs to see a credible, working product experience and
  an honest account of what is real vs. simulated.

## Functional requirements — implemented in this prototype

| # | Requirement | Status |
|---|---|---|
| 1 | Search a drug catalog by name/generic/class with autocomplete | ✅ Implemented (demo catalog, 18 drugs) |
| 2 | Build and edit a current medication list | ✅ Implemented, persisted to browser `localStorage` |
| 3 | Detect all pairwise interactions among listed drugs | ✅ Implemented (17 curated demo interaction pairs) |
| 4 | Show severity (contraindicated/major/moderate/minor) with clear visual distinction | ✅ Implemented |
| 5 | Show mechanism, clinical effect, recommendation, and suggested alternatives per interaction | ✅ Implemented |
| 6 | Cite evidence per interaction with source type and strength | ✅ Implemented (paraphrased demo summaries, not live citations — see LIMITATIONS.md) |
| 7 | Visualize the interaction network graphically | ✅ Implemented (custom SVG graph, no external charting dependency) |
| 8 | Capture a patient profile (age, weight, eGFR, hepatic status, pregnancy, allergies) | ✅ Implemented, persisted to `localStorage` |
| 9 | Adjust/escalate guidance based on patient context | ✅ Implemented (transparent rule-based demo logic, see `src/lib/api.ts`) |
| 10 | Filter interactions by severity; browse an evidence library independent of the current list | ✅ Implemented |
| 11 | Handle empty, loading, and error states for every data-driven view | ✅ Implemented, including a demo "simulate backend error" utility |
| 12 | Responsive layout (mobile through desktop) | ✅ Implemented |
| 13 | Clear, persistent demo-data disclosure in the UI | ✅ Implemented (banner + Settings page + code comments) |

## Functional requirements — proposed, not implemented (see ROADMAP.md)

- Real RxNorm/openFDA/DrugBank API integration.
- Trained GNN interaction-prediction model.
- Fine-tuned local LLM for natural-language mechanism explanation.
- FHIR R4 patient resource ingestion and CDS Hooks integration into an EHR.
- Authentication, multi-user accounts, audit logging.
- Multi-language UI (i18n).
- Regulatory submission artifacts (FDA SaMD / EMA CE marking documentation).

## Non-functional requirements

- No real patient data is collected, stored server-side, or transmitted —
  the entire prototype runs client-side with `localStorage` only.
- The demo dataset must not be presented as a comprehensive or authoritative
  interaction database anywhere in the UI or docs.
- Every accuracy/compliance claim from the original dossier is either
  removed, or kept and explicitly labeled as a target/proposed metric, not an
  achieved result.
