# User Flows

## 1. Build a medication list and see interactions (primary flow)

1. User lands on **Dashboard** (`/`). Medication list is empty →
   `EmptyState` prompts them to search.
2. User types into the drug search box → debounced (200ms) search against
   the demo catalog → matching results appear with drug class shown.
3. User clicks a result → drug is added to the medication list, a success
   toast confirms it, `localStorage` is updated.
4. Once ≥2 drugs are listed, the app fetches interactions (simulated network
   call) → shows a loading skeleton → then renders:
   - Severity count cards (contraindicated/major/moderate/minor)
   - Top 3 highest-priority interactions
   - An interaction network graph (nodes = drugs, edges = interactions,
     colored by severity)
5. User clicks "View all N interactions" → navigates to **Interactions**.

## 2. Full interaction analysis

1. On `/interactions`, the same medication list drives a full table of every
   pairwise interaction, sorted by severity by default.
2. User can toggle severity filter chips (Contraindicated/Major/Moderate/Minor)
   to narrow the table.
3. Clicking "View" on a row expands it in place to show clinical effect,
   recommendation, suggested alternatives, and cited evidence.
4. If a patient profile has been filled in and the interaction's drug class
   plus the profile's values trigger an adjustment rule (e.g. severe renal
   impairment + a renally-cleared drug), a highlighted "Patient-context note"
   appears in the expanded row.

## 3. Patient profile

1. On `/patient`, user enters age, weight, eGFR, hepatic impairment level,
   pregnancy status, and allergies (chip input, press Enter or click Add).
2. "Save profile" shows a confirmation toast; data is persisted to
   `localStorage` and immediately available to the Interactions page's
   adjustment logic — no separate sync step.
3. "Reset" clears the profile back to empty.

## 4. Evidence library

1. `/evidence` lists every interaction in the demo dataset (not scoped to the
   current medication list) with its cited evidence entries.
2. A text filter narrows by drug name.
3. A persistent banner clarifies that entries are paraphrased demo summaries,
   not live citations.

## 5. Settings / demo utilities

1. `/settings` exposes notification toggles (non-functional demo controls),
   read-only data-source toggles showing which sources are "live" vs.
   licensed-and-not-connected, and a "Clear all local demo data" action that
   wipes the medication list and patient profile from `localStorage`.

## 6. Error and edge-case handling

- **Empty state**: fewer than 2 drugs → every dependent view (graph, table,
  dashboard summary) shows an explicit empty state with next-step guidance,
  never a blank screen.
- **Loading state**: skeleton placeholders on Dashboard and Interactions
  while the simulated fetch resolves (~450ms).
- **Error state**: a "Demo utility: simulate a backend connection error"
  control on the Dashboard lets a reviewer trigger and inspect the error UI
  without needing to actually break anything.
- **No results**: searching for a drug not in the demo catalog shows an
  explicit "No drugs found" message rather than an empty dropdown.
