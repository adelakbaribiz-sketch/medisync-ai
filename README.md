# MediSync AI

An AI-assisted drug interaction and clinical decision support workspace —
**portfolio prototype, demo data only.**

> **Read this first:** this is a working frontend prototype against a
> curated, pharmacologically-accurate demo dataset. It is **not** connected
> to a real drug database, does **not** run any trained AI model, and must
> **not** be used for real clinical decisions. See
> [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) and
> [`docs/HONEST_STATUS.md`](docs/HONEST_STATUS.md) for the full, explicit
> breakdown of what's real vs. simulated vs. proposed.

## Problem

Clinicians and pharmacists checking multi-drug regimens today rely on tools
that, per published comparisons, disagree with each other significantly,
rarely explain *why* two drugs interact, and rarely adjust for the specific
patient in front of them. General-purpose LLM chatbots score poorly at
interaction screening specifically. Full analysis:
[`docs/ORIGINAL_DOSSIER_FA.md`](docs/ORIGINAL_DOSSIER_FA.md) §2.

## Solution

A workspace where you build a medication list and immediately see every
pairwise interaction — severity, mechanism, clinical effect, recommendation,
suggested alternatives, and cited evidence — visualized as a network graph
and adjusted for the patient's renal function, hepatic function, and
pregnancy status. Built so the current mock data layer can be replaced by a
real backend (RxNorm/openFDA/DrugBank, then a trained model) without
touching the UI. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Features

- Drug search/autocomplete across an 18-drug demo catalog
- Medication list builder, persisted per-browser
- Full pairwise interaction analysis with severity filters and expandable
  detail (mechanism, clinical effect, recommendation, alternatives, evidence)
- Custom SVG interaction network graph (no charting library dependency)
- Patient profile (age, weight, eGFR, hepatic impairment, pregnancy,
  allergies) that visibly adjusts interaction guidance
- Standalone, filterable Evidence Library
- Every empty/loading/error state designed and reachable, including a
  one-click "simulate a backend failure" demo utility
- Fully responsive, from 375px mobile up

## Screenshots

No static screenshots are checked into this repo (they'd go stale). Run it
locally — see **Demo** below — it takes under a minute.

## Architecture

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. No
backend, no database — the entire app runs client-side against a static
demo dataset with a simulated async data layer (real latency, real error
paths). Full diagram and the proposed production architecture (GNN + RAG +
local LLM + FHIR/CDS Hooks) in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, hand-designed clinical color system |
| State | React Context + `localStorage` |
| Testing | Vitest (21 unit tests) |
| Icons / graphs | Hand-built inline SVG (no external dependency) |

## Demo

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No login, no environment variables, no
database required. Full guided walkthrough: [`docs/DEMO.md`](docs/DEMO.md).

## Installation

```bash
git clone <this-repo>
cd medisync-ai
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # run the unit test suite
npm run lint     # run ESLint
```

## Environment variables

None required today. `.env.example` documents what a real backend
integration would eventually need (RxNorm/openFDA base URLs, a DrugBank API
key, auth issuer config, FHIR server URL) — none of it is read by the code
yet.

## Project structure

```
src/
  app/            route pages (dashboard, interactions, patient, evidence, settings)
  components/     UI components (layout, drug, interactions, patient, ui)
  lib/            types, demo dataset, simulated API layer, hooks
  state/          React Context providers (medication list, patient profile, toasts)
docs/             full documentation suite (see below)
```

## API

No network API exists. `src/lib/api.ts` documents the exact request/response
shapes a real backend would need to implement to be a drop-in replacement.
Full spec: [`docs/API_SPEC.md`](docs/API_SPEC.md).

## Security

No secrets in the repo, 0 `npm audit` vulnerabilities, no XSS/injection
surface (no `dangerouslySetInnerHTML`, no server routes, no database). No
authentication exists — by design for a client-only demo, but a hard
requirement before any real deployment. Full review:
[`docs/SECURITY.md`](docs/SECURITY.md).

## Roadmap

Five phases carried over from the original dossier (real data → AI/model →
clinical/EHR integration → regulatory → scale), plus near-term improvements
to this prototype itself. Full detail: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Limitations

Read before evaluating or extending this project:
[`docs/LIMITATIONS.md`](docs/LIMITATIONS.md).

## Documentation index

| Doc | Covers |
|---|---|
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | Why this project is scoped the way it is |
| [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | Functional/non-functional requirements, implemented vs. proposed |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Implemented architecture + proposed production architecture |
| [`docs/USER_FLOWS.md`](docs/USER_FLOWS.md) | Every flow, including empty/loading/error paths |
| [`docs/API_SPEC.md`](docs/API_SPEC.md) | Simulated API contract, shaped for a real backend swap |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) | All types, persistence, and proposed data model additions |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Actual security review findings |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Five-phase plan + near-term improvements |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Every non-obvious engineering decision, with reasoning |
| [`docs/DEMO.md`](docs/DEMO.md) | Guided walkthrough |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Current (undeployed) status + recommended path |
| [`docs/TESTING.md`](docs/TESTING.md) | Automated + manual test results, what's fixed, what remains |
| [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) | What this is not |
| [`docs/HONEST_STATUS.md`](docs/HONEST_STATUS.md) | Every component classified REAL/MOCKED/SIMULATED/PROPOSED/NOT IMPLEMENTED |
| [`docs/PORTFOLIO_CASE_STUDY.md`](docs/PORTFOLIO_CASE_STUDY.md) | What I built, why, and how — portfolio framing |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Version history |
| [`docs/UPGRADE-REPORT.md`](docs/UPGRADE-REPORT.md) | Before/after report from the post-launch design/quality upgrade pass |
| [`docs/ORIGINAL_DOSSIER_FA.md`](docs/ORIGINAL_DOSSIER_FA.md) | Original Persian-language technical dossier this project started from |

---

## Business & Product Overview

**Problem:** existing drug-interaction tools disagree with each other,
rarely explain mechanism, and rarely personalize to the patient.

**Target customer:** prescribing clinicians and pharmacists (long-term); in
the interim, this repository's actual audience is technical/portfolio
reviewers evaluating engineering and product judgment.

**Solution:** a workspace unifying interaction detection, mechanism
explanation, patient-context adjustment, and evidence transparency in one
UI, architected for a real backend to be added incrementally.

**Product workflow:** search → build medication list → review interactions →
add patient context → get adjusted guidance → check evidence.

**Differentiation (once the proposed backend exists):** explained mechanisms
(not just severity labels), patient-context adjustment, and local/private
inference — see the competitive comparison in
[`docs/ORIGINAL_DOSSIER_FA.md`](docs/ORIGINAL_DOSSIER_FA.md) §9. None of
these are claimed as currently achieved; see `HONEST_STATUS.md`.

**Monetization possibility:** freemium + subscription, per the original
dossier — unvalidated, no pricing research has been done.

**Scalability:** the current frontend has no scaling concerns (static demo
data); the proposed backend's scalability is a design intent
(`ARCHITECTURE.md`), not something benchmarked.

**Current stage: Prototype/Demo.** Not an MVP with real users, not
production, no revenue, no customers, no clinical validation. See
`docs/HONEST_STATUS.md` for the unambiguous breakdown.

## Demo credentials

None — there is no login. Anyone running the app locally gets a private,
unauthenticated, browser-local session.
