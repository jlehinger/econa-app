import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { CONNECTED_MIND_URL } from '../lib/links.js'

// Dr. Freeman's full mental-health resource list is still pending; these two
// entries are the confirmed starting points (CM triage pathway + Econa).
const RESOURCES = [
  {
    title: 'Connected Mind',
    body: 'A confidential, clinically validated mental health screening you can take in minutes, with a pathway to professional support.',
    cta: 'Learn More',
    link: CONNECTED_MIND_URL,
  },
  {
    title: 'Econa Support',
    body: 'Econa resources built for entrepreneurs — community, learning labs, and support designed around the entrepreneur experience.',
    cta: 'Find Support',
    link: 'https://econa.net',
  },
]

// Verbatim labels + values from Dr. Freeman's April 28 assessment bundle (p. 9).
// This item is NOT scored — it gates the self-care resource list (shown on 1 or 2).
const RESPONSE_OPTIONS = [
  { value: 4, label: 'No' },
  { value: 3, label: 'Not now' },
  { value: 2, label: "I'm somewhat interested" },
  { value: 1, label: "I'm interested and would like to learn more" },
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
      background: 'var(--surface)',
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
          className="btn btn-ghost"
          onClick={() => navigate('/econometrics')}
        >
          ← Your Business
        </button>
        <EconaLogo size="md" mark variant="color" />
      </div>

      {/* Eyebrow */}
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 20 }}>
        Before You Begin
      </div>

      {/* Question text — verbatim from Dr. Freeman's April 28 assessment bundle */}
      <div style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 28,
        color: 'var(--ink)',
        fontWeight: 400,
        lineHeight: 1.3,
        marginBottom: 40,
      }}>
        Would you like to obtain, or learn more about how to obtain mental health resources including those that address the needs of entrepreneurs?
      </div>

      {/* Four response buttons — verbatim labels, spec values (No=4 … interested=1) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }} role="radiogroup" aria-label="Would you like to obtain, or learn more about how to obtain mental health resources?">
        {RESPONSE_OPTIONS.map(({ value, label }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(value)}
              style={{
                background: 'var(--surface-2)',
                border: isSelected
                  ? '2px solid var(--flame)'
                  : '1px solid var(--hairline)',
                borderRadius: 14,
                padding: '20px 22px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 18,
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--flame)'
                  e.currentTarget.style.color = 'var(--ink)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--hairline)'
                  e.currentTarget.style.color = 'var(--ink-soft)'
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
          background: 'rgba(93,173,226,0.07)',
          border: '1px solid rgba(93,173,226,0.2)',
          borderLeft: '3px solid var(--teal)',
          borderRadius: 12,
          padding: '20px 18px',
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
            marginBottom: 16,
            fontFamily: 'var(--font-body)',
          }}>
            Support is available
          </div>
          {/* Full resource list still pending Dr. Freeman — see docs/HANDOFF */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RESOURCES.map(resource => (
              <div
                key={resource.title}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>
                  {resource.title}
                </div>
                <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 10, fontFamily: 'var(--font-body)' }}>
                  {resource.body}
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 15,
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
        className="btn btn-primary btn-block"
        onClick={handleContinue}
        style={{
          opacity: selected !== null ? 1 : 0.6,
        }}
      >
        Continue to the Check →
      </button>
    </div>
  )
}
