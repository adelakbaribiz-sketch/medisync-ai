# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.3.0] — 2026-09-23

Second upgrade pass (round 2), by a session that first re-verified round
1's own report against the actual code (`project-takeover`). Full
before/after reasoning in [`UPGRADE-REPORT.md`](UPGRADE-REPORT.md)'s
"Round 2" section.

### Added

- Light/dark/system theming: a separately-designed `.dark` token palette in
  `globals.css` (not an inversion), `ThemeProvider`/`useTheme` in
  `app-state.tsx`, and a single `ThemeToggle` control in the sidebar footer.
  Persisted via `localStorage`, applied pre-hydration via an inline script
  to avoid a flash of the wrong theme.
- Playwright e2e suite (`e2e/`, `npm run test:e2e`): 9 tests covering
  navigation, theme persistence, and the core medication/interaction flow.

### Fixed

- Dark mode's no-flash inline script compared a raw `localStorage` string
  against an unquoted literal; the shared `writeStorage` helper JSON-encodes
  every value, so the comparison silently never matched and the flash it
  was built to prevent happened anyway on every reload for dark-mode users.
  Found by the new e2e suite's reload test, not by manual testing or code
  review. Fixed in `src/app/layout.tsx`.
- One `react-hooks/set-state-in-effect` lint violation in the new
  `ThemeProvider`, resolved by deriving `resolved` theme state instead of
  setting it imperatively in an effect (see `DECISIONS.md` #10).

### Changed

- `docs/SECURITY.md` updated: the dark-mode script's one, reviewed,
  justified `dangerouslySetInnerHTML` use replaces a now-inaccurate "none
  found" claim.

## [0.2.0] — 2026-09-23

Design/quality upgrade pass. Full before/after reasoning in
[`UPGRADE-REPORT.md`](UPGRADE-REPORT.md).

### Added

- Brand-tinted elevation shadow scale and motion tokens in `globals.css`.
- `Surface` component, consolidating a card-wrapper pattern that was
  duplicated across 9 files.
- `EvidenceStrengthBadge` — a visual trust-layer cue for evidence strength
  (Established/Probable/Theoretical), replacing plain parenthetical text.
- `prefers-reduced-motion` handling for the new hover-lift pattern.

### Changed

- Dashboard KPI cards and the interaction network graph panel promoted to
  an "elevated" surface with a severity-colored top accent bar — the only
  two surfaces given this treatment, deliberately (see `DECISIONS.md` #8).

### Fixed

- `InteractionGraph`'s severity legend was rendering raw lowercase keys
  instead of the proper-case `severityLabel` text.
- Replaced a non-null assertion in `InteractionGraph` with an explicit
  guard, matching the defensive pattern already used a few lines above.

## [0.1.0] — 2026-09-22

Initial portfolio prototype, built from the original Persian-language
technical dossier (`ORIGINAL_DOSSIER_FA.md`).

### Added

- Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 app shell with a
  persistent sidebar and mobile navigation drawer.
- Dashboard: drug search/autocomplete, medication list builder, severity
  summary cards, top-interactions list, custom SVG interaction network graph.
- Interaction Analysis page: full pairwise interaction table with severity
  filters and expandable detail (mechanism, clinical effect, recommendation,
  alternatives, evidence).
- Patient Profile page: age, weight, eGFR, hepatic impairment, pregnancy,
  allergies — persisted client-side and used to adjust interaction guidance.
- Evidence Library page: browsable, filterable evidence view across the full
  demo dataset.
- Settings page: notification/data-source demo toggles and a "clear all
  local demo data" utility.
- Demo dataset: 18 drugs and 17 pharmacologically real, hand-curated
  interaction pairs spanning all four severity levels.
- Simulated async data layer (`src/lib/api.ts`) with realistic latency and an
  explicit error-simulation path, so loading/error UI states are real and
  demonstrable, not just designed.
- Vitest unit test suite (21 tests) covering severity sorting, patient-context
  adjustment rules, and demo-dataset integrity.
- Full documentation suite under `docs/` (architecture, product
  requirements, API spec, data model, security review, roadmap, decisions,
  demo guide, deployment notes, testing report, limitations, honest status).

### Fixed

- Sidebar navigation scrolling away with page content instead of remaining
  fixed, found during manual verification of the Dashboard (see
  `TESTING.md`).
- Four ESLint `react-hooks/set-state-in-effect` violations, resolved with a
  mix of restructuring (derived state instead of imperative clearing) and
  justified, documented exceptions (see `DECISIONS.md`).

### Known gaps (see `LIMITATIONS.md` and `ROADMAP.md`)

- No real backend, trained model, or live external data source.
- No automated UI/e2e test coverage.
- No authentication, no live deployment.
