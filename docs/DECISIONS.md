# Engineering Decisions

Decisions that shaped the scope, in the order they mattered, with the
reasoning behind each — so a reviewer (or a future contributor) can tell
which choices were deliberate tradeoffs versus accidents.

## 1. No real backend, no real AI model

**Decision:** Build the full frontend product experience against a static,
curated demo dataset instead of a partial/fake backend.

**Why:** The original dossier's AI engine (GNN + fine-tuned LLM + licensed
DrugBank data) cannot be honestly built without a training dataset, GPU
infrastructure, and a validation study — none of which exist for this
project. The alternative — hardcoding outputs and presenting them as
"AI-generated" — would misrepresent the product. Building a real but
trivial backend (e.g. a Node API serving the same static JSON over HTTP)
would add infrastructure and complexity without adding anything a reviewer
can actually evaluate differently. See `ARCHITECTURE.md`.

## 2. Demo dataset uses real pharmacology, not invented mechanisms

**Decision:** The 17 demo interactions describe real, textbook-documented
drug interactions (e.g. simvastatin + clarithromycin, sildenafil + nitrates),
not fictional drugs or fabricated mechanisms.

**Why:** A portfolio piece about a *medical* product reads as careless if the
example content is pharmacologically wrong. Using real, well-established
interactions makes the demo credible while the evidence *summaries*
themselves are still clearly labeled as paraphrased demo content, not live
citations — see `LIMITATIONS.md`. This is a middle ground: accurate
pharmacology, honest sourcing.

## 3. Client-side state only (`localStorage`), no accounts

**Decision:** Medication list and patient profile persist to the browser,
not to a server; there is no login.

**Why:** Adding authentication and a database would suggest this handles
real patient data, which it explicitly must not (see `SECURITY.md`). It also
would have been backend complexity in service of a login screen, not the
actual product experience being demonstrated.

## 4. Custom SVG interaction graph instead of D3.js/Cytoscape.js

**Decision:** Hand-built a small circular-layout SVG graph component instead
of adding a charting/graph-visualization library.

**Why:** The dossier specified D3/Cytoscape for a much larger, dynamic
knowledge graph. For a demo medication list that realistically holds a
handful of drugs, a dependency-free static layout is simpler, has zero
extra bundle weight, and is fully stylable with the app's own design tokens.
This would be revisited if the real product needed to visualize dozens of
nodes with force-directed layout.

## 5. No dark mode in this pass

**Decision:** Ship a single, carefully designed light theme rather than a
light+dark toggle.

**Why:** A half-tested dark mode (inconsistent contrast, missed components)
would hurt the "polished" bar more than no dark mode at all. Listed in
`ROADMAP.md` as a near-term improvement rather than cut silently.

## 6. Evidence strength is an editorial judgment, not a computed score

**Decision:** Each `EvidenceRef.strength` ("Established"/"Probable"/
"Theoretical") was assigned by hand based on how well-documented each
interaction is in standard pharmacology references, loosely inspired by
GRADE-style evidence tiers — not computed by any algorithm.

**Why:** Being explicit about this in the data model and in `LIMITATIONS.md`
prevents the UI from implying an automated evidence-grading system exists
when it doesn't.

## 7. `react-hooks/set-state-in-effect` handling

**Decision:** Restructured two data-fetching effects (search debounce,
interaction fetch) to compute "empty" states as derived values instead of via
an early `setState` call in the effect body, to satisfy the newer
`eslint-plugin-react-hooks` rule cleanly. Kept two `localStorage`-hydration
effects as-is with an explicit inline `eslint-disable` and a comment
explaining the SSR/hydration-mismatch reasoning, because there they solve a
real correctness problem the lint rule doesn't model.

**Why:** Silencing a lint rule everywhere it fires, without reading why it
fired, is how real bugs get shipped. Two of the four flagged sites had an
easy, better structure; two didn't, and forcing them into the "preferred"
shape would have introduced a hydration bug to satisfy a linter. See the
inline comments in `src/state/app-state.tsx`.
