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

There is **no component/UI test suite** (e.g. React Testing Library,
Playwright) yet. That is a real gap, not an oversight papered over — seeing
"PASSED" everywhere below reflects manual verification, not automated
coverage, for anything involving rendering or user interaction.

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
| `npm audit` | ✅ PASSED — 0 vulnerabilities |

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

- No automated component or end-to-end test coverage.
- No visual regression testing (the sidebar bug above is exactly the class
  of issue that would catch).
- No load/performance testing (not meaningful for a static demo dataset).
- No accessibility audit beyond basic semantic HTML, labels, and focus
  states — a full WCAG pass has not been done.
