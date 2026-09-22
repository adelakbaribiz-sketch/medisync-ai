# Skills Used — Master Upgrade Pass

| Task | Skill used | Reason |
|---|---|---|
| Visual/depth upgrade direction | `frontend-design` | Directly relevant to the 3D/spatial/premium UI ask; its guidance to avoid the generic "SaaS-card kit" (identical rounded cards, uniform grey shadow on everything) directly shaped the decision to elevate only two focal surfaces instead of every card |

## Skills considered and not used

| Skill | Why not used |
|---|---|
| `project-recovery` | For broken/half-finished projects; this codebase was healthy (built and verified in the immediately preceding session) |
| `project-takeover` | For onboarding to an unfamiliar codebase; this session already had full context from building it |
| `architecture-review` | The architecture is small and was already understood; a formal review pass would have re-derived facts already known, against the brief's own token-efficiency instruction |
| `production-readiness` | This prototype is explicitly not going to production this pass (no deployment target — see `DEPLOYMENT.md`); running a production gate against a demo would produce mostly N/A findings |
| `webapp-testing` (Playwright) | Considered for adding automated UI coverage; deferred as a scoped, separate future task rather than folding it into an already-large visual-upgrade pass — logged as a real gap in `TESTING.md`, not silently dropped |
