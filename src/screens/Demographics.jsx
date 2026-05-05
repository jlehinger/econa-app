import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

// TODO: add per-question validation once question types confirmed by Dr. Freeman

const INITIAL_RESPONSES = {
  q1: '', q2: '', q3: '', q4: '', q5: '',
  q6: '', q7: '', q8: '', q9: '', q10: '',
}

const QUESTION_LABELS = [
  'Q1 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q2 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q3 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q4 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q5 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q6 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q7 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q8 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q9 — [Demographic question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q10 — [Demographic question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
]

const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']

export default function Demographics() {
  const navigate = useNavigate()
  const { setDemographics } = useAssessmentStore()
  const [responses, setResponses] = useState(INITIAL_RESPONSES)

  const handleChange = (key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }))
  }

  const handleContinue = () => {
    setDemographics(responses)
    navigate('/econometrics')
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button
          onClick={() => navigate('/verify')}
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
          ← Verify
        </button>
        <EconaLogo size="sm" />
      </div>

      {/* Screen heading */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
        FounderScreen
      </div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, fontStyle: 'italic', color: '#fff', marginBottom: 8, fontWeight: 300, lineHeight: 1.15 }}>
        About You
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
        10 questions · ~2 min
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {QUESTION_KEYS.map((key, i) => (
          <div
            key={key}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '16px 18px',
            }}
          >
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 10,
              fontFamily: 'var(--font-body)',
            }}>
              {QUESTION_LABELS[i]}
            </label>
            <input
              type="text"
              value={responses[key]}
              onChange={e => handleChange(key, e.target.value)}
              placeholder="Your answer"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 14,
                color: '#fff',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--flame)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        ))}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
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
          boxShadow: '0 4px 24px rgba(212,160,60,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(212,160,60,0.45)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,160,60,0.35)' }}
      >
        Continue →
      </button>
    </div>
  )
}
