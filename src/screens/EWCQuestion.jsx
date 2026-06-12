import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { questions, scoreToBand, computeItemScores, computeDomainScores } from '../data/questions.js'

const TOTAL = questions.length

export default function EWCQuestion() {
  const { questionIndex } = useParams()
  const idx = parseInt(questionIndex, 10)
  const navigate = useNavigate()
  const { answers, setAnswer, setCurrentQuestion, setResult, addToHistory } = useAssessmentStore()
  const [selected, setSelected] = useState(answers[idx] !== undefined ? answers[idx] : null)
  const [advancing, setAdvancing] = useState(false)
  // Synchronous mutex: setAdvancing(true) is async, so a rapid tap + auto-advance
  // could both pass an `if (advancing)` check and fire advance() twice — duplicating
  // the history entry on the last question. The ref flips synchronously.
  const advancingRef = useRef(false)
  // Holds the pending auto-advance timer so it can be cancelled on navigation.
  // The component instance is REUSED across questions (the route param changes but
  // it does not remount), so without this a stale timer from the previous question
  // fires after navigation and corrupts the shared mutex.
  const advanceTimer = useRef(null)
  const [prevIdx, setPrevIdx] = useState(idx)

  const question = questions[idx]

  // Reset per-question UI state when navigating between questions. Done during render
  // (React's recommended "adjust state on prop change" pattern) rather than in an effect.
  if (idx !== prevIdx) {
    setPrevIdx(idx)
    setSelected(answers[idx] !== undefined ? answers[idx] : null)
    setAdvancing(false)
  }

  useEffect(() => {
    setCurrentQuestion(idx)
    // Release the advance mutex for the new question (refs are mutated in effects,
    // not during render).
    advancingRef.current = false
    // Cancel any auto-advance still pending from the previous question.
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }
  }, [idx, setCurrentQuestion])

  if (!question) {
    navigate('/ewc/intro')
    return null
  }

  const advance = (value) => {
    if (advancingRef.current) return
    advancingRef.current = true
    setAdvancing(true)
    const nextIdx = idx + 1
    if (nextIdx < TOTAL) {
      setTimeout(() => navigate(`/ewc/q/${nextIdx}`), 320)
    } else {
      const allAnswers = { ...answers, [idx]: value }
      const itemScores = computeItemScores(allAnswers)
      const domainScores = computeDomainScores(allAnswers)
      const total = domainScores.wellbeing + domainScores.occupational + domainScores.emotional
      const band = scoreToBand(total)
      setResult(total, band.key, itemScores, domainScores)
      addToHistory({ date: new Date().toISOString(), score: total, band: band.key, itemScores, domainScores })
      setTimeout(() => navigate('/ewc/results'), 320)
    }
  }

  const handleSelect = (value) => {
    setSelected(value)
    setAnswer(idx, value)
    // Auto-advance after 400ms. Tracked so it can be cancelled on navigation.
    advanceTimer.current = setTimeout(() => advance(value), 400)
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
        <span style={{ color: 'var(--flame-bright)' }}>{boldWord}</span>
        <span>{parts[1]}</span>
      </>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
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
        <EconaLogo size="md" mark variant="color" />
        <span style={{ fontSize: 14, color: 'var(--ink-muted)', letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}>
          {idx + 1} / {TOTAL}
        </span>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/dashboard')}
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
          background: 'rgba(93,173,226,0.1)',
          border: '1px solid rgba(93,173,226,0.2)',
          borderRadius: 100,
          padding: '4px 12px',
          marginBottom: 20,
          alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--teal)' }}>
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
          color: 'var(--ink)',
        }}>
          {renderText()}
        </h2>

        {question.timeframe && (
          <p style={{
            fontSize: 14,
            color: 'var(--ink-muted)',
            letterSpacing: '0.05em',
            fontWeight: 600,
            marginBottom: 20,
            fontFamily: 'var(--font-body)',
          }}>
            {question.timeframe}
          </p>
        )}

        {question.context && (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 28,
            boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-muted)', marginBottom: 10 }}>
              {question.context.label}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {question.context.items.map((item, i) => (
                <li key={i} style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, paddingLeft: 18, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--flame)', fontSize: 13 }}>—</span>
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
                  background: 'var(--surface-2)',
                  border: isSelected
                    ? '2px solid var(--flame)'
                    : '1px solid var(--hairline)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  fontSize: 17,
                  color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontWeight: isSelected ? 600 : 400,
                  boxShadow: isSelected ? '0 2px 12px rgba(212,160,60,0.2)' : '0 2px 12px rgba(15,43,76,0.06)',
                }}
              >
                {/* Checkmark indicator */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: isSelected ? 'none' : '1.5px solid var(--hairline)',
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
        borderTop: '1px solid var(--hairline)',
        background: 'var(--surface-2)',
        backdropFilter: 'blur(8px)',
      }}>
        <button
          className="btn btn-ghost"
          onClick={handleBack}
        >
          ← Back
        </button>

        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Private</span>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={selected === null}
          style={{
            opacity: selected !== null ? 1 : 0.4,
            cursor: selected !== null ? 'pointer' : 'not-allowed',
          }}
        >
          {idx === TOTAL - 1 ? 'Results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
