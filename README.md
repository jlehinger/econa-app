# Econa — Entrepreneur Wellbeing Check (EWC)

A mobile-first PWA that delivers the **Entrepreneur Wellbeing Check (EWC)** — a
short, validated screening instrument for founder mental health, developed by
Dr. Michael A. Freeman (Freeman, Mazza, Johnson & Heinz, 2025; validated on 313
entrepreneurs). Users take a 7-question check, receive a banded score, and are
routed to matched resources, a clinical-triage path, or the Econa "Village."

> **Screening, not diagnosis.** The app states this throughout. The triage path
> (Distress-band scores) routes to Connected Mind for clinical follow-up.

## Tech stack

- **React 19** + **Vite** (PWA via `vite-plugin-pwa`)
- **React Router 7** (client-side routing — see SPA deploy note below)
- **Zustand** (state, persisted to `localStorage`)
- **Vercel** hosting

## Run locally

```bash
nvm use            # Node 22+ (see .nvmrc)
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run lint       # eslint
```

## Backend status (read before wiring auth)

Auth and assessment history are currently **local-only stubs** — there is no
server. `src/store/authStore.js` mints a client-side session and
`src/store/assessmentStore.js` persists results to `localStorage`. A Supabase
client is present but **not wired in**.

The intended real backend is AWS. See [`docs/supabase-integration.md`](docs/supabase-integration.md)
for the drop-in Supabase path and the SQL schema. **Open decision:** that doc
targets Cognito + RDS, while the broader Darice platform plans use Cognito +
DynamoDB + AppSync. Resolve which before building the backend.

When real auth lands, note that `PrivateRoute` (in `src/App.jsx`) currently gates
on `user` presence only — the `verified` and `isQualified` flags are set but not
enforced. The `/verify` screen performs founder qualification, not email
verification. Both are flagged in-code as handoff TODOs.

## Deploy

Use the committed script — it is the canonical path:

```bash
./deploy.sh
```

Vercel also auto-deploys on push to `main`; that is a mirror of the script, not a
replacement. The project is linked via `.vercel/` (gitignored). `vercel.json`
includes the SPA catch-all rewrite required for React Router deep links to work
on refresh.

## Scoring model (where the clinical logic lives)

All scoring is in [`src/data/questions.js`](src/data/questions.js):

- 7 items, 0–4 each → **28-point total**, across 3 domains (Wellbeing /28-derived,
  Occupational, Emotional Stability).
- Bands: Distress **0–12**, Strain **13–16**, Stability **17–21**, Vitality **22–28**.
- Triage fires at score **≤ 12** (`shouldTriage`).
- Items Q4–Q6 carry a descriptive `reversed` flag, but their option **values are
  already pre-scored in the correct direction** — the scoring functions apply no
  reversal transform. Do not add one (see the comment in `questions.js`).

> Some boundary/routing questions (the exact score-12 vs score-13 messaging) are
> pending Dr. Freeman's confirmation. The Demographics / Econometrics /
> Perceived-Need screens contain placeholder question text awaiting his content.

## Layout

```
src/
  data/        questions.js (scoring + bands), labs.js
  store/       authStore.js, assessmentStore.js (Zustand + persist)
  screens/     one file per route
  components/  NavBar, ProgressBar, ScreenWrapper, EconaLogo
  lib/         links.js (canonical external URLs)
```
