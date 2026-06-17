// Econa Labs — one lab per EWC item (indices 0-6)
// Phase 1 content: Burnout (4), Sleep (6), Emotional Regulation (5) have full content
// Phase 2 labs (0-3) are available: false with null content sections (content pending Dr. Freeman)

import { TRAUMA_LAB_CONTENT } from './trauma.js'

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
    assessment: {
      instrumentName: 'Flourishing Scale (Diener & Biswas-Diener)',
      description: 'An 8-item measure of psychological well-being and flourishing — sense of purpose, supportive relationships, engagement, contribution to others, competence, being a good person, optimism, and being respected.',
      scoring: 'Each item rated 1 (Strongly disagree) to 7 (Strongly agree). Sum all 8 items: 8–56. Higher scores indicate more psychological resources and strengths.',
      citation: 'Diener, E. & Biswas-Diener, R. (2009). Flourishing Scale. © Ed Diener and Robert Biswas-Diener, January 2009.',
      trackingNote: 'Retake quarterly. Thriving is a slow-moving dimension — give interventions time.',
    },
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
    color: '#5DADE2',
    phase: 2,
    available: false,
    tagline: 'Reconnect with what matters.',
    assessment: {
      instrumentName: 'Satisfaction with Life Scale (SWLS)',
      description: 'A 5-item validated measure of cognitive life satisfaction — how close life is to one\'s ideal, life conditions, satisfaction with life, getting what one wants, and whether one would change anything. Includes a 6th attention-check item for data quality.',
      scoring: 'Each item rated 1 (Strongly disagree) to 7 (Strongly agree). Sum items 1–5 (ignore item 6 attention check): 5–35. 31–35: highly satisfied · 26–30: satisfied · 21–25: slightly satisfied · 20: neutral · 15–19: slightly dissatisfied · 10–14: dissatisfied · 5–9: extremely dissatisfied.',
      citation: 'Diener, E., Emmons, R.A., Larsen, R.J., & Griffin, S. (1985). The Satisfaction with Life Scale. Journal of Personality Assessment, 49, 71–75.',
      trackingNote: 'Retake every 2–3 months. Life satisfaction shifts slowly with sustained practice.',
    },
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
    assessment: {
      instrumentName: 'PROMIS Global Health — Social Functioning Items (Global05 + Global09)',
      description: 'Two items from the PROMIS Global Health scale measuring social satisfaction and role functioning. Global05 asks about satisfaction with social activities and relationships; Global09 asks how well you carry out usual social activities and roles at home, work, and in community.',
      scoring: 'Each item rated 1–5 (Likert). Higher scores = better social functioning.',
      citation: 'Patient-Reported Outcome Measurement Information System (PROMIS; Alonso et al., 2013).',
      trackingNote: 'Retake with each EWC check-in.',
    },
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
    color: '#D4A03C',
    phase: 2,
    available: false,
    tagline: 'Rebuild your founder confidence.',
    assessment: {
      instrumentName: 'Zhao, Seibert and Hills Entrepreneurial Self-Efficacy Scale',
      description: 'A 4-item validated measure of confidence in core entrepreneurial tasks: identifying new business opportunities, creating new products, thinking creatively, and commercializing an idea or new development.',
      scoring: 'Each item rated 1 (No confidence) to 5 (Complete confidence). Sum or average for overall score.',
      citation: 'Zhao, H., Seibert, S.E., & Hills, G.E. (2005). The mediating role of self-efficacy in the development of entrepreneurial intentions. Journal of Applied Psychology, 90(6), 1265–1272.',
      trackingNote: 'Retake monthly. Useful for tracking confidence recovery after setbacks.',
    },
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
    color: '#E07B54',
    phase: 1,
    available: true,
    tagline: 'You can build without burning.',
    assessment: {
      instrumentName: 'Burnout Measure Short Form (BMS-10)',
      description: 'A 10-item validated measure of burnout used across professional populations. Rates frequency of feelings like being tired, hopeless, trapped, and worthless. Developed by Malach-Pines (2005).',
      scoring: 'Rate each of 10 items (1 = Never → 7 = Always). Add all scores and divide by 10. Up to 2.4: very low burnout · 2.5–3.4: danger signs · 3.5–4.4: burnout · 4.5–5.4: very serious problem · 5.5+: requires immediate professional help.',
      citation: 'Malach-Pines, A. (2005). The burnout measure, short version. International Journal of Stress Management, 12(1), 78–88.',
      trackingNote: 'Retake monthly to track recovery. Score ≥5.5 warrants immediate professional support.',
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
      instrumentName: 'GAD-7 · PHQ-9 · BPAQ-SF',
      description: 'Three validated instruments covering the full emotional regulation picture for founders: the GAD-7 (7-item anxiety screen), PHQ-9 (9-item depression screen), and the Buss-Perry Aggression Questionnaire Short Form (BPAQ-SF, 12-item anger-hostility measure). All three have clinical cutoff scores that trigger CM triage when exceeded.',
      scoring: 'GAD-7: Each item scored 0–3. Total 0–21. ≥10 = moderate anxiety → CM triage. PHQ-9: Each item scored 0–3. Total 0–27. ≥10 = moderate depression → CM triage. BPAQ-SF: Each item rated 1–5. Total 12–60. ≥45 = clinically significant aggression → CM triage.',
      citation: 'GAD-7: Spitzer, R.L. et al. (2006). A brief measure for assessing generalized anxiety disorder. Archives of Internal Medicine, 166(10), 1092–1097. PHQ-9: Kroenke, K., Spitzer, R.L., & Williams, J.B.W. (2001). Journal of General Internal Medicine, 16(9), 606–613. BPAQ-SF: Bryant, F.B., & Smith, B.D. (2001). Journal of Research in Personality, 35(2), 138–167.',
      trackingNote: 'Retake every 4–6 weeks. Use all three together — anxiety, depression, and anger-hostility often co-occur in high-pressure founder environments.',
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
    id: 'trauma',
    ewcIndex: null,        // No EWC item — routed by the trigger question, not an EWC score
    title: 'Trauma',
    subtitle: 'Entrepreneur PTSD & Business Trauma',
    domain: 'emotional',
    color: '#7E5A86',      // Calm plum — distinct, serious, complements navy/gold
    phase: 'draft',        // DRAFT — v2 intake built for review, pending Dr. Freeman's confirmation
    available: true,
    tagline: 'You are not alone in what you carry.',
    assessment: TRAUMA_LAB_CONTENT,
    action: null,
    better: null,
    resources: null,
    motivation: null,
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
      instrumentName: 'PROMIS Sleep-Related Impairment Short Form 8a',
      description: 'An 8-item validated measure of how much sleep problems affected functioning in the past 7 days — difficulty getting things done, feeling alert, feeling tired, concentration problems, irritability, and daytime sleepiness. From the NIH PROMIS Item Bank v1.0.',
      scoring: 'Each item rated 1 (Not at all) to 5 (Very much), except item 2 which is reversed (5 = Not at all). Sum all 8 items: 8–40. Higher scores = greater sleep-related impairment. Item 2 ("I felt alert when I woke up") scores 5→1.',
      citation: 'Yu, L., Buysse, D.J., Germain, A., Moul, D.E., Stover, A., Dodds, N.E., & Pilkonis, P.A. (2012). Development of Short Forms From the PROMIS Sleep Disturbance and Sleep-Related Impairment Item Banks. Behavioral Sleep Medicine, 10(1), 6–24. © 2008–2022 PROMIS Health Organization (PHO).',
      trackingNote: 'Retake weekly during active sleep work. Track trend across EWC check-ins.',
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
