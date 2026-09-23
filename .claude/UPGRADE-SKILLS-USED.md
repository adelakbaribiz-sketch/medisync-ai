# Skills Used — Master Upgrade Pass

## Round 1

| Task | Skill used | Reason |
|---|---|---|
| Visual/depth upgrade direction | `frontend-design` | Directly relevant to the 3D/spatial/premium UI ask; its guidance to avoid the generic "SaaS-card kit" (identical rounded cards, uniform grey shadow on everything) directly shaped the decision to elevate only two focal surfaces instead of every card |

### Skills considered and not used (round 1)

| Skill | Why not used |
|---|---|
| `project-recovery` | For broken/half-finished projects; this codebase was healthy (built and verified in the immediately preceding session) |
| `project-takeover` | For onboarding to an unfamiliar codebase; this session already had full context from building it |
| `architecture-review` | The architecture is small and was already understood; a formal review pass would have re-derived facts already known, against the brief's own token-efficiency instruction |
| `production-readiness` | This prototype is explicitly not going to production this pass (no deployment target — see `DEPLOYMENT.md`); running a production gate against a demo would produce mostly N/A findings |
| `webapp-testing` (Playwright) | Considered for adding automated UI coverage; deferred as a scoped, separate future task rather than folding it into an already-large visual-upgrade pass — logged as a real gap in `TESTING.md`, not silently dropped |

## Round 2

A different session picked this project back up with no prior context of its own — genuinely the
situation `project-takeover` is for, unlike round 1 where the building session already knew the
codebase.

| Task | Skill used | Reason |
|---|---|---|
| Getting grounded in an unfamiliar, previously-built codebase before changing anything | `project-takeover` | This session had zero prior context on `medisync-ai`; verified git history, ran the actual build/lint/test suite, grepped for stub markers, and read the real component code before trusting round 1's own report of itself |
| Deciding how to close the "no automated e2e" gap | `webapp-testing` | Consulted to check what it offers; determined it's a toolkit for *my own* ad-hoc Python-Playwright verification (used already via the in-app browser tool instead, which was already available and working), not for scaffolding the repo's own committed test suite — so `@playwright/test` (TypeScript) was added directly, matching the project's existing npm/vitest tooling |

### Skills considered and not used (round 2)

| Skill | Why not used |
|---|---|
| `frontend-design` | Not invoked before designing the dark palette — a real process gap versus round 1, which did use it for the light-theme depth system. The dark tokens were instead designed directly against the brand system round 1 already established (same hues, re-tuned lightness/saturation for a dark canvas), so the outcome avoided the generic "invert everything" failure mode the skill warns about, but that was verified by manual/e2e testing rather than checked against the skill's guidance up front. Noted here rather than silently omitted. |
| `architecture-review` | No structural changes this round (theme context follows the exact pattern of the two existing providers; e2e tests are additive) — nothing to re-derive |
| `production-readiness` | Still not applicable; no deployment target added this round |
