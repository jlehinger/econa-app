import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

const DOMAINS = [
  { icon: '◆', label: 'Thriving & Satisfaction', desc: "How fully you're living, thriving, and satisfied with life", color: '#E8981D', bg: 'rgba(232,152,29,0.08)' },
  { icon: '◆', label: 'Effectiveness',           desc: "How you're performing in life and work as a founder",        color: '#3FA4B5', bg: 'rgba(63,164,181,0.08)' },
  { icon: '◆', label: 'Burnout & Emotions',      desc: 'Frequency of burnout and negative emotional experiences',    color: '#C4621A', bg: 'rgba(196,98,26,0.08)' },
  { icon: '◆', label: 'Sleep & Recovery',        desc: 'How sleep issues are affecting your work and cognition',     color: '#4CAF82', bg: 'rgba(76,175,130,0.08)' },
]

const BANDS = [
  { label: 'Distress',  range: '0–11',  color: '#E05252', bg: 'rgba(224,82,82,0.1)' },
  { label: 'Strain',    range: '12–16', color: '#E8981D', bg: 'rgba(232,152,29,0.1)' },
  { label: 'Stability', range: '17–21', color: '#3FA4B5', bg: 'rgba(63,164,181,0.1)' },
  { label: 'Vitality',  range: '22–28', color: '#4CAF82', bg: 'rgba(76,175,130,0.1)' },
]

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
      padding: '64px 28px 56px',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <EconaLogo size="md" />

      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, fontStyle: 'italic', color: '#fff', margin: '24px 0 12px', fontWeight: 300, lineHeight: 1.15 }}>
        The Entrepreneur<br />Wellbeing Check
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        {[['7', 'Questions'], ['~3 min', 'Duration'], ['4', 'Domains']].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--flame)', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Anonymity callout */}
      <div style={{
        background: 'rgba(63,164,181,0.08)',
        border: '1px solid rgba(63,164,181,0.2)',
        borderLeft: '3px solid var(--teal)',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 36,
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.6,
      }}>
        <span style={{ color: 'var(--teal-light)', fontWeight: 600 }}>Anonymity is architectural, not a policy.</span>{' '}
        Your responses are never linked to your identity.
      </div>

      {/* Domains */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>
        4 Domains Measured
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
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Result bands */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>
        Your Result Falls in One of 4 Bands
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 44 }}>
        {BANDS.map(b => (
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
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{b.range}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleBegin}
        style={{
          background: 'linear-gradient(135deg, var(--ember) 0%, var(--flame) 60%, var(--spark) 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          padding: '20px 32px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-body)',
          width: '100%',
          marginBottom: 20,
          boxShadow: '0 4px 24px rgba(232,152,29,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(232,152,29,0.45)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(232,152,29,0.35)' }}
      >
        Begin the Check →
      </button>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.7 }}>
        Freeman, Mazza, Johnson &amp; Heinz (2025).<br />
        Validated on 313 entrepreneurs across US, Canada, EU, UK &amp; Israel.
      </p>
    </div>
  )
}
