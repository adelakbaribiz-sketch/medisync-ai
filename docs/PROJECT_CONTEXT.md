# Project Context

## What this is

MediSync AI is a **portfolio prototype** of an AI-assisted drug interaction and
clinical decision support workspace. It started as a technical dossier (see
[`ORIGINAL_DOSSIER_FA.md`](./ORIGINAL_DOSSIER_FA.md)) describing a full
production platform — multi-service backend, a fine-tuned local LLM, a graph
neural network for interaction prediction, FHIR/CDS Hooks integration, and
regulatory compliance workstreams for FDA/EMA/HIPAA/GDPR.

This repository implements the part of that vision that can be built,
demonstrated, and verified **honestly** without a real clinical license, a
trained model, or a hospital integration: a polished, working frontend
against a curated demo dataset, architected so a real backend can be dropped
in later without a rewrite.

## Project classification

**Hybrid: AI Product + SaaS**, with a business/regulatory narrative layer.
It is explicitly **not** treated as a completed scientific study — no model
was trained, no accuracy benchmark was run, and none of the dossier's target
metrics (e.g. "F1 > 0.70") are claimed as achieved. They are documented as
targets for a future phase. See [`LIMITATIONS.md`](./LIMITATIONS.md) and
[`HONEST_STATUS.md`](./HONEST_STATUS.md).

## Why the scope was narrowed

The original dossier's AI engine (GNN + local fine-tuned LLM + RAG over
DrugBank/FDA/PubMed) requires: a licensed DrugBank dataset, GPU infrastructure
for training and inference, a curated 10,000+ pair training set, and a formal
validation study against a clinical reference set. None of that exists yet.
Building a fake version of it (e.g. hardcoding "AI-generated" answers that are
actually static lookups) would misrepresent the project. Instead, this
prototype:

- Implements the full **product experience** — search, medication list,
  interaction analysis, patient-context adjustment, evidence citations,
  network visualization — against a small, real-pharmacology demo dataset.
- Structures the code so the mock data-access layer
  (`src/lib/api.ts`) is the single seam where a real backend would be wired
  in, without touching any UI component.
- Documents the full proposed AI/backend architecture as **PROPOSED**, not
  implemented, so a reviewer can evaluate the engineering plan on its own
  terms.

## Repository history note

This codebase was generated with AI assistance (Claude Code) working from the
original Persian-language technical dossier. The dossier is kept at
`docs/ORIGINAL_DOSSIER_FA.md` for provenance. No claim is made that the
demo dataset, evidence summaries, or UI copy originate from a live clinical
data feed — see `src/lib/mock-data.ts` for the demo-data disclaimer that ships
in the code itself.
