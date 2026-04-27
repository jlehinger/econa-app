// Econa Labs — one lab per EWC item (indices 0-6)
// Phase 1 content: Burnout (4), Sleep (6), Emotional Regulation (5) have full content
// Phase 2 labs (0-3) are available: false with null content sections (content pending Dr. Freeman)

export const LABS = [
  {
    id: 'thriving',
    ewcIndex: 0,
    title: 'Thriving',
    subtitle: 'Vitality & Life Engagement',
    domain: 'wellbeing',
    color: '#4CAF82',
    phase: 2,
    available: false,
    tagline: 'Deepen what\'s working.',
    assessment: null,
    action: null,
    better: null,
    resources: null,
    motivation: null,
  },
  {
    id: 'life-satisfaction',
    ewcIndex: 1,
    title: 'Life Satisfaction',
    subtitle: 'Purpose & Fulfillment',
    domain: 'wellbeing',
    color: '#3FA4B5',
    phase: 2,
    available: false,
    tagline: 'Reconnect with what matters.',
    assessment: null,
    action: null,
    better: null,
    resources: null,
    motivation: null,
  },
  {
    id: 'social-functioning',
    ewcIndex: 2,
    title: 'Social Functioning',
    subtitle: 'Relationships & Community',
    domain: 'wellbeing',
    color: '#5DADE2',
    phase: 2,
    available: false,
    tagline: 'Build the village around you.',
    assessment: null,
    action: null,
    better: null,
    resources: null,
    motivation: null,
  },
  {
    id: 'self-efficacy',
    ewcIndex: 3,
    title: 'Entrepreneurial Self-Efficacy',
    subtitle: 'Confidence & Capability',
    domain: 'occupational',
    color: '#E8981D',
    phase: 2,
    available: false,
    tagline: 'Rebuild your founder confidence.',
    assessment: null,
    action: null,
    better: null,
    resources: null,
    motivation: null,
  },
  {
    id: 'burnout',
    ewcIndex: 4,
    title: 'Burnout',
    subtitle: 'Recovery & Sustainability',
    domain: 'occupational',
    color: '#C4621A',
    phase: 1,
    available: true,
    tagline: 'You can build without burning.',
    assessment: {
      instrumentName: 'Maslach Burnout Inventory — General Survey (MBI-GS)',
      description: 'The gold-standard burnout measure. 16 items across exhaustion, cynicism, and professional efficacy. Public domain short form available.',
      scoring: 'Exhaustion: 0-30 · Cynicism: 0-24 · Efficacy: 0-36. Higher exhaustion/cynicism + lower efficacy = burnout.',
      citation: 'Maslach, C., Jackson, S.E., & Leiter, M.P. (1996). MBI Manual (3rd ed.).',
      trackingNote: 'Retake monthly to track recovery trajectory.',
    },
    action: {
      headline: 'Three things you can do this week',
      interventions: [
        { title: 'Micro-recovery rituals', body: 'Schedule 3 deliberate 5-minute breaks per day. No screens. Research shows micro-recoveries reduce cortisol accumulation by up to 40%.', source: 'Sonnentag & Fritz, 2007' },
        { title: 'Single-tasking protocol', body: 'Block 90-minute deep work windows with phone off and notifications silenced. Multitasking increases cognitive load and accelerates burnout.', source: 'Leroy, 2009' },
        { title: 'Delegate one thing today', body: 'Identify one task you\'ve been holding that someone else could own. Releasing control is a skill that builds over time.', source: null },
      ],
    },
    better: {
      headline: 'Long-term practices that prevent burnout',
      practices: [
        { title: 'Values realignment', body: 'Quarterly review of which activities energize you vs. drain you. Burnout often signals values misalignment, not weakness.' },
        { title: 'Sustainable pace modeling', body: 'Treat capacity as a renewable resource: protect sleep, movement, and social connection as non-negotiables in your calendar.' },
        { title: 'Peer accountability', body: 'Connect with other founders who understand the pressure. Isolation accelerates burnout; community buffers it.' },
      ],
    },
    resources: {
      apps: [{ name: 'Headspace', url: 'https://headspace.com', note: 'Guided recovery meditations' }],
      books: [{ name: 'Burnout by Emily & Amelia Nagoski', note: 'Science-backed recovery framework' }],
      podcasts: [{ name: 'How I Built This (Guy Raz)', note: 'Normalizes the struggle' }],
      websites: [{ name: 'econa.net/burnout', url: 'https://econa.net', note: 'Econa burnout resources' }],
    },
    motivation: [
      'By taking breaks and time off, you actually get more done.',
      'The founders who last aren\'t the ones who never stop — they\'re the ones who know when to pause.',
      'Recovery isn\'t weakness. It\'s strategy.',
      'You\'ve overcome bigger challenges than this. You already have the mindset.',
      'Your team needs you sustainable, not just present.',
    ],
  },
  {
    id: 'emotional-regulation',
    ewcIndex: 5,
    title: 'Emotional Regulation',
    subtitle: 'Negative Emotionality & Resilience',
    domain: 'emotional',
    color: '#E05252',
    phase: 1,
    available: true,
    tagline: 'Feel it. Process it. Move forward.',
    assessment: {
      instrumentName: 'Difficulties in Emotion Regulation Scale — Short Form (DERS-16)',
      description: '16-item public domain scale measuring emotional regulation difficulties across 6 domains.',
      scoring: 'Total 16-80. Higher scores = greater difficulties. Subscales: Nonacceptance, Goals, Impulse, Awareness, Strategies, Clarity.',
      citation: 'Gratz, K.L. & Roemer, L. (2004). Journal of Psychopathology and Behavioral Assessment.',
      trackingNote: 'Retake every 6-8 weeks during active work.',
    },
    action: {
      headline: 'Immediate tools for intense moments',
      interventions: [
        { title: '5-4-3-2-1 grounding', body: 'When overwhelmed: name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Interrupts the emotional spiral.', source: 'Dialectical Behavior Therapy' },
        { title: 'Name it to tame it', body: 'Label the emotion with precision ("I notice I feel anxious about the investor meeting"). Naming reduces amygdala activation.', source: 'Lieberman et al., 2007' },
        { title: 'Physiological sigh', body: 'Double inhale through nose (fill fully, then sip more air), long slow exhale. Fastest way to shift out of stress response.', source: 'Huberman Lab, 2021' },
      ],
    },
    better: {
      headline: 'Building emotional resilience over time',
      practices: [
        { title: 'Emotion journaling', body: '5 minutes daily: what did I feel today, what triggered it, how did I respond, what would I do differently. Builds emotional vocabulary and self-awareness.' },
        { title: 'Somatic awareness practice', body: 'Movement-based practices (yoga, martial arts, dance) process stored stress from the body — what talk therapy can\'t always reach.' },
        { title: 'Therapeutic support', body: 'Entrepreneurs experience emotions at intensity levels the general population rarely encounters. A therapist who understands founders is worth the investment.' },
      ],
    },
    resources: {
      apps: [{ name: 'Woebot', url: 'https://woebothealth.com', note: 'CBT-based emotional support' }],
      books: [{ name: 'The Body Keeps the Score — Bessel van der Kolk', note: 'Understanding emotional-somatic connection' }],
      podcasts: [{ name: 'Ten Percent Happier', note: 'Science-grounded mindfulness' }],
      websites: [{ name: 'econa.net', url: 'https://econa.net', note: 'Econa emotional wellness resources' }],
    },
    motivation: [
      'Feeling things deeply is part of what makes you a great founder. The skill is learning to work with it.',
      'Many entrepreneurs work on changing their emotional patterns — it takes time and that\'s okay.',
      'Your emotional intelligence is a competitive advantage when you develop it.',
      'You can\'t think your way out of what you felt your way into. That\'s not weakness — it\'s how humans work.',
      'It\'s great that you\'re paying attention to this. Most founders don\'t.',
    ],
  },
  {
    id: 'sleep',
    ewcIndex: 6,
    title: 'Sleep & Recovery',
    subtitle: 'Sleep Impairments & Cognitive Performance',
    domain: 'emotional',
    color: '#6C5CE7',
    phase: 1,
    available: true,
    tagline: 'Sleep is your unfair advantage.',
    assessment: {
      instrumentName: 'Pittsburgh Sleep Quality Index (PSQI)',
      description: 'Gold-standard 19-item self-report assessing sleep quality over the past month. Public domain.',
      scoring: 'Score 0-21. ≤5: good sleep quality. >5: poor sleep quality. 7 component scores (subjective quality, latency, duration, efficiency, disturbances, medication, daytime dysfunction).',
      citation: 'Buysse, D.J. et al. (1989). Psychiatry Research, 28(2), 193-213.',
      trackingNote: 'Retake monthly. Track trend across EWC check-ins.',
    },
    action: {
      headline: 'This week: protect your sleep architecture',
      interventions: [
        { title: 'Anchor wake time', body: 'Set a consistent wake time — same time even on weekends. This is the highest-leverage sleep intervention and resets circadian rhythm within 3 days.', source: 'Walker, 2017' },
        { title: '30-minute wind-down ritual', body: 'No screens, no email, no pitches. Dim lights. The brain needs a gradual transition — it cannot switch off instantly like a machine.', source: 'Sleep Foundation' },
        { title: 'Temperature hack', body: 'Drop bedroom temperature to 65-68°F (18-20°C). Core body temperature must fall ~1°F to initiate sleep onset.', source: 'Harding et al., 2019' },
      ],
    },
    better: {
      headline: 'Sleep as a performance system',
      practices: [
        { title: 'Caffeine curfew', body: 'Cut caffeine by 1pm. Caffeine has a 5-7 hour half-life — an afternoon coffee still has 50% of its stimulant effect at midnight.' },
        { title: 'Morning light protocol', body: '10 minutes of outdoor light within 30 minutes of waking sets your circadian anchor and improves sleep 12-16 hours later.' },
        { title: 'Strategic napping', body: '20-minute naps (before 3pm) restore alertness without disrupting night sleep. "NASA naps" improve performance by 34%.' },
      ],
    },
    resources: {
      apps: [
        { name: 'Oura Ring / WHOOP', url: null, note: 'Sleep tracking hardware for data-driven founders' },
        { name: 'Sleep Cycle', url: 'https://sleepcycle.com', note: 'Smart alarm + sleep analysis' },
      ],
      books: [{ name: 'Why We Sleep — Matthew Walker', note: 'The science case for founder sleep' }],
      podcasts: [{ name: 'Huberman Lab: Sleep episodes', note: 'Evidence-based sleep protocols' }],
      websites: [{ name: 'sleepfoundation.org', url: 'https://sleepfoundation.org', note: 'Evidence-based sleep hygiene' }],
    },
    motivation: [
      'Every hour of sleep debt costs you cognitive performance that no amount of caffeine recovers.',
      'The best founders aren\'t the ones who sleep the least. They\'re the ones who protect their edge.',
      'Sleep is when your brain consolidates what you learned today into tomorrow\'s decisions.',
      'You wouldn\'t run your company on a server that\'s been up for 80 hours. Don\'t run yourself that way.',
      'One week of good sleep will show you what you\'ve been missing.',
    ],
  },
]

// Helper: get lab by EWC item index
export function getLabByIndex(ewcIndex) {
  return LABS.find(l => l.ewcIndex === ewcIndex) || null
}

// Helper: rank labs by user's lowest item scores (Phase 1 available labs first)
// Unavailable Phase 2 labs use Infinity so they sort after all real scores
export function rankedLabs(itemScores = []) {
  const scores = Array.isArray(itemScores) ? itemScores : []
  return LABS
    .map(lab => ({
      ...lab,
      userScore: lab.available ? (scores[lab.ewcIndex] ?? Infinity) : Infinity,
    }))
    .sort((a, b) => {
      if (a.available && !b.available) return -1
      if (!a.available && b.available) return 1
      return a.userScore - b.userScore
    })
}
