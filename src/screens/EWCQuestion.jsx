import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { questions, scoreToBand, computeDomainScores } from '../data/questions.js'

const TOTAL = questions.length

export default function EWCQuestion() {
  const { questionIndex } = useParams()
  const idx = parseInt(questionIndex, 10)
  const navigate = useNavigate()
  const { answers, setAnswer, setCurrentQuestion, setResult, addToHistory } = useAssessmentStore()
  const [selected, setSelected] = useState(answers[idx] !== undefined ? answers[idx] : null)
  const [advancing, setAdvancing] = useState(false)

  const question = questions[idx]

  useEffect(() => {
    setCurrentQuestion(idx)
    setSelected(answers[idx] !== undefined ? answers[idx] : null)
    setAdvancing(false)
  }, [idx])

  if (!question) {
    navigate('/ewc/intro')
    return null
  }

  const advance = (value) => {
    if (advancing) return
    setAdvancing(true)
    const nextIdx = idx + 1
    if (nextIdx < TOTAL) {
      setTimeout(() => navigate(`/ewc/q/${nextIdx}`), 320)
    } else {
      const allAnswers = { ...answers, [idx]: value }
      const domains = computeDomainScores(allAnswers)
      const total = domains.d1 + domains.d2 + domains.d3 + domains.d4
      const band = scoreToBand(total)
      setResult(total, band.key)
      addToHistory({ date: new Date().toISOString(), score: total, band: band.key, domains })
      setTimeout(() => navigate('/ewc/results'), 320)
    }
  }

  const handleSelect = (value) => {
    setSelected(value)
    setAnswer(idx, value)
    // Auto-advance after 400ms
    setTimeout(() => advance(value), 400)
  }

  const handleNext = () => {
    if (selected === null) return
    advance(selected)
  }

  const handleBack = () => {
    if (idx === 0) {
      navigate('/ewc/intro')
    } else {
      navigate(`/ewc/q/${idx - 1}`)
    }
  }

  const renderText = () => {
    const { text, boldWord } = question
    if (!boldWord) return <span>{text}</span>
    const parts = text.split(boldWord)
    if (parts.length !== 2) return <span>{text}</span>
    return (
      <>
        <span>{parts[0]}</span>
        <span style={{ color: 'var(--spark)' }}>{boldWord}</span>
        <span>{parts[1]}</span>
      </>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      opacity: advancing ? 0.5 : 1,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header */}
      <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <EconaLogo size="sm" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}>
          {idx + 1} / {TOTAL}
        </span>
        <button
          onClick={() => navigate('/dashboard')}
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
          Exit ✕
        </button>
      </div>

      <ProgressBar current={idx + 1} total={TOTAL} />

      {/* Question body */}
      <div style={{ flex: 1, padding: '32px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* Domain badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(63,164,181,0.1)',
          border: '1px solid rgba(63,164,181,0.2)',
          borderRadius: 100,
          padding: '4px 12px',
          marginBottom: 20,
          alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--teal-light)' }}>
            {question.domain}
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(22px, 6vw, 28px)',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.4,
          letterSpacing: '0.01em',
          marginBottom: 12,
          color: '#fff',
        }}>
          {renderText()}
        </h2>

        {question.timeframe && (
          <p style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: 20,
            fontFamily: 'var(--font-body)',
          }}>
            {question.timeframe}
          </p>
        )}

        {question.context && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>
              {question.context.label}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {question.context.items.map((item, i) => (
                <li key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, paddingLeft: 18, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--flame)', fontSize: 10 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  background: isSelected
                    ? 'rgba(232,152,29,0.14)'
                    : 'rgba(255,255,255,0.04)',
                  border: isSelected
                    ? '2px solid var(--flame)'
                    : '1.5px solid rgba(255,255,255,0.09)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  fontSize: 14,
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontWeight: isSelected ? 600 : 400,
                  boxShadow: isSelected ? '0 2px 12px rgba(232,152,29,0.2)' : 'none',
                }}
              >
                {/* Checkmark indicator */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                  background: isSelected ? 'var(--flame)' : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        padding: '16px 24px calc(16px + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(28,28,46,0.95)',
        backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)',
            borderRadius: 10,
            padding: '11px 20px',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.03em',
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Private</span>

        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            background: selected !== null
              ? 'linear-gradient(135deg, var(--ember), var(--flame))'
              : 'rgba(255,255,255,0.08)',
            color: selected !== null ? '#fff' : 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: 10,
            padding: '11px 24px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: selected !== null ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s',
          }}
        >
          {idx === TOTAL - 1 ? 'Results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
