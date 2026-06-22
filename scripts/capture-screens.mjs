// capture-screens.mjs
// Re-captures every Econa app screen as a 1000x2000 PNG into the deliverable
// asset folders (Screen Catalog + Guided Tour).
//
// Usage:
//   1. Start the dev server in another terminal:  npm run dev   (http://localhost:5173)
//   2. node scripts/capture-screens.mjs
//
// Output:
//   <darice-strategies>/clients/econa/assets/catalog/   (01..34)
//   <darice-strategies>/clients/econa/assets/tour/       (01..12)
//
// The app persists state to localStorage (zustand/persist). We seed the two
// stores via page.addInitScript BEFORE every navigation so authed/completed
// screens render with realistic data. Envelope shape is {state:{...},version:1}
// to match zustand/persist + the store `version: 1`.

import { chromium } from 'playwright'
import { mkdirSync, existsSync, statSync } from 'node:fs'

const BASE = process.env.ECONA_BASE || 'http://localhost:5173'

const CATALOG_DIR = '/Users/jlehinger/Development/Cowork/darice-strategies/clients/econa/assets/catalog'
const TOUR_DIR = '/Users/jlehinger/Development/Cowork/darice-strategies/clients/econa/assets/tour'

const ISO = '2026-05-01T15:00:00.000Z'

const AUTH_STATE = {
  state: {
    user: { id: 'demo', email: 'founder@econa.net' },
    verified: true,
    isQualified: true,
    villageStatus: 'active',
    villageJoinDate: ISO,
  },
  version: 1,
}

const ASSESSMENT_STATE = {
  state: {
    answers: { 0: 2, 1: 3, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1 },
    currentQuestion: 7,
    completed: true,
    score: 13,
    band: 'striving',
    itemScores: [2, 3, 1, 2, 1, 2, 1],
    domainScores: { wellbeing: 6, occupational: 3, emotional: 4 },
    history: [
      {
        date: ISO,
        score: 13,
        band: 'striving',
        itemScores: [2, 3, 1, 2, 1, 2, 1],
        domainScores: { wellbeing: 6, occupational: 3, emotional: 4 },
      },
    ],
    labProgress: {},
    demographics: null,
    econometrics: null,
    perceivedNeed: 3,
    researchConsented: false,
    traumaResult: null,
  },
  version: 1,
}

// route -> filename (no extension) for each deliverable folder
const CATALOG = [
  ['01-splash', '/'],
  ['02-auth-create', '/auth'],
  ['03-auth-login', '/auth?mode=login'],
  ['04-verify', '/verify'],
  ['05-demographics', '/demographics'],
  ['06-econometrics', '/econometrics'],
  ['07-perceived-need', '/ewc/perceived-need'],
  ['08-intro', '/ewc/intro'],
  ['09-question-1', '/ewc/q/0'],
  ['10-question-2', '/ewc/q/1'],
  ['11-question-3', '/ewc/q/2'],
  ['12-question-4', '/ewc/q/3'],
  ['13-question-5', '/ewc/q/4'],
  ['14-question-6', '/ewc/q/5'],
  ['15-question-7', '/ewc/q/6'],
  ['16-results', '/ewc/results'],
  ['17-resources', '/ewc/resources'],
  ['18-dashboard', '/dashboard'],
  ['19-history', '/history'],
  ['20-result-detail', '/history/0'],
  ['21-settings', '/settings'],
  ['22-triage', '/triage'],
  ['23-village', '/village'],
  ['24-labs', '/labs'],
  ['25-lab-thriving', '/labs/thriving'],
  ['26-lab-resilience', '/labs/resilience'],
  ['27-lab-wellbeing', '/labs/wellbeing'],
  ['28-lab-people-skills', '/labs/people-skills'],
  ['29-lab-entrepreneuring', '/labs/entrepreneuring'],
  ['30-lab-burnout', '/labs/burnout'],
  ['31-lab-emotion-regulation', '/labs/emotion-regulation'],
  ['32-lab-trauma', '/labs/trauma'],
  ['33-lab-sleep', '/labs/sleep'],
  ['34-notfound', '/this-route-does-not-exist'],
]

const TOUR = [
  ['01-splash', '/'],
  ['02-verify', '/verify'],
  ['03-demographics', '/demographics'],
  ['04-intro', '/ewc/intro'],
  ['05-question', '/ewc/q/0'],
  ['06-results', '/ewc/results'],
  ['07-dashboard', '/dashboard'],
  ['08-labs', '/labs'],
  ['09-lab-burnout', '/labs/burnout'],
  ['10-history', '/history'],
  ['11-village', '/village'],
  ['12-triage', '/triage'],
]

const SEED = `
try {
  localStorage.setItem('econa-auth', ${JSON.stringify(JSON.stringify(AUTH_STATE))});
  localStorage.setItem('econa-assessment', ${JSON.stringify(JSON.stringify(ASSESSMENT_STATE))});
} catch (e) {}
`

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function captureSet(context, dir, set) {
  mkdirSync(dir, { recursive: true })
  const results = []
  for (const [name, route] of set) {
    const page = await context.newPage()
    await page.addInitScript(SEED)
    const url = BASE + route
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    } catch {
      // networkidle can hang on dev HMR sockets; fall back to load
      await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {})
    }
    await sleep(900) // entrance animations (~500ms) + settle
    const path = `${dir}/${name}.png`
    await page.screenshot({ path, clip: { x: 0, y: 0, width: 400, height: 800 } })
    const size = statSync(path).size
    results.push({ name, route, size })
    console.log(`  ${name.padEnd(28)} ${String(size).padStart(8)} B  ${route}`)
    await page.close()
  }
  return results
}

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 },
    deviceScaleFactor: 2.5, // -> 1000 x 2000 output
  })
  // Seed once at context level too, so any same-origin navigation is covered.
  await context.addInitScript(SEED)

  console.log('Catalog ->', CATALOG_DIR)
  const cat = await captureSet(context, CATALOG_DIR, CATALOG)
  console.log('Tour ->', TOUR_DIR)
  const tour = await captureSet(context, TOUR_DIR, TOUR)

  await browser.close()

  const all = [...cat, ...tour]
  const tiny = all.filter((r) => r.size < 15000)
  console.log(`\nCaptured ${all.length} screens (${cat.length} catalog + ${tour.length} tour).`)
  if (tiny.length) {
    console.log('WARNING — possibly blank/broken (<15KB):')
    tiny.forEach((r) => console.log(`  ${r.name} (${r.size} B)`))
  } else {
    console.log('All screens > 15KB.')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
