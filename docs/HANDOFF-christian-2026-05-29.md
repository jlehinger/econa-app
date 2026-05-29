# Econa app — handoff notes for Christian (2026-05-29)

Quick orientation before you move/build the app. The app is a React 19 + Vite PWA
(React Router 7, Zustand). Auth + history are local-only stubs by design — the real
backend is yours. Build + lint are green; full assessment flow smoke-tested end to end.

## What changed recently (all on `main`, pushed)

**Correctness / review fixes (red-green pass):**
- SPA catch-all rewrite added to `vercel.json` (deep links were 404'ing on refresh).
- History domain breakdown fixed — `ResultDetail` now reads `entry.domainScores` (was
  `entry.domains`, always undefined).
- `Results` reads the stored score/domains instead of recomputing (no display-vs-archive drift).
- Double-advance race fixed in `EWCQuestion` (useRef mutex + cancel pending auto-advance timer
  on navigation) — no more duplicate history entries.
- `authStore.logout` now clears `villageStatus`/`villageJoinDate`.
- Settings research toggle initializes from stored consent and persists revocation (IRB).
- `assessmentStore` persist `version: 1` + migrate hook added.
- Connected Mind URL centralized in `src/lib/links.js`.
- Committed, idempotent `deploy.sh`; real README; `.worktrees`/`.vercel` eslint-ignored.
- `--legacy-peer-deps` removed; `vite-plugin-pwa` bumped to ^1.3.0 (clean install on Vite 8).

**Reconciliation to Dr. Freeman's published EWC (Apr-30 spec + IJEBR paper):**
- Tier labels → **Surviving / Striving / Driving / Thriving** (were Vitality/Stability/Strain/
  Distress). LABELS ONLY — internal band keys are still `vitality/stability/strain/distress`,
  so scoring logic and any persisted history are unaffected. Don't rename the keys.
- Band cutoffs: Surviving 0–12, Striving 13–16, Driving 17–21, Thriving 22–28 (confirmed).
- Score 13 shows an intentional borderline message (his verbatim) → /triage, while the primary
  CTA goes to /village. By design — not a bug. See the comment above `shouldTriage` in
  `src/data/questions.js`.
- Validation N: 313 → **314**. Citation: Freeman, Mazza, Johnson & Heinz (**2026**),
  IJEBR 32(5):1333–1354, DOI 10.1108/IJEBR-02-2025-0147.

> NOTE: the tier-name rename is pending Michael's confirmation Monday. It's label-only, so if
> he wants the V-words back it's a quick revert of commits `6be6e34` / `708277b`.

## Still pending (needs Dr. Freeman / team — not built yet)
- **Placeholder content** still ships on three screens: `Demographics` (10 Qs), `Econometrics`
  (16 items + the 23-sector dropdown), `PerceivedNeedForCare` (question + 4 labels + resources).
  These render literal `[pending]` text. PerceivedNeedForCare is currently unreachable
  (Econometrics → /ewc/intro skips it) — leave it unreachable until the content lands.
- **New PTSD / panic-disorder lab items + the CM rewrite** Michael is expecting from you.
- **BPAQ-SF triage cutoff** still provisional (≥45) — unconfirmed.
- **IRB approval + UC Berkeley/Wharton partnerships** must be real before Demographics/
  Econometrics collect research data (consent gate).

## Ownership / infra (yours)
- Repo: github.com/jlehinger/econa-app (transfer to you/shared org for PR + branch protection).
- Hosting: Vercel under the `justinedarice` team, live at `econa-app.vercel.app`. Domain is
  your call (Justine isn't handling it).
- Backend: auth/history stubbed; see `docs/supabase-integration.md`. Open decision in that doc:
  it targets Cognito + RDS, while the broader Darice platform plans use DynamoDB — resolve before building.
