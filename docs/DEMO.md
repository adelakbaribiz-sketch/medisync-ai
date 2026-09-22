# Demo Guide

## Running it locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables, database, or API
keys are required — see `.env.example` for what a future real backend would
need (none of it is read by the code today).

## No login required

There is no authentication in this prototype. Every visitor gets a private
browser-local session (via `localStorage`) — nothing is shared between
browsers or devices. **There are no demo credentials because there is no
login screen.**

## Suggested walkthrough (~3 minutes)

1. **Dashboard** — search for and add: `Warfarin`, `Aspirin`, `Simvastatin`,
   `Clarithromycin`. Watch the severity count cards and the interaction graph
   update live. Note the Simvastatin + Clarithromycin edge is red
   (contraindicated).
2. Click **"View all N interactions"** → lands on **Interactions**. Toggle
   the severity filter chips. Expand the Simvastatin + Clarithromycin row to
   see mechanism, recommendation, alternatives, and cited evidence.
3. Go to **Patient Profile**, set eGFR to `22` (severe renal impairment), and
   save. Return to **Interactions** and re-expand the Warfarin + Aspirin row
   — a "Patient-context note" now appears, explaining the renal-function
   escalation.
4. Visit **Evidence Library** and filter by a drug name to see the full
   sourcing behind every demo interaction, independent of your current list.
5. Visit **Settings** → try "Clear all local demo data" to reset the whole
   session.
6. Back on **Dashboard**, click the small "Demo utility: simulate a backend
   connection error" link to see the app's real error-state UI.

## What's real vs. simulated during this walkthrough

See `LIMITATIONS.md` and `HONEST_STATUS.md` for the full breakdown. In short:
the product experience, UI states, and pharmacology facts behind the demo
data are real; the "backend" is a simulated in-memory layer, and the
evidence citations are paraphrased summaries, not live-fetched sources.
