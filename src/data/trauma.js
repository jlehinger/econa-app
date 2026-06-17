// ── Trauma Lab — intake instruments (v2, DRAFT) ─────────────────────────────
// Source: Dr. Michael A. Freeman memo, June 17, 2026 ("Trauma intake question +
// 2 Trauma Lab assessments v2"). Simplified, app-ready flow that supersedes the
// research-grade entrepreneur trauma scale.
//
// Flow: trigger → EB-PTSD-5 Part 1 (business exposure) → PC-PTSD-5 Part 1
// (general exposure) → shared Part 2 (5 symptom items) → scored result.
// Cut-point: ≥3 "Yes" on Part 2 = positive screen.
//
// DRAFT — five directions below are decided-but-unconfirmed (see OPEN_QUESTIONS).
// Nothing here is live; do not treat the assumptions as final until Michael
// confirms.

export const TRIGGER = {
  eyebrow: 'One more question',
  text: 'Have you ever experienced a significantly traumatic event — in your personal life, or in business?',
  help: 'This helps us point you to the right support. It’s confidential.',
}

export const EB_PTSD = {
  code: 'EB-PTSD-5',
  title: 'Econa Business Trauma Screen',
  provenance: 'Adapted from the validated PC-PTSD-5.',
  stem: 'Entrepreneurs sometimes go through work events that are especially frightening, horrible, or traumatic. For example:',
  examples: [
    'Business failure or bankruptcy',
    'Being pushed out of your business by the board',
    'Devastating personal financial loss',
    'Intense conflict with, or loss of, co-founders, investors, or key people',
    'A humiliating business-related scandal',
    'Losing a key relationship because business demands left you unavailable',
  ],
  gate: 'Have you ever experienced this kind of event?',
}

export const PC_PTSD = {
  code: 'PC-PTSD-5',
  title: 'Primary Care PTSD Screen',
  stem: 'Sometimes things happen that are unusually or especially frightening, horrible, or traumatic. For example:',
  examples: [
    'A serious accident or fire',
    'A physical or sexual assault or abuse',
    'An earthquake or flood',
    'A war',
    'Seeing someone be killed or seriously injured',
    'Having a loved one die through homicide or suicide',
  ],
  gate: 'Have you ever experienced this kind of event?',
}

// Shared Part 2 — applies to both instruments, scored once.
export const PART2 = {
  stem: 'In the past month, have you…',
  items: [
    'Had nightmares about the event(s) or thought about them when you didn’t want to?',
    'Tried hard not to think about the event(s), or avoided situations that reminded you of them?',
    'Been constantly on guard, watchful, or easily startled?',
    'Felt numb or detached from people, activities, or your surroundings?',
    'Felt guilty, or unable to stop blaming yourself or others, for the event(s)?',
  ],
}

export const CUT_POINT = 3 // Michael's choice — 3 = optimally sensitive (favors detection)

// Positive-screen message — Michael's exact copy.
export const POSITIVE_MESSAGE =
  'Your score indicates that you may be dealing with Post Traumatic Stress Disorder. Please take advantage of the recovery resources offered here. PTSD can have serious consequences, so we recommend that you discuss this with a licensed mental health clinician. We’ll email you information about how to find one, along with a written report of the assessment you just completed — please share that report with your clinician.'

// ── Scoring ─────────────────────────────────────────────────────────────────
// part2 = array of 5 booleans (true = "Yes"). Returns the screen outcome.
export function scoreTrauma({ exposed, part2 }) {
  if (!exposed) return { screen: 'none', symptomYes: 0 }
  const symptomYes = part2.filter(Boolean).length
  return { screen: symptomYes >= CUT_POINT ? 'positive' : 'negative', symptomYes }
}

// ── The five decided-but-unconfirmed directions (shown in-app as DRAFT) ──────
export const OPEN_QUESTIONS = [
  {
    h: 'Routing score “13”',
    body: 'We assumed the “score of 13 or less” that routes a user here is the EWC score (the trigger itself is only yes/no). Need: which score, its range, and whether lower = more distress.',
  },
  {
    h: 'Instrument name',
    body: 'Named the business screen EB-PTSD-5 (Michael’s memo also wrote EB-PTSD-50 once — read as a typo). Need: the canonical name.',
  },
  {
    h: 'Presenting EB-PTSD-5',
    body: 'The business screen reuses PC-PTSD-5’s validated symptom items with an entrepreneur-specific exposure list, labeled “adapted from the validated PC-PTSD-5.” Need: Michael & Sheri comfortable with that.',
  },
  {
    h: 'Shared Part 2 scoring',
    body: 'One combined symptom score (≥3 of 5) drives the result, regardless of which exposure(s) were endorsed. Need: confirm one combined result, not separate EB vs. PC scores.',
  },
  {
    h: 'Positive message + report',
    body: 'On a positive screen we email the user how to find a clinician + a written report. Need: confirm the copy and whether the report includes item-level answers.',
  },
]

// ── Lab-detail content (fills the trauma stub in labs.js) ────────────────────
export const TRAUMA_LAB_CONTENT = {
  instrumentName: 'EB-PTSD-5 + PC-PTSD-5 (two-screen intake)',
  description:
    'A short, confidential check-in: two brief exposure questions (one business, one general life) followed by five questions about the past month. Takes about two minutes.',
  scoring:
    'Three or more “Yes” answers on the five symptom questions flags a positive screen and recommends talking with a licensed clinician.',
  citation:
    'PC-PTSD-5: Prins et al. (2015, 2016); National Center for PTSD. EB-PTSD-5 is an Econa business-contextualized adaptation (draft).',
  trackingNote: 'Draft — pending Dr. Freeman’s confirmation of the open items.',
}
