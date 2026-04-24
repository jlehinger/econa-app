import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

const BAND_META = {
  distress:  { label: 'Distress Zone',  color: '#E05252', bg: 'rgba(224,82,82,0.1)',   headline: "You're carrying something heavy right now.", sub: "This is not a character flaw — the research shows founder mental health challenges are common, under-addressed, and highly treatable. You deserve support designed for the entrepreneurial experience." },
  strain:    { label: 'Strain Zone',    color: '#E8981D', bg: 'rgba(232,152,29,0.1)',  headline: "The pressure is real. Let's get you the right tools.", sub: "Founders who address strain early perform better and build more sustainably. Below are three concrete steps you can take starting today." },
  stability: { label: 'Stability Zone', color: '#3FA4B5', bg: 'rgba(63,164,181,0.1)', headline: "You're holding steady. Let's help you go further.", sub: "Stability is a foundation, not a ceiling. These resources are designed to help high-performing founders optimize and sustain." },
  vitality:  { label: 'Vitality Zone',  color: '#4CAF82', bg: 'rgba(76,175,130,0.1)', headline: "You're in a strong place — and you can amplify that.", sub: "High-vitality founders who give back create resilient communities. Lead, connect, and help build the ecosystem." },
}

const RESOURCES = {
  distress: [
    {
      color: '#E05252',
      title: 'Connected Mind — Clinician Booking',
      body: "Econa's clinical partner. Vetted therapists and coaches who specialize in entrepreneurial mental health. Free initial consultation — no referral needed.",
      cta: 'Book a Free Consultation',
      link: 'https://connectedmind.com',
      highlight: true,
    },
    {
      color: '#E8803C',
      title: '988 Suicide & Crisis Lifeline',
      body: 'Call or text 988 anytime, 24/7. For entrepreneurs and all individuals experiencing crisis. Confidential, free, immediate.',
      cta: 'Call or Text 988',
      link: 'https://988lifeline.org',
    },
    {
      color: '#3FA4B5',
      title: 'Econa Crisis Support',
      body: 'Resources and vetted practitioners who understand the entrepreneurial experience at clinical depth. You do not have to navigate this alone.',
      cta: 'Find Support at Econa',
      link: 'https://econa.net',
    },
    {
      color: '#E8981D',
      title: 'Read the Research',
      body: 'Understanding the science behind why founders experience these challenges at higher rates can itself reduce shame and accelerate recovery.',
      cta: 'Read the Study',
      link: 'https://econa.net',
    },
  ],
  stability: [
    {
      color: '#3FA4B5',
      title: 'FounderScreen',
      body: 'Contribute to the first-ever global entrepreneur wellbeing dataset. Track your wellbeing longitudinally and unlock deeper personalized insights.',
      cta: 'Join FounderScreen',
      link: 'https://econa.net',
    },
    {
      color: '#E8981D',
      title: 'Econa Programs',
      body: 'Keynotes, workshops, and retreats that give you tools to sustain and grow from your current stable foundation.',
      cta: 'View Programs',
      link: 'https://econa.net',
    },
    {
      color: '#4CAF82',
      title: 'Econaclast Community',
      body: 'Connect with other stable and thriving founders. Build accountability, share practices, and grow together.',
      cta: 'Join the Community',
      link: 'https://econa.net',
    },
    {
      color: '#E05252',
      title: 'The Research',
      body: 'Understand what the science says about maintaining stability and preventing the drift toward strain many founders experience over time.',
      cta: 'Read the Study',
      link: 'https://econa.net',
    },
  ],
  vitality: [
    {
      color: '#4CAF82',
      title: 'Econaclast Community',
      body: "You're thriving — now help others get here. Join the Econaclast community: visionary entrepreneurs who give back and build the ecosystem.",
      cta: 'Join Econaclast',
      link: 'https://econa.net',
      highlight: true,
    },
    {
      color: '#E8981D',
      title: "Dr. Freeman's Programs",
      body: "Dr. Michael Freeman's keynote, workshop, and leadership programs for high-vitality founders ready to amplify impact and sustain their edge.",
      cta: 'Book Dr. Freeman',
      link: 'https://econa.net',
    },
    {
      color: '#3FA4B5',
      title: 'FounderScreen',
      body: "Join the global dataset and contribute to the future of founder wellbeing science. Your vitality data helps calibrate resources for others.",
      cta: 'Join FounderScreen',
      link: 'https://econa.net',
    },
  ],
}

const STRAIN_MODULES = [
  {
    step: 1,
    color: '#3FA4B5',
    title: 'Recovery Protocol',
    sub: 'Sleep & energy management',
    bullets: [
      'Set a consistent wake time — even on weekends',
      'Create a 30-minute phone-free wind-down ritual each night',
      'Track your sleep for 7 days to find your real baseline',
    ],
    cta: 'Sleep science at Econa',
    link: 'https://econa.net',
  },
  {
    step: 2,
    color: '#E8981D',
    title: 'Stress Processing',
    sub: 'Cognitive offload & reframe',
    bullets: [
      '5-minute morning brain dump — write everything, fix nothing',
      'Reframe ritual: "What is this moment asking of me?"',
      'Identify one thing within your control today and do it first',
    ],
    cta: 'Explore founder coaching',
    link: 'https://econa.net',
  },
  {
    step: 3,
    color: '#E05252',
    title: 'Connect & Seek Support',
    sub: 'Peer connection & professional resources',
    bullets: [
      'Reach out to one peer who genuinely understands the founder experience',
      'Explore Econa workshops designed specifically for founders under strain',
      'Schedule a free Connected Mind consultation — no referral needed',
    ],
    cta: 'Book a Connected Mind consult',
    link: 'https://connectedmind.com',
  },
]

function StandardCard({ r }) {
  return (
    <div style={{
      background: r.highlight ? `${r.color}08` : 'rgba(255,255,255,0.04)',
      border: r.highlight ? `1px solid ${r.color}35` : '1px solid rgba(255,255,255,0.07)',
      borderLeft: r.highlight ? `3px solid ${r.color}` : undefined,
      borderRadius: 14,
      padding: '20px 20px',
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${r.color}15`,
        border: `1px solid ${r.color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, opacity: 0.8 }} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: '#fff', marginBottom: 8 }}>
        {r.title}
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, marginBottom: 16 }}>
        {r.body}
      </p>
      <a
        href={r.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: r.color,
          textDecoration: 'none',
        }}
      >
        {r.cta} →
      </a>
    </div>
  )
}

function ModuleCard({ module }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${module.color}25`,
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          textAlign: 'left',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${module.color}18`,
          border: `1px solid ${module.color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 700,
          color: module.color,
        }}>
          {module.step}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-body)' }}>
            {module.title}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            {module.sub}
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {module.bullets.map((bullet, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: `${module.color}15`,
                  border: `1px solid ${module.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: module.color }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                  {bullet}
                </span>
              </div>
            ))}
          </div>
          <a
            href={module.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: module.color,
              textDecoration: 'none',
            }}
          >
            {module.cta} →
          </a>
        </div>
      )}
    </div>
  )
}

export default function Resources() {
  const navigate = useNavigate()
  const { band: bandKey } = useAssessmentStore()
  const [optIn, setOptIn] = useState(false)

  const bk = bandKey || 'stability'
  const bandObj = BAND_META[bk]
  const resourceList = RESOURCES[bk] || RESOURCES.stability
  const isStrain = bk === 'strain'

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 80,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <div style={{ padding: '48px 28px 0' }}>
        <EconaLogo size="sm" />

        {bandObj && (
          <div style={{
            background: `radial-gradient(ellipse at 0% 0%, ${bandObj.color}18, transparent 70%)`,
            border: `1px solid ${bandObj.color}25`,
            borderLeft: `3px solid ${bandObj.color}`,
            borderRadius: 12,
            padding: '20px 20px',
            margin: '24px 0 32px',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: `${bandObj.color}15`,
              border: `1px solid ${bandObj.color}30`,
              borderRadius: 100,
              padding: '4px 12px',
              marginBottom: 14,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: bandObj.color }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: bandObj.color }}>{bandObj.label}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: '#fff', fontWeight: 300, marginBottom: 10, lineHeight: 1.3 }}>
              {bandObj.headline}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              {bandObj.sub}
            </p>
          </div>
        )}

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
          {isStrain ? '3-Step Action Plan' : 'Matched Resources'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {isStrain
            ? STRAIN_MODULES.map((module) => <ModuleCard key={module.step} module={module} />)
            : resourceList.map((r, i) => <StandardCard key={i} r={r} />)
          }
        </div>

        {/* Research opt-in */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '18px 18px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            cursor: 'pointer',
          }}
          onClick={() => setOptIn(!optIn)}
        >
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            border: optIn ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
            background: optIn ? 'var(--flame)' : 'transparent',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
            transition: 'all 0.15s',
          }}>
            {optIn && (
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Contribute to Econa research</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              Share your anonymized data with the global Econa wellbeing dataset. No personal information is ever shared.
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, var(--ember), var(--flame))',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '18px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-body)',
            marginBottom: 48,
            boxShadow: '0 4px 20px rgba(232,152,29,0.3)',
            letterSpacing: '0.03em',
          }}
        >
          Go to Dashboard →
        </button>

        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.8, paddingBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Econa · Global Center of Excellence<br />for Entrepreneur Mental Wellness
        </p>
      </div>

      <NavBar />
    </div>
  )
}
