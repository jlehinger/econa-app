import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

// PLACEHOLDER — replace with Dr. Freeman's verbatim text (all items below)

// Item 1: sector dropdown — 23 categories pending Dr. Freeman's list
const SECTOR_OPTIONS = [
  '[Category 1]',
  '[Category 2]',
  '[Category 3]',
  '[Category 4]',
  '[Category 5]',
  '...23 total pending',
]

// Items 4–17: text input labels
const TEXT_ITEM_LABELS = [
  'Q4 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q5 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q6 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q7 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q8 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q9 — [Econometric question pending confirmation]',   // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q10 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q11 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q12 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q13 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q14 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q15 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q16 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
  'Q17 — [Econometric question pending confirmation]',  // PLACEHOLDER — replace with Dr. Freeman's verbatim text
]

const TEXT_KEYS = ['q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17']

const INITIAL_STATE = {
  sector: '',
  growth_a: 50,
  growth_b: 50,
  q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
  q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: '16px 18px',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: 10,
  fontFamily: 'var(--font-body)',
}

const inputStyle = {
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
}

export default function Econometrics() {
  const navigate = useNavigate()
  const { setEconometrics } = useAssessmentStore()
  const [data, setData] = useState(INITIAL_STATE)

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const handleContinue = () => {
    setEconometrics(data)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button
          onClick={() => navigate('/demographics')}
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
          ← About You
        </button>
        <EconaLogo size="sm" />
      </div>

      {/* Screen heading */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
        FounderScreen
      </div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, fontStyle: 'italic', color: '#fff', marginBottom: 8, fontWeight: 300, lineHeight: 1.15 }}>
        Your Business
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
        17 questions · ~3 min
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>

        {/* Item 1: Sector dropdown — PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
        <div style={cardStyle}>
          <label style={labelStyle}>
            Sector — [23 categories pending Dr. Freeman's list]
            {/* PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
          </label>
          <select
            value={data.sector}
            onChange={e => handleChange('sector', e.target.value)}
            style={{
              ...inputStyle,
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: 36,
              cursor: 'pointer',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--flame)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <option value="" style={{ background: '#111' }}>Select a sector…</option>
            {SECTOR_OPTIONS.map(opt => (
              <option key={opt} value={opt} style={{ background: '#111' }}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Item 2: Growth Indicator A — PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
        <div style={cardStyle}>
          <label style={labelStyle}>
            Growth Indicator A — [label pending]
            {/* PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={data.growth_a}
              onChange={e => handleChange('growth_a', Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--flame)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--flame)', fontFamily: 'var(--font-display)', minWidth: 32, textAlign: 'right' }}>
              {data.growth_a}
            </span>
          </div>
        </div>

        {/* Item 3: Growth Indicator B — PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
        <div style={cardStyle}>
          <label style={labelStyle}>
            Growth Indicator B — [label pending]
            {/* PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={data.growth_b}
              onChange={e => handleChange('growth_b', Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--flame)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--flame)', fontFamily: 'var(--font-display)', minWidth: 32, textAlign: 'right' }}>
              {data.growth_b}
            </span>
          </div>
        </div>

        {/* Items 4–17: text inputs */}
        {TEXT_KEYS.map((key, i) => (
          <div key={key} style={cardStyle}>
            <label style={labelStyle}>
              {TEXT_ITEM_LABELS[i]}
              {/* PLACEHOLDER — replace with Dr. Freeman's verbatim text */}
            </label>
            <input
              type="text"
              value={data[key]}
              onChange={e => handleChange(key, e.target.value)}
              placeholder="Your answer"
              style={inputStyle}
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
