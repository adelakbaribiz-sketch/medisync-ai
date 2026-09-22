# Limitations

Read this before evaluating, deploying, or extending this project. It exists
so nobody — including a future version of the team — mistakes this prototype
for more than it is.

## Do not use this for real clinical decisions

The interaction data, evidence summaries, and severity levels in this
application are **demo content for a portfolio prototype**. They describe
real pharmacology (see `DECISIONS.md` #2) but are not sourced from a live,
maintained, licensed clinical database, and have not been reviewed by a
pharmacist or clinician as part of this project. Do not use this tool, or
any fork of it, to make real prescribing or dispensing decisions.

## Specific gaps between this prototype and the original vision

| Original dossier claim/target | Reality in this repository |
|---|---|
| GNN model predicting unknown interactions | Not built. No model exists. |
| Fine-tuned local LLM (Llama/Qwen + QLoRA) for explanation | Not built. All interaction text is hand-curated, static content. |
| RAG pipeline over DrugBank/FDA/PubMed | Not built. Evidence entries are paraphrased summaries written for this prototype. |
| Target F1 score > 0.70 | No model was trained or evaluated. This number is not applicable to anything in this repository. |
| FHIR R4 / CDS Hooks / EHR integration | Not built. No FHIR server, no EHR sandbox connection. |
| HIPAA/GDPR compliance | Not applicable yet — no real patient data is handled. See `SECURITY.md` for what would actually be required. |
| 18-drug, 17-interaction "comprehensive" coverage | This is a small, hand-curated demo set for illustrating the product experience — not remotely comprehensive. Many real, clinically important interactions are not represented. |

## Evidence citations are not live

Every `EvidenceRef.summary` in `src/lib/mock-data.ts` was written by hand for
this prototype based on general pharmacology knowledge (e.g., FDA labeling
conventions for simvastatin + strong CYP3A4 inhibitors). None of them are
fetched from, or verified against, a live FDA/PubMed/DrugBank source at
runtime. There are no PMIDs, no DailyMed URLs, no verifiable external links
in the evidence entries, specifically to avoid presenting unverified
identifiers as if they were real citations.

## Patient-context adjustment is illustrative, not clinical

`adjustedSeverityNote()` in `src/lib/api.ts` implements three simple,
transparent rules (severe renal impairment + renally-cleared drug class;
pregnancy; severe hepatic impairment). This is meant to demonstrate *where*
and *how* a real clinical risk-scoring model would plug in — it is not a
validated risk score and should not be treated as one.

## No accounts, no server-side data, no backup

Everything lives in the current browser's `localStorage`. Clearing browser
data, using a different browser, or using "Clear all local demo data" in
Settings will permanently lose the medication list and patient profile, with
no recovery path. This is intentional for a client-only demo, not a bug.

## Automated test coverage is partial

See `TESTING.md` — pure logic functions and the demo dataset's integrity are
covered by an automated suite; UI rendering, interaction, and visual
regressions are only manually verified for this delivery, not continuously
tested.

## Language

The UI, this documentation, and the demo data are English-only. The i18n
support mentioned in the original dossier is not implemented.
