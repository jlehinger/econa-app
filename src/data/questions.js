// EWC Questions — sourced from Econa EWC Portal Mockup
// Freeman, Mazza, Johnson & Heinz (2025). The Entrepreneur Well-Being Check.
// International Journal of Entrepreneurial Behavior & Research.
// Validated on 313 entrepreneurs across US, Canada, EU, UK & Israel.

export const questions = [
  {
    index: 0,
    domain: 'Wellbeing · Thriving',
    text: 'Are you thriving in your personal and professional life?',
    boldWord: 'thriving',
    timeframe: 'Consider the last month',
    context: null,
    options: [
      { label: 'Not at all',  value: 0 },
      { label: 'Very little', value: 1 },
      { label: 'Somewhat',    value: 2 },
      { label: 'Mostly',      value: 3 },
      { label: 'Completely',  value: 4 },
    ],
    reversed: false,
    domainKey: 'thriving',
  },
  {
    index: 1,
    domain: 'Wellbeing · Life Satisfaction',
    text: 'In general, how satisfied are you with your life?',
    boldWord: 'satisfied',
    timeframe: 'Consider the last month',
    context: null,
    options: [
      { label: 'Very dissatisfied', value: 0 },
      { label: 'Dissatisfied',      value: 1 },
      { label: 'Acceptable',        value: 2 },
      { label: 'Satisfied',         value: 3 },
      { label: 'Very Satisfied',    value: 4 },
    ],
    reversed: false,
    domainKey: 'thriving',
  },
  {
    index: 2,
    domain: 'Effectiveness · Personal Life',
    text: 'How would you rate your effectiveness in your personal life?',
    boldWord: 'effectiveness in your personal life',
    timeframe: null,
    context: {
      label: 'This includes',
      items: [
        'at home and in your community',
        'as a spouse or partner, as a parent, and as a member of your extended family',
        'with your friends, your neighbors, and with community organizations',
      ],
    },
    options: [
      { label: 'Poor',      value: 0 },
      { label: 'Fair',      value: 1 },
      { label: 'Good',      value: 2 },
      { label: 'Very good', value: 3 },
      { label: 'Excellent', value: 4 },
    ],
    reversed: false,
    domainKey: 'effectiveness',
  },
  {
    index: 3,
    domain: 'Effectiveness · At Work',
    text: 'How would you rate your effectiveness at work?',
    boldWord: 'effectiveness at work',
    timeframe: null,
    context: {
      label: 'This includes',
      items: [
        'as a founder/co-founder/leader, executive and manager',
        'as a coach and mentor, relationship builder, and business developer',
        'driving results like revenue growth, profitability, and innovation',
      ],
    },
    options: [
      { label: 'Poor',      value: 0 },
      { label: 'Fair',      value: 1 },
      { label: 'Good',      value: 2 },
      { label: 'Very good', value: 3 },
      { label: 'Excellent', value: 4 },
    ],
    reversed: false,
    domainKey: 'effectiveness',
  },
  {
    index: 4,
    domain: 'Challenges · Burnout',
    text: 'How often do you experience work-related burnout?',
    boldWord: 'work-related burnout',
    timeframe: null,
    context: {
      label: 'This includes',
      items: [
        'feeling depleted, exhausted, and overwhelmed at work',
        'feeling detached and disengaged from team members',
        'feeling futile or ineffective',
      ],
    },
    options: [
      { label: 'Always',    value: 0 },
      { label: 'Often',     value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Rarely',    value: 3 },
      { label: 'Never',     value: 4 },
    ],
    reversed: true,
    domainKey: 'burnout',
  },
  {
    index: 5,
    domain: 'Challenges · Emotional Wellbeing',
    text: 'How often have you experienced negative emotions?',
    boldWord: 'negative emotions',
    timeframe: null,
    context: {
      label: 'This could include',
      items: [
        'feeling tense, nervous, worried, anxious or upset',
        'feeling envious or insecure',
        'feeling hopeless, worthless, sad or depressed',
      ],
    },
    options: [
      { label: 'Always',    value: 0 },
      { label: 'Often',     value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Rarely',    value: 3 },
      { label: 'Never',     value: 4 },
    ],
    reversed: true,
    domainKey: 'burnout',
  },
  {
    index: 6,
    domain: 'Challenges · Sleep',
    text: 'How often have sleep issues caused problems for you at work?',
    boldWord: 'sleep issues',
    timeframe: null,
    context: {
      label: 'This could include',
      items: [
        'decreased energy, alertness, attention span or memory',
        'reduced enthusiasm, optimism, motivation, or creativity',
        'diminished coping, self-control or "people skills"',
        'fatigue, procrastination, irritability, or depression',
      ],
    },
    options: [
      { label: 'Always',    value: 0 },
      { label: 'Often',     value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Rarely',    value: 3 },
      { label: 'Never',     value: 4 },
    ],
    reversed: true,
    domainKey: 'sleep',
  },
]

// Score bands: total out of 28
// d1 = Q0+Q1 (Thriving & Satisfaction) max 8
// d2 = Q2+Q3 (Effectiveness) max 8
// d3 = Q4+Q5 (Burnout & Emotions) max 8
// d4 = Q6    (Sleep) max 4

export const BANDS = {
  vitality: {
    key: 'vitality',
    label: 'Vitality Zone',
    min: 22,
    max: 28,
    color: '#4CAF82',
    curvePosition: 85,
    description: 'Your results reflect strong overall wellbeing. Founders in this zone find that maintaining awareness and continuing proactive practices is what keeps them here. The science shows resilience is built, not given.',
  },
  stability: {
    key: 'stability',
    label: 'Stability Zone',
    min: 17,
    max: 21,
    color: '#3FA4B5',
    curvePosition: 62,
    description: 'Your results suggest a solid baseline with some areas carrying more weight than others. Many high-performing founders find themselves here — stable, but aware that something is costing more than it should. This is exactly when proactive attention is most valuable.',
  },
  strain: {
    key: 'strain',
    label: 'Strain Zone',
    min: 12,
    max: 16,
    color: '#E8981D',
    curvePosition: 40,
    description: 'Your results indicate meaningful strain in one or more areas. This is a signal worth taking seriously — not because something is wrong with you, but because founders who address strain early perform better and build more sustainably.',
  },
  distress: {
    key: 'distress',
    label: 'Distress Zone',
    min: 0,
    max: 11,
    color: '#E05252',
    curvePosition: 16,
    description: 'Your results suggest you may be experiencing significant distress. This is not a character flaw — the research shows founder mental health challenges are common, under-addressed, and highly treatable. You deserve support designed for the entrepreneurial experience.',
  },
}

export function scoreToBand(score) {
  if (score >= 22) return BANDS.vitality
  if (score >= 17) return BANDS.stability
  if (score >= 12) return BANDS.strain
  return BANDS.distress
}

export function computeDomainScores(answers) {
  const get = (i) => (answers[i] !== undefined ? answers[i] : 0)
  return {
    d1: get(0) + get(1),   // Thriving & Satisfaction /8
    d2: get(2) + get(3),   // Effectiveness /8
    d3: get(4) + get(5),   // Burnout & Emotions /8
    d4: get(6),            // Sleep /4
  }
}
