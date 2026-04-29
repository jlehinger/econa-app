import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

// PLACEHOLDER — resource list pending Dr. Freeman (Q8 in delivery email)
const RESOURCES = [
  {
    title: 'Connected Mind',
    body: '[Resource description pending]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
    cta: 'Learn More',
    link: 'https://connectedmind.com',
  },
  {
    title: 'Econa Support',
    body: '[Resource description pending]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
    cta: 'Find Support',
    link: 'https://econa.net',
  },
]

// PLACEHOLDER — 4 response labels pending Dr. Freeman (Q8 in delivery email)
const RESPONSE_LABELS = [
  '1 — [Response label pending]',
  '2 — [Response label pending]',
  '3 — [Response label pending]',
  '4 — [Response label pending]',
]

export default function PerceivedNeedForCare() {
  const navigate = useNavigate()
  const { setPerceivedNeed } = useAssessmentStore()
  const [selected, setSelected] = useState(null)

  const showResources = selected === 1 || selected === 2

  const handleContinue = () => {
    // TODO: decide with Dr. Freeman if this question should be required
    if (selected !== null) setPerceivedNeed(selected)
    navigate('/ewc/intro')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '20px 28px 56px',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <button
          onClick={() => navigate('/econometrics')}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            padding: '5px 12px',
            borderRadius: 100,
            letterSpacing: '0.05em',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          ← Your Business
        </button>
        <EconaLogo size="sm" />
      </div>

      {/* Eyebrow */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
        Before You Begin
      </div>

      {/* Question text */}
      {/* PLACEHOLDER — exact question text pending Dr. Freeman (Q8 in delivery email) */}
      <div style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 32,
        fontStyle: 'italic',
        color: '#fff',
        fontWeight: 300,
        lineHeight: 1.25,
        marginBottom: 40,
      }}>
        [Perceived need for care question — text pending Dr. Freeman confirmation]
      </div>

      {/* Four response buttons */}
      {/* PLACEHOLDER — 4 response labels pending Dr. Freeman (Q8 in delivery email) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {RESPONSE_LABELS.map((label, i) => {
          const value = i + 1
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => setSelected(value)}
              style={{
                background: isSelected ? 'rgba(232,152,29,0.1)' : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? '2px solid var(--flame)'
                  : '1.5px solid rgba(255,255,255,0.09)',
                borderRadius: 14,
                padding: '20px 22px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.65)',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Resource block — shown when 1 or 2 selected */}
      {showResources && (
        <div style={{
          background: 'rgba(63,164,181,0.07)',
          border: '1px solid rgba(63,164,181,0.2)',
          borderLeft: '3px solid var(--teal)',
          borderRadius: 12,
          padding: '20px 18px',
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
            marginBottom: 16,
            fontFamily: 'var(--font-body)',
          }}>
            Support is available
          </div>
          {/* PLACEHOLDER — resource list pending Dr. Freeman (Q8 in delivery email) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RESOURCES.map(resource => (
              <div
                key={resource.title}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4, fontFamily: 'var(--font-body)' }}>
                  {resource.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 10, fontFamily: 'var(--font-body)' }}>
                  {resource.body}
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--teal)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {resource.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue button — always active */}
      {/* TODO: decide with Dr. Freeman if this question should be required */}
      <button
        onClick={handleContinue}
        style={{
          background: 'linear-gradient(135deg, var(--ember) 0%, var(--flame) 60%, var(--spark) 100%)',
          color: selected !== null ? '#fff' : 'rgba(255,255,255,0.7)',
          border: 'none',
          borderRadius: 14,
          padding: '20px 32px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-body)',
          width: '100%',
          opacity: selected !== null ? 1 : 0.6,
          boxShadow: selected !== null ? '0 4px 24px rgba(232,152,29,0.35)' : 'none',
          transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
        }}
        onMouseEnter={e => {
          if (selected !== null) {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 32px rgba(232,152,29,0.45)'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = selected !== null ? '0 4px 24px rgba(232,152,29,0.35)' : 'none'
        }}
      >
        Continue to the Check →
      </button>
    </div>
  )
}
