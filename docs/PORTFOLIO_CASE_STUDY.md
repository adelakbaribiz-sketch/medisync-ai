# Portfolio Case Study

**Current status: Prototype / Demo.** Not Concept (there's working, tested
code), not MVP in the startup sense (no real backend or users), not
Production. See `HONEST_STATUS.md` for the full breakdown.

## What I built

A working AI-assisted drug interaction workspace: search and build a
medication list, see every pairwise interaction with severity, mechanism,
clinical effect, recommendation and cited evidence, visualize the
interaction network, and adjust guidance based on a patient's renal/hepatic
function and pregnancy status — all running against a curated, pharmacologically
accurate demo dataset with a fully responsive, empty/loading/error-state-aware
UI.

## Problem

Existing drug-interaction tools disagree with each other significantly,
rarely explain the *mechanism* behind an interaction, and rarely adjust for
the specific patient. General-purpose LLMs score poorly at this task
specifically. (See the competitive gap analysis in
`ORIGINAL_DOSSIER_FA.md` §2.)

## Approach

Rather than build a shallow version of the original dossier's full AI
platform (GNN + fine-tuned LLM + licensed DrugBank data + FHIR/EHR
integration — none of which is achievable without real data licenses, GPU
infrastructure, and a validation study), I scoped this delivery to what could
be built and **verified end-to-end today**: the complete product experience,
architected with a single, explicit seam (`src/lib/api.ts`) where a real
backend would plug in later without touching the UI layer.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. Client-side
state via React Context, persisted to `localStorage`. No server, no
database — see `ARCHITECTURE.md` for both what's implemented and the full
proposed production architecture from the original dossier.

## Key features

- Autocomplete drug search across an 18-drug demo catalog.
- Real-time severity summary and a dependency-free custom SVG interaction
  network graph.
- Expandable interaction detail with mechanism, recommendation, alternatives,
  and cited evidence strength.
- Patient-context adjustment: a transparent rule engine that escalates
  guidance for severe renal/hepatic impairment or pregnancy.
- A dedicated Evidence Library, filterable independent of the current list.
- Every empty, loading, and error state is designed and reachable — including
  a one-click "simulate a backend failure" demo utility.

## AI / technical framing

No AI model runs in this build. The "AI" in the product concept is the
*proposed* GNN + LLM + RAG engine documented in `ARCHITECTURE.md`; what
exists today is the product surface that engine would sit behind, plus a
data-access seam designed so swapping in a real model doesn't require
touching the UI. I chose to be explicit about this rather than fake AI output
from static lookups.

## Challenges

- **Deciding what *not* to build.** The dossier described a 5-phase, ~15-month
  platform. The hardest engineering decision was scoping down to something
  demonstrably real without quietly downgrading the ambition of the original
  idea — solved by documenting the full proposed architecture alongside what
  was actually shipped (`DECISIONS.md`).
- **A real layout bug.** During manual verification, the sidebar was found to
  scroll away with page content instead of staying fixed — a classic
  app-shell layout mistake (missing `h-full`/`overflow-y-auto` scroping).
  Fixed and documented in `TESTING.md` rather than silently patched.
- **A newer, stricter lint rule** (`react-hooks/set-state-in-effect`) flagged
  four effects; two were genuinely improvable (moved to derived state), two
  were legitimate hydration-safety patterns that needed a documented,
  scoped exception rather than a forced rewrite. See `DECISIONS.md` #7.

## Design decisions

See `DECISIONS.md` for the full list with reasoning: no real backend, real
pharmacology for demo content with honestly-labeled synthetic evidence,
client-only persistence, a hand-built SVG graph instead of a charting
library, and deferring dark mode rather than shipping it half-tested.

## Current status

**Prototype/Demo**, fully functional against demo data, build/lint/test/audit
all clean at time of writing (`TESTING.md`, `SECURITY.md`). Not deployed
publicly yet (`DEPLOYMENT.md`). Not connected to any real clinical data
source. Not reviewed by a licensed clinician or pharmacist.

## Limitations

See `LIMITATIONS.md` for the complete list — headline items are: no real AI
model, no live data sources, no automated UI test coverage, no
authentication, and evidence citations that are paraphrased demo content
rather than live-fetched sources.

## Future roadmap

See `ROADMAP.md` for the five-phase plan carried over from the original
dossier (real data integration → AI/model work → clinical/EHR integration →
regulatory → scale), plus near-term, dependency-free improvements to this
prototype itself (automated UI tests, dark mode, expanded demo dataset).
