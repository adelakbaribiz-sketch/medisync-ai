# Deployment

## Current state

This prototype has been run and verified locally (`npm run dev` / `npm run
build` / `npm run start`) but has **not been deployed to any public hosting
environment**. No live demo URL exists yet.

## Recommended deployment path (not yet done)

Since this is a static-data Next.js app with no backend, database, or
environment secrets, it deploys as a standard Next.js app to any of:

- **Vercel** (simplest — zero-config for a stock `next build`).
- **Any Node host** capable of running `next build && next start`.
- **Static export** is *not* used here (`output: "export"` is not set in
  `next.config.ts`), because pages are Client Components relying on
  `localStorage`/browser APIs rather than pure static content — the default
  Next.js server runtime is the right fit, not static export.

## Steps (for whoever deploys this next)

```bash
npm install
npm run build
npm run start   # or hand the build output to your platform's Next.js adapter
```

No environment variables are required (see `.env.example`). No database
migrations, no seed data step — the demo dataset ships in the bundle.

## Before deploying somewhere public

- Add basic security headers at the hosting/CDN layer (see `SECURITY.md`).
- Decide whether to keep the "simulate a backend connection error" demo
  utility visible in a public deployment, or gate it behind a debug flag —
  it's currently always visible on the Dashboard, which is appropriate for a
  portfolio/reviewer audience but may be noise for an end-user-facing demo.
- Confirm the demo-data disclaimers remain visible; do not strip them to
  "clean up" the UI for a public link.
