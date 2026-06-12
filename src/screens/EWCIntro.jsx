import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { BANDS } from '../data/questions.js'

const DOMAINS = [
  { icon: '◆', label: 'Wellbeing',                desc: 'Thriving, life satisfaction, and social functioning as a founder', color: '#D4A03C', bg: 'rgba(212,160,60,0.08)' },
  { icon: '◆', label: 'Occupational Functioning', desc: 'Entrepreneurial self-efficacy and burnout at work',                color: '#5DADE2', bg: 'rgba(93,173,226,0.08)' },
  { icon: '◆', label: 'Emotional Stability',      desc: 'Negative emotionality and the impact of sleep impairments',       color: '#E07B54', bg: 'rgba(224,123,84,0.08)' },
]

// Band labels/colors/ranges come from the one scale in questions.js — never redefine them locally.
const BAND_CHIPS = [...Object.values(BANDS)].reverse().map(b => ({
  label: b.label,
  range: `${b.min}–${b.max}`,
  color: b.color,
  bg: `${b.color}1A`,
}))

export default function EWCIntro() {
  const navigate = useNavigate()
  const { resetAssessment } = useAssessmentStore()

  const handleBegin = () => {
    resetAssessment()
    navigate('/ewc/q/0')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '20px 28px 100px',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>
        <EconaLogo size="sm" />
      </div>

      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, fontStyle: 'italic', color: '#fff', margin: '24px 0 12px', fontWeight: 400, lineHeight: 1.15 }}>
        The Entrepreneur<br />Wellbeing Check
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        {[['7', 'Questions'], ['~3 min', 'Duration'], ['3', 'Domains']].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--flame)', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Anonymity callout */}
      <div style={{
        background: 'rgba(93,173,226,0.08)',
        border: '1px solid rgba(93,173,226,0.2)',
        borderLeft: '3px solid var(--teal)',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 36,
        fontSize: 13,
        color: 'rgba(255,255,255,0.82)',
        lineHeight: 1.6,
      }}>
        <span style={{ color: 'var(--teal-light)', fontWeight: 600 }}>Anonymity is architectural, not a policy.</span>{' '}
        Your responses are never linked to your identity.
      </div>

      {/* Domains */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.68)', marginBottom: 14 }}>
        3 domains measured
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
        {DOMAINS.map(d => (
          <div
            key={d.label}
            style={{
              background: d.bg,
              border: `1px solid ${d.color}25`,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <span style={{ color: d.color, fontSize: 9, marginTop: 4, flexShrink: 0 }}>{d.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Result bands */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.68)', marginBottom: 14 }}>
        Your result falls in one of 4 bands
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 44 }}>
        {BAND_CHIPS.map(b => (
          <div
            key={b.label}
            style={{
              background: b.bg,
              border: `1px solid ${b.color}35`,
              borderRadius: 100,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: b.color }}>{b.label}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)' }}>{b.range}</span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={handleBegin}
        style={{
          marginBottom: 20,
        }}
      >
        Begin the Check →
      </button>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)', textAlign: 'center', lineHeight: 1.7 }}>
        Freeman, Mazza, Johnson &amp; Heinz (2026).<br />
        Validated on 314 entrepreneurs across US, Canada, EU, UK &amp; Israel.
      </p>

      <NavBar />
    </div>
  )
}
