# Upgrade Report — Master Upgrade Pass

Applied to: `medisync-ai` (confirmed with the user before starting, since the
upgrade brief referenced a different project's brand system by name).

**Scope note up front:** this is a static-frontend prototype with no
backend, database, or DevOps pipeline (by design — see
`docs/PROJECT_CONTEXT.md`). Most of the brief's Backend/Database/DevOps/
Observability sections are genuinely not applicable here, and are marked N/A
below rather than padded with busywork. The brief's own principle —
"maximum value / minimum token / minimum complexity" — is the standard this
report holds itself to.

## Before/After by category

| Category | Before | After | Why | Impact | Risk |
|---|---|---|---|---|---|
| **Architecture** | Client-only Next.js app, single `api.ts` seam, no coupling issues | Unchanged | Already sound for its scope; rewriting a healthy architecture violates the brief's own "keep, don't rewrite" rule | — | None (no change) |
| **Backend** | None | None | N/A — no backend exists or was warranted | N/A | N/A |
| **Database** | None | None | N/A | N/A | N/A |
| **Code Quality** | 9 files duplicated the same "rounded-xl border bg-surface" card wrapper string; one non-null assertion (`!`) where a sibling line already used a defensive `if` guard; graph legend rendered raw lowercase severity keys instead of the proper-case label map | Consolidated into a shared `Surface` component; replaced the assertion with the same guard pattern used two lines above; legend now uses `severityLabel` | 3+ repeats of a pattern is the brief's own threshold for extracting a component; the assertion and label bug were real, found-by-reading defects, not hypothetical | Fewer places to update the card look consistently; one less crash-shaped edge case; correct legend text | Low — pure refactor + 2-line bug fixes, covered by the existing build/lint/test pass |
| **Frontend** | Solid component structure already (empty/loading/error states, responsive) | Unchanged structurally; visuals upgraded (below) | Structure was already healthy | — | None |
| **Design System** | Colors as CSS tokens (good); no elevation, motion, or depth tokens; no reusable card primitive | Added brand-tinted `--shadow-sm/md/lg/xl` (override Tailwind's generic grey shadow scale), motion tokens, and the `Surface` primitive | The brief asked for a real design-system pass, and colors-only was an incomplete token system | Consistent depth language available for future components, not just this pass | Low — additive tokens, nothing removed |
| **3D / Spatial UI** | Fully flat cards everywhere | Two deliberate "elevated" surfaces: Dashboard KPI cards (with a severity-colored top accent bar) and the interaction network graph panel | Brief explicitly wants depth used *semantically* (highlight what matters) and explicitly warns against decorating every card the same way — this is a KPI dashboard, not a marketing page, so restraint mattered more than spectacle | The two genuinely important focal points on the busiest page now read as focal points; tables/forms/settings stay flat and fast as the brief itself prescribes for "heavy panels" | Low — CSS box-shadow/transform only, no WebGL, verified at mobile width (375px) with no overflow or heaviness |
| **AI Trust Layer** | Evidence strength shown as plain parenthetical text `(Established)` | `EvidenceStrengthBadge`: solid/outlined/dashed chip per strength tier, with an explanatory `title` tooltip | Brief asks AI-adjacent UI to show confidence/explainability without ever presenting false certainty | "Theoretical" evidence is now visually distinguishable from "Established" evidence at a glance, not just in careful reading | Low — presentational only; deliberately did **not** add a fabricated numeric confidence score (see `DECISIONS.md` #9) |
| **Security** | 0 npm audit vulnerabilities, no secrets, no XSS surface (prior review) | Re-verified after all changes: still 0 vulnerabilities, no new dependencies added | Re-running the check is the point, not assuming it still holds | Confirms the upgrade introduced no new risk | None |
| **Performance** | Minimal bundle (no charting/icon library, no images) | Unchanged — no new runtime dependencies added for the depth system (pure CSS) | A WebGL/Three.js or charting-library approach was explicitly rejected per the brief's own "don't add GPU cost for a simple card" guidance | Zero bundle-size or runtime cost added for the visual upgrade | None |
| **Testing** | 21 unit tests (pure logic + dataset integrity), 0 UI/e2e tests | Same 21 tests, all still passing after every change; manually re-verified Dashboard/Evidence/Settings/mobile in-browser after the visual changes | No new automated UI coverage was added this pass — flagged as a real gap, not hidden | Confidence in what's covered is unchanged and accurate | None new |
| **Accessibility** | Focus rings, semantic HTML, aria-checked toggle already present | Added `prefers-reduced-motion` handling for the new hover-lift pattern | New motion needs to respect existing accessibility settings from the moment it's added, not as an afterthought | Users with reduced-motion preferences get no transform/shadow animation | None |
| **Documentation** | Full 17-doc suite from the initial build | +2 new decisions logged (`DECISIONS.md` #8–9), this report, and the skills-usage log | Brief explicitly requires a before/after report and a skills log | Traceable reasoning for every visual/structural change made this pass | None |
| **DevOps** | No CI/CD pipeline exists | Unchanged | Not warranted for a static demo prototype with no deployment target yet (see `DEPLOYMENT.md`) | N/A | N/A |

## What was deliberately NOT done

- **No dark mode** — still deferred (see original `DECISIONS.md` #5); adding
  a half-tested dark theme under this pass's time budget would have hurt
  the "polished" bar more than skipping it.
- **No WebGL/Three.js** — the brief itself says never add it for a simple
  card; nothing here needed it.
- **No new automated UI/e2e tests** — real gap, called out explicitly rather
  than rushed. See `TESTING.md`.
- **No rewrite of the interaction table, patient form, or settings pages'
  internal logic** — they were already correct and readable; only their
  repeated wrapper markup was consolidated into `Surface`.
- **No BabaHakim-specific brand colors applied** — the upgrade brief named a
  brand system for a different, unrelated project; the user confirmed this
  pass targets `medisync-ai`, which keeps its own existing clinical-teal
  identity.

## Skills used

See `.claude/UPGRADE-SKILLS-USED.md`.

## Verification performed

- `npm run build` — ✅ clean before, during (after each file group), and
  after this pass.
- `npm run lint` — ✅ 0 errors throughout.
- `npm test` — ✅ 21/21 passing throughout.
- `npm audit` — ✅ 0 vulnerabilities, unchanged.
- Manual in-browser check: Dashboard (desktop + mobile), Evidence Library
  (Established/Theoretical badge contrast), Settings (toggle rendering after
  `Surface` refactor). Console checked for errors: none.

## Commits this pass

1. `3d637cc` — `design: add elevation tokens, Surface primitive, evidence trust badge`
2. `004b0b6` — `quality: replace non-null assertion with an explicit guard`
3. (this commit) — `docs: upgrade report and decisions log`

## Final status (round 1)

**READY FOR NEXT PASS.** Build/lint/test/audit all clean; the visual upgrade
is scoped, verified in-browser at desktop and mobile widths, and documented.
Real remaining gaps (no automated UI tests, no dark mode, no live data) are
unchanged from before this pass and are tracked in `LIMITATIONS.md` and
`ROADMAP.md`, not newly introduced by it.

---

# Round 2

Applied by a different session with no prior context of its own — see
`.claude/UPGRADE-SKILLS-USED.md`'s round 2 section for how that was handled
(`project-takeover` first, to verify round 1's own report against the actual
code and a real build/lint/test run rather than trusting it).

**Scope:** round 1 already closed most available value for this size of
project; re-running the full brief end-to-end would have been busywork
against its own "maximum value / minimum token" principle. This pass targets
exactly the two gaps round 1 named explicitly as deferred/missing: dark mode
and automated UI/e2e coverage. Everything round 1 marked N/A (backend,
database, DevOps) is still N/A and unchanged.

## Before/After

| Category | Before | After | Why | Impact | Risk |
|---|---|---|---|---|---|
| **Design System / Dark Mode** | Light theme only (decision #5: deferred, not half-tested) | Real `.dark` palette in `globals.css` — separately tuned neutrals, brand, and all four severity colors for a dark canvas, not an inversion formula | Explicitly requested by the brief (§20) and explicitly named as the reason-to-revisit in decision #5 | Every existing component (severity cards, evidence badges, tables, graph) works in dark mode with zero component-code changes, because round 1's token system routed all color through CSS custom properties | Low — pure CSS addition; verified in-browser (desktop + mobile, all 5 pages) |
| **Theme control** | N/A | One `ThemeToggle` (light → dark → system cycle) in the sidebar footer, one `ThemeProvider`, persisted via the same `localStorage` pattern the app already uses for medication list/patient profile | Single source of truth over adding a second control in Settings — see `DECISIONS.md` #10 | One click from any page, no navigation required | Low |
| **Testing** | 21 unit tests, 0 e2e | Same 21 unit tests + **9 new Playwright e2e tests** (`npm run test:e2e`) covering navigation, theme persistence, and the core add-drug→see-interaction→clear-data flow | `HONEST_STATUS.md` named this gap explicitly | Closed a named, real gap — not speculative coverage | Low — additive; found and fixed a real bug (next row) rather than just adding green checkmarks |
| **Code Quality** | — | **Found and fixed a real bug**: the dark-mode no-flash inline script compared a raw `localStorage` string against an unquoted literal, but the shared `writeStorage` helper JSON-encodes every value (needed for the other providers' objects) — so the comparison silently never matched, and the class was only applied post-hydration by React. Net effect: the exact flash the script exists to prevent would have happened for every returning dark-mode user. | Script now `JSON.parse`s the stored value | Caught by the new e2e suite's reload test on its first real run — not by code review or manual click-through, both of which had already "passed" | Fixes a real, user-visible regression introduced in this same pass, before it shipped | None — verified fixed via the same test, 3x repeat run to rule out flakiness before concluding it was a real bug |
| **Security** | 0 vulnerabilities, no `dangerouslySetInnerHTML` anywhere | Re-reviewed: 0 vulnerabilities (incl. new dev-only Playwright dependency); one new, reviewed, justified `dangerouslySetInnerHTML` use for the theme script (static literal, no external data reaches it) — `SECURITY.md` updated rather than left stating a now-false "none found" | The brief requires a security pass after changes, and a stale claim is worse than an updated one | `SECURITY.md` accurately reflects the current codebase again | None — reviewed, not just re-run |
| **Accessibility** | Focus rings, semantic HTML, `aria-checked` toggle, `prefers-reduced-motion` handling | + theme toggle has a descriptive `aria-label` reflecting current state; dark mode re-tuned severity colors were checked for contrast against the dark canvas, not just carried over at the same lightness | New interactive element and new color values both need their own accessibility check, not inherited from the light-mode review | Theme control is screen-reader-legible; severity meaning stays visually distinguishable in dark mode | None |
| Everything else (Architecture, Backend, Database, Frontend structure, DevOps) | Unchanged | Unchanged | Already correctly scoped as N/A or already-healthy in round 1; re-touching them would violate the brief's own "don't rewrite healthy code" rule | — | None (no change) |

## What was deliberately NOT done (round 2)

- **No second theme control in Settings** — one control, one source of truth; see `DECISIONS.md` #10.
- **No `frontend-design` skill consultation before designing the dark palette** — a real process gap versus round 1; logged honestly in `.claude/UPGRADE-SKILLS-USED.md` rather than omitted, even though the resulting palette was still bespoke (not a generic invert) and was verified adequate by manual + e2e checks.
- **No CI pipeline added** to run the new e2e suite automatically — still no deployment target to justify it (unchanged from round 1's DevOps N/A).
- **No visual-regression/screenshot-diff tooling** — flagged as a real remaining gap in `TESTING.md`, not attempted.
- **No component-level unit tests** (React Testing Library-style) — the new coverage is either pure-logic (existing) or full e2e (new); that gap is named, not hidden.

## Verification performed (round 2)

- `npm test` — ✅ 21/21 passing (unchanged suite, re-run after every change group).
- `npm run lint` — ✅ 0 errors (one real `react-hooks/set-state-in-effect` finding during development, fixed by restructuring — not suppressed — see `DECISIONS.md` #10's implementation).
- `npm run build` — ✅ clean, all 6 routes.
- `npm run test:e2e` — ✅ 9/9 passing, after finding and fixing the bug described above (confirmed non-flaky via a 3x isolated repeat run before treating it as a real bug rather than test noise).
- `npm audit` — ✅ 0 vulnerabilities.
- Manual in-browser verification: light → dark → system cycling on Dashboard, Evidence Library, and mobile width (375px); added two real interacting drugs (Simvastatin + Clarithromycin) and confirmed the contraindicated interaction, KPI card, graph node, and evidence citation all render correctly in dark mode; confirmed dark-mode persistence survives a hard reload with no flash. Console checked for errors throughout: none.

## Commits this pass

See `git log` — grouped as: theme tokens + provider + toggle, e2e suite +
bugfix, documentation. Isolated per the brief's own change-grouping
instruction rather than one large commit.

## Final status (round 2)

**READY FOR NEXT PASS.** Both gaps round 1 named explicitly (dark mode,
automated UI coverage) are now real and verified, not just claimed. The e2e
suite proved its own value by catching a genuine bug before it shipped.
Remaining real gaps (visual regression testing, component-level unit tests,
no CI, no live data/backend) are named in `LIMITATIONS.md`/`ROADMAP.md`/
`TESTING.md`, not newly introduced and not hidden.
