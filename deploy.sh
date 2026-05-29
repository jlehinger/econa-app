#!/usr/bin/env bash
#
# Econa EWC — canonical deploy script.
#
# This is the source of truth for deploying the app. Platform auto-deploy
# (Vercel building on git push to main) is a convenience mirror of this script,
# not a replacement for it. Run this to ship a production build by hand.
#
# Idempotent: safe to re-run. Vercel produces immutable deployments, so a
# repeat run with no source changes simply promotes an identical build.
#
# Prereqs:
#   - Node 22+ (see .nvmrc) and npm
#   - Vercel CLI authenticated (`npx vercel login`) and the project linked
#     (`.vercel/project.json` — created by `npx vercel link`)
#
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies"
npm install

echo "==> Building production bundle"
npm run build

echo "==> Deploying to Vercel (production)"
npx vercel deploy --prod --yes

echo "==> Done."
