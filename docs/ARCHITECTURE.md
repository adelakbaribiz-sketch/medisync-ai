# Architecture

## Implemented architecture (this repository)

```
Browser
  │
  ├─ Next.js App Router (React 19, TypeScript, Tailwind CSS v4)
  │    ├─ src/app/            route pages (Dashboard, Interactions,
  │    │                       Patient Profile, Evidence Library, Settings)
  │    ├─ src/components/     presentational + interactive UI components
  │    ├─ src/state/          React Context: medication list, patient
  │    │                       profile, toast notifications
  │    └─ src/lib/
  │         ├─ mock-data.ts    demo drug catalog + interaction dataset
  │         ├─ api.ts          simulated async "backend" (latency,
  │         │                   error path, patient-context adjustment)
  │         ├─ types.ts        shared domain types
  │         └─ hooks/          data-fetching hooks (useInteractions)
  │
  └─ localStorage             medication list + patient profile persistence
                               (per-browser only; nothing leaves the client)
```

There is **no server-side data store and no network backend** in this
prototype. Every "API call" in `src/lib/api.ts` is an async function that
resolves against the static in-memory demo dataset after a simulated delay.
This is a deliberate choice (see `DECISIONS.md`), not an oversight: it lets
the full product experience — including loading and error states — be
demonstrated credibly without standing up infrastructure that would sit idle
behind a portfolio demo.

### Why this seam matters

`src/lib/api.ts` exports the same function signatures a real backend client
would (`searchDrugs(query)`, `getInteractionsForList(rxcuis, options)`). A
production build replaces the function *bodies* with real `fetch()` calls;
no calling component, hook, or page needs to change. This is the intended
migration path described in the Roadmap.

### Rendering model

All interactive pages are Client Components (`"use client"`) because the
entire app is a stateful, personalized workspace with no meaningful public,
unauthenticated, cacheable content — there is nothing here that benefits from
server rendering beyond the initial HTML shell Next.js provides by default.

### Hydration-safe local storage

`src/state/app-state.tsx` reads `localStorage` inside a `useEffect` on mount
rather than in a `useState` lazy initializer. This is intentional: the server
has no `localStorage`, so state must start empty (matching the server-rendered
HTML) and hydrate from storage only after mount, to avoid a client/server
hydration mismatch. This is documented inline in the code, since a stricter
lint rule (`react-hooks/set-state-in-effect`) would otherwise flag it as an
anti-pattern.

---

## Proposed production architecture (PROPOSED — not implemented)

This is the target architecture from the original dossier
(`ORIGINAL_DOSSIER_FA.md` §3–§6), kept here for engineering continuity. None
of it exists in this repository today.

```
┌─────────────────────────────────────────────────────────────┐
│                    MediSync AI Platform                       │
├─────────────────────────────────────────────────────────────┤
│  Web (Next.js) · Mobile (React Native) · EHR Plugin (CDS Hooks)│
│                          │                                    │
│                    API Gateway                                │
│                          │                                    │
│  ┌───────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │ Interaction    │ │ Patient Context   │ │ Evidence          │ │
│  │ Engine (GNN +  │ │ Service (FHIR)    │ │ Retrieval (RAG)   │ │
│  │ rules + LLM)   │ │                   │ │                   │ │
│  └───────────────┘ └──────────────────┘ └──────────────────┘ │
│                          │                                    │
│     Knowledge layer: RxNorm · DrugBank (licensed) · FDA/EMA   │
│     labels · PubMed literature                                │
│                          │                                    │
│  PostgreSQL + pgvector · Redis · Kafka · MinIO · Kubernetes   │
└─────────────────────────────────────────────────────────────┘
```

Key proposed components and why they are not built yet:

| Component | Requires | Status |
|---|---|---|
| RxNorm/openFDA live lookup | Public API integration work only | Straightforward next step — see ROADMAP.md |
| DrugBank integration | Paid commercial license | Blocked on budget/licensing decision |
| GNN interaction-prediction model | Licensed training data (DDInter/DrugBank), GPU training run, validation study | Not started — research-grade effort |
| Fine-tuned local LLM (Llama/Qwen + QLoRA) | Curated instruction dataset, GPU fine-tuning, hallucination-safety evaluation | Not started — research-grade effort |
| FHIR R4 / CDS Hooks integration | A real EHR sandbox or partner to integrate against | Not started — needs a design partner |
| Multi-agent orchestration (6 agents) | The above AI components to already exist and be reliable individually | Not started — depends on prior rows |

Building any of these without the underlying data/infrastructure would mean
either faking the output (misrepresenting the product) or shipping something
non-functional. Both are explicitly out of scope for this deliverable.
