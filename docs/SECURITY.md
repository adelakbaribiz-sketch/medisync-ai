# Security Review

Reviewed 2026-09-22 against the current codebase (frontend-only prototype, no
backend, no auth). Findings below are from an actual review of this
repository, not a generic template.

## Scope note

This prototype has an unusually small attack surface by design: no server
routes, no database, no authentication, and no third-party data submission.
Most standard web-app security categories are **not applicable** here, and
this document says so explicitly rather than padding the list.

## Findings

| Category | Finding | Status |
|---|---|---|
| Secrets in repo | `grep`-checked source for API keys, tokens, passwords, `Bearer` strings — none found. `.env.example` documents planned variables only; no `.env` file is committed (blocked by `.gitignore`). | ✅ Clean |
| Dependency vulnerabilities | `npm audit` (full and prod-only): 0 vulnerabilities across 359 packages at time of review. | ✅ Clean |
| XSS / `dangerouslySetInnerHTML` | Grepped for `dangerouslySetInnerHTML`, `eval(`, `document.write`, `innerHTML` — none found anywhere in `src/`. All rendered text goes through JSX's default escaping. | ✅ Clean |
| Injection (SQL/NoSQL/command) | No database, no server-executed queries, no shell execution from user input. Not applicable. | N/A |
| Authentication / Authorization | None implemented. There is nothing to authenticate into — no user accounts, no per-user server data. The Settings page's toggles are cosmetic/local only. **This must change before any real patient data is handled** — see below. | ⚠️ By design for this prototype, not production-ready |
| Sensitive data handling | The only persisted data is the demo medication list and patient profile, stored in the browser's own `localStorage`, never transmitted anywhere. No PII is collected. The patient profile fields (age, weight, eGFR, pregnancy, allergies) are realistic in *shape* but are the user's own test input, not real patient records — reinforced by UI copy ("Stored only in this browser"). | ✅ Consistent with a client-only demo |
| File upload | No file upload feature exists anywhere in the app. | N/A |
| API exposure | No API routes exist in this Next.js app (`src/app` contains no `route.ts` handlers). Nothing is exposed to scan. | N/A |
| CSRF | No state-changing server requests exist. Not applicable. | N/A |
| Clickjacking / security headers | Default Next.js headers only; no custom `Content-Security-Policy`, `X-Frame-Options`, etc. have been configured. Low risk for a static demo, but **must be added before any real deployment handling real data** — see Roadmap. | ⚠️ Not yet configured |
| Third-party script/tracking | None included. No analytics, no tracking pixels, no third-party fonts beyond Google's `next/font` (self-hosted at build time by Next.js, not a runtime third-party request). | ✅ Clean |

## What must change before this could touch real patient data

This list is intentionally explicit, because the gap between "portfolio demo"
and "handles real PHI" is large and should not be understated:

1. Real authentication and per-user authorization (e.g. via the OIDC/Keycloak
   approach in the original dossier), with server-side session handling.
2. A real backend with input validation at every boundary (the demo's
   client-only functions are not a security boundary).
3. Encryption at rest and in transit for any real patient data (HIPAA/GDPR
   requirement — see `PRODUCT_REQUIREMENTS.md` and the original dossier §8).
4. Server-side audit logging of who viewed/changed what.
5. A formal security review and likely a third-party penetration test before
   handling real PHI, independent of this document.
6. Security response headers (CSP, HSTS, X-Content-Type-Options, etc.)
   configured at the hosting/CDN layer.

None of this exists today. Do not connect this prototype to real patient data
or deploy it as a clinical tool.
