# API Spec

## Current state: no network API

This prototype has **no HTTP API, no server routes, and no database**. All
functions below live in `src/lib/api.ts` and run entirely in the browser
against the static dataset in `src/lib/mock-data.ts`. They are documented
here in request/response form because that is the contract a real backend
would need to satisfy to be a drop-in replacement.

## `searchDrugs(query: string): Promise<Drug[]>`

Simulated equivalent of a real endpoint like:

```
GET /api/v1/drugs/search?q={query}
```

**Response shape** (`Drug[]`):
```ts
{
  rxcui: string;        // "DEMO-0001" today; a real RxNorm RxCUI in production
  name: string;
  genericName: string;
  drugClass: string;
  route: "oral" | "injectable" | "topical" | "inhaled";
}[]
```

A production implementation would call the public **RxNorm API**
(`https://rxnav.nlm.nih.gov/REST`) for name normalization and RxCUI
resolution — see `docs/ROADMAP.md` Phase 1.

## `getInteractionsForList(rxcuis: string[], options?): Promise<DrugInteraction[]>`

Simulated equivalent of:

```
POST /api/v1/interactions/check
Body: { rxcuis: string[] }
```

**Response shape** (`DrugInteraction[]`):
```ts
{
  id: string;
  drugA: string;              // rxcui
  drugB: string;              // rxcui
  severity: "contraindicated" | "major" | "moderate" | "minor";
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  evidence: {
    sourceType: "FDA Label" | "Clinical Pharmacology Reference" | "Case Reports" | "Pharmacokinetic Study";
    summary: string;
    strength: "Established" | "Probable" | "Theoretical";
  }[];
  alternatives?: string[];
}[]
```

`options.simulateError` (demo-only) forces the promise to reject, to exercise
the UI's error state deliberately.

A production implementation would replace the in-memory filter with calls
into whatever combination of a rules database, GNN inference service, and RAG
pipeline the `ARCHITECTURE.md` "Proposed production architecture" section
describes — the response shape above is designed to be satisfiable by that
architecture without a UI change.

## `adjustedSeverityNote(...): string | null`

Pure function, not async — no network equivalent needed. Takes an
interaction, a `PatientProfile`, and the two drugs' names/classes, and
returns a human-readable note when a simple, transparent rule fires (severe
renal impairment + renally-cleared drug class; pregnancy; severe hepatic
impairment). This is explicitly **not** a validated clinical risk score — see
`LIMITATIONS.md`.

## Error semantics

Every function above rejects (throws) rather than returning a partial or
sentinel error value, so calling code always has one `try/catch` or
`.catch()` path to handle, matching how a real `fetch()`-based client would
behave.
