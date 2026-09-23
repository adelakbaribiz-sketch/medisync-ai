# Testing

## Automated tests

`npm test` runs a Vitest unit suite covering the app's pure logic — the
parts most worth protecting with automated tests, since the app has no
backend to integration-test:

| Suite | File | What it checks |
|---|---|---|
| `sortBySeverity` | `src/lib/severity.test.ts` | Correct severity ordering, no mutation of input, empty-array handling |
| `adjustedSeverityNote` | `src/lib/api.test.ts` | Each patient-context rule (renal, pregnancy, hepatic) fires independently and combines correctly; boundary case (eGFR exactly 30) does *not* fire |
| `searchDrugs` / `getInteractionsForList` | `src/lib/api.test.ts` | Blank query returns nothing; matches by generic name and drug class; results only include drugs from the given list; the `simulateError` path actually rejects |
| Demo dataset integrity | `src/lib/mock-data.test.ts` | No duplicate `rxcui`/interaction ids, every interaction references real drugs, no drug paired with itself, no duplicate pair listed twice, every interaction has at least one evidence entry |

**Result at time of writing: 21/21 tests passing** (`npm test`).

## End-to-end tests (added round 2)

`npm run test:e2e` runs a Playwright suite against a real running instance
of the app (Chromium, headless):

| Suite | File | What it checks |
|---|---|---|
| Navigation | `e2e/navigation.spec.ts` | Every one of the 5 routes renders its real `<h1>` with zero console errors; the sidebar actually reaches every route by clicking, not by direct URL |
| Theme | `e2e/theme.spec.ts` | Toggle cycles to an explicit mode and **persists across a hard reload**; dark mode actually applies dark surface colors (checked via computed background luminance, not just a class name) |
| Core flow | `e2e/medication-flow.spec.ts` | Add two real interacting drugs → contraindicated interaction appears on Dashboard, Interactions, and Evidence pages → Settings' "Clear all local demo data" round-trips it back to empty |

**Result at time of writing: 9/9 e2e tests passing.**

This suite caught a real bug on its first genuine run: the dark-mode,
no-flash inline script in `layout.tsx` compared a raw `localStorage` string
against an unquoted literal, but the shared `writeStorage` helper
JSON-encodes every value — so the stored string was literally `"dark"` with
quote characters, which never matched. The class only got applied by React
after hydration, meaning returning dark-mode users would see exactly the
light-then-dark flash the script exists to prevent. Fixed in
`src/app/layout.tsx`; see `docs/DECISIONS.md` #10–11 and the commit history
for this pass. This is the concrete case for why the e2e gap below was
worth closing rather than deferring again — a code review or manual click
pass did not surface it; running the actual reload sequence did.

## Manual verification performed for this delivery

Performed via the Claude Code browser tooling against the running dev
server, not just described:

- Added drugs via the search combobox; confirmed toast notifications,
  medication list updates, and `localStorage` persistence.
- Built a 4-drug list (Warfarin, Aspirin, Simvastatin, Clarithromycin) and
  confirmed the correct severity counts (1 contraindicated, 1 major,
  1 moderate) and the correct interaction graph edges/colors.
- Expanded interaction rows on `/interactions` and confirmed mechanism,
  clinical effect, recommendation, alternatives, and evidence all render.
- Set eGFR to 22 on `/patient`, returned to `/interactions`, and confirmed
  the patient-context note appeared on the Warfarin + Aspirin row with the
  expected renal-impairment text.
- Verified `/evidence` filtering by drug name.
- Verified `/settings` toggles render and "Clear all local demo data" works.
- Verified the Dashboard's "simulate a backend connection error" utility
  renders the actual error-state UI.
- Verified responsive layout at mobile width (375px): hamburger menu opens a
  working navigation drawer; no horizontal overflow.
- Checked the browser console for errors after the above flows: none found.
- Found and fixed a real layout bug during this pass (see below).

## Build / lint / test report

| Check | Result |
|---|---|
| `npm run build` | ✅ PASSED — compiles cleanly, all 6 routes prerender as static content |
| `npm run lint` | ✅ PASSED — 0 errors, 0 warnings |
| `npm test` | ✅ PASSED — 21/21 |
| `npm run test:e2e` | ✅ PASSED — 9/9 (added round 2; caught and fixed one real bug — see above) |
| `npm audit` | ✅ PASSED — 0 vulnerabilities (re-verified round 2, no new dependencies with known issues) |

## Fixed during this delivery

- **Sidebar scrolled away with page content** instead of staying fixed,
  because the root layout used `min-h-screen` on a normal document flow
  instead of a fixed-height, independently-scrolling app shell. Fixed in
  `src/app/layout.tsx` and `src/components/layout/Sidebar.tsx` by switching
  to `h-full` + `overflow-y-auto` on the two columns. Caught by manually
  scrolling the dashboard during verification, not by an automated test —
  there is no visual-regression test that would have caught this
  automatically, which is a real limitation of the current test suite.
- Four ESLint `react-hooks/set-state-in-effect` errors — see `DECISIONS.md`
  item 7 for the reasoning behind each fix.

## Remaining (not fixed, documented instead)

- No visual regression testing (screenshot diffing) — the e2e suite checks
  behavior and computed styles at specific points, not full-page visual
  diffs frame-to-frame.
- No component-level (React Testing Library style) unit tests for individual
  components — coverage is either pure-logic unit tests or full e2e flows,
  nothing in between yet.
- No load/performance testing (not meaningful for a static demo dataset).
- No accessibility audit beyond basic semantic HTML, labels, and focus
  states — a full WCAG pass has not been done.
- e2e suite runs against Chromium only (no Firefox/WebKit projects
  configured) and was not wired into a CI pipeline (none exists — see
  `DEPLOYMENT.md`).
