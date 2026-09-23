# Honest Status

A single, scannable classification of every major claim or component in this
project. Use this page if you only read one doc before deciding how much
trust to place in something here.

| Component / claim | Status | Notes |
|---|---|---|
| Next.js frontend (Dashboard, Interactions, Patient Profile, Evidence, Settings) | **REAL / IMPLEMENTED** | Working code, manually and automatically tested, running against a live dev server during this review. |
| Responsive layout, empty/loading/error states | **REAL / IMPLEMENTED** | Verified at desktop and mobile widths; error state has a dedicated demo trigger. |
| Medication list / patient profile persistence | **REAL / IMPLEMENTED** | Genuinely persists via browser `localStorage`. Not server-backed. |
| Demo drug catalog (18 drugs) | **MOCKED** | Real drug names/classes; synthetic `DEMO-####` ids, not real RxCUIs. |
| Demo interaction dataset (17 pairs) | **MOCKED, pharmacologically accurate** | Real, textbook-documented interactions; hand-curated content, not pulled from a live database. |
| Evidence citations (`EvidenceRef`) | **SIMULATED** | Paraphrased summaries written for this prototype. Not live citations; no verifiable external identifiers included. |
| Patient-context severity adjustment | **SIMULATED** | Transparent, hand-written rules (renal/hepatic/pregnancy). Not a validated clinical scoring model. |
| "Backend API" (`src/lib/api.ts`) | **SIMULATED** | Real async functions with real latency/error paths, but resolving against in-memory static data — no network call, no server. |
| Automated unit test suite (21 tests) | **REAL / IMPLEMENTED** | Actually runs, actually passes, covers pure logic and dataset integrity. See `TESTING.md`. |
| Automated UI/e2e test suite | **REAL / IMPLEMENTED** | 9 Playwright tests (navigation, theme, core medication/interaction flow) — actually run, actually pass. See `TESTING.md`. |
| Light/dark theme | **REAL / IMPLEMENTED** | Separately-designed dark palette (not inverted), one toggle in the sidebar, persisted via `localStorage`, verified manually and via `e2e/theme.spec.ts`. |
| `npm run build` / `npm run lint` / `npm test` / `npm run test:e2e` / `npm audit` clean | **REAL / VERIFIED** | Actually run for this delivery; results reported in `TESTING.md` and `SECURITY.md`, not asserted from memory. |
| GNN interaction-prediction model | **PROPOSED** | Documented architecture only; no model, no training run, no data. |
| Fine-tuned local LLM explanation engine | **PROPOSED** | Documented architecture only; not built. |
| RAG evidence pipeline (pgvector/hybrid search) | **PROPOSED** | Documented architecture only; not built. |
| Multi-agent orchestration (6 agents) | **PROPOSED** | Documented architecture only; not built. |
| FHIR R4 / CDS Hooks / EHR integration | **PROPOSED** | Documented architecture only; not built; no EHR sandbox exists. |
| Authentication / authorization | **NOT IMPLEMENTED** | No login exists. Not applicable to a client-only demo, but a hard requirement before any real deployment — see `SECURITY.md`. |
| HIPAA / GDPR / FDA / EMA compliance | **NOT IMPLEMENTED / NOT APPLICABLE YET** | No real patient data is handled, so these regimes don't currently apply; they would need a dedicated compliance program before they could. |
| Target accuracy metrics (e.g. F1 > 0.70) from the original dossier | **PROPOSED TARGET, NOT MEASURED** | No model exists to measure. Not claimed as achieved anywhere in this repository. |
| Real customers, revenue, funding, or user testing | **NOT IMPLEMENTED / DOES NOT EXIST** | This is a portfolio prototype. No claim of market traction is made anywhere in this repository. |
| Live public deployment | **NOT IMPLEMENTED** | Runs locally only at time of writing; see `DEPLOYMENT.md`. |

## How to read this table

- **REAL / IMPLEMENTED** — exists, was run, and was verified as part of this
  delivery (not just written and assumed to work).
- **MOCKED** — realistic demo content standing in for a real data source.
- **SIMULATED** — code that behaves like a real system (real async behavior,
  real error paths) but has no real backend or model behind it.
- **PROPOSED** — documented design intent only; zero implementation exists.
- **NOT IMPLEMENTED** — mentioned in the original dossier or in these docs as
  a future need, with nothing built yet.
