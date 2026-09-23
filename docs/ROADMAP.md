# Roadmap

Phases below reflect actual dependency order — later phases assume earlier
ones are done. Time estimates are the original dossier's planning-level
guesses (§10), not commitments.

## Phase 1 — Real data foundation (~3 months, not started)

- Replace `src/lib/mock-data.ts` drug catalog with live **RxNorm** lookups.
- Pull structured labels from **openFDA** for real FDA warning text.
- Keep the existing UI/component layer entirely as-is — only
  `src/lib/api.ts` implementations change, per the seam described in
  `ARCHITECTURE.md`.
- Add a real backend (thin API layer) once there's an actual reason to have
  one (server-side caching of RxNorm/openFDA responses, rate-limit
  management) — not before.

## Phase 2 — AI integration (~3 months, not started)

- Acquire a DrugBank license or an equivalent open dataset (DDInter,
  TWOSIDES) at production scale.
- Train and validate a GNN interaction-prediction model; publish accuracy
  numbers only once a real held-out validation run exists.
- Stand up a local LLM (Ollama-hosted) for natural-language explanation,
  constrained to structured JSON output to control hallucination risk.
- Build the RAG evidence-retrieval pipeline (pgvector + hybrid search) so
  evidence citations become real, traceable citations instead of demo
  summaries.

## Phase 3 — Clinical integration (~3 months, not started)

- FHIR R4 patient resource ingestion.
- CDS Hooks integration for at least one EHR sandbox.
- Real authentication (OIDC/Keycloak) and role-based access control.
- Server-side audit logging.

## Phase 4 — Regulatory (~6 months, not started)

- Formal FDA / EMA classification analysis with counsel.
- HIPAA/GDPR compliance program (not just technical controls — policy,
  BAAs, data processing agreements).
- Independent security review / penetration test.

## Phase 5 — Scale (ongoing, not started)

- Kubernetes deployment, multi-language UI, deeper EHR partnerships.

## Near-term, low-effort improvements to this prototype itself

These don't require any external dependency and could reasonably be picked
up next if this project continues as a portfolio piece:

- Component-level (React Testing Library style) unit tests — the current
  suite is pure-logic unit tests plus full e2e flows (see `TESTING.md`),
  with nothing in between yet.
- Visual regression / screenshot-diff testing.
- Persist the "simulate error" demo toggle's UI state more visibly (it
  currently resets on reload, which is correct behavior but easy to miss).
- Expand the demo dataset beyond 18 drugs / 17 interactions if broader
  coverage would strengthen the demo.
- ~~Dark mode~~ — done in round 2 (see `DECISIONS.md` #10, `CHANGELOG.md`
  0.3.0).
- ~~Automated UI/e2e test coverage~~ — done in round 2 (`e2e/`,
  `DECISIONS.md` #11).
