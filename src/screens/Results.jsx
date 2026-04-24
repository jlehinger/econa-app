import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { scoreToBand, computeDomainScores } from '../data/questions.js'

export default function Results() {
  const navigate = useNavigate()
  const { answers, score, band: bandKey } = useAssessmentStore()
  const [animated, setAnimated] = useState(false)
  const [scoreVisible, setScoreVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setScoreVisible(true), 200)
    const t2 = setTimeout(() => setAnimated(true), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const domains = computeDomainScores(answers)
  const total = domains.d1 + domains.d2 + domains.d3 + domains.d4
  const band = scoreToBand(total)

  if (!band || !bandKey) {
    navigate('/ewc/intro')
    return null
  }

  const domainCards = [
    { label: 'Thriving & Satisfaction', score: domains.d1, max: 8,  color: 'var(--flame)',    desc: 'How fully you feel you are thriving and satisfied with life.' },
    { label: 'Effectiveness',           score: domains.d2, max: 8,  color: 'var(--teal)',     desc: 'How effectively you are operating in personal life and as a founder.' },
    { label: 'Burnout & Emotions',      score: domains.d3, max: 8,  color: 'var(--ember)',    desc: 'Frequency of burnout symptoms and negative emotions in the past month.' },
    { label: 'Sleep & Recovery',        score: domains.d4, max: 4,  color: 'var(--vitality)', desc: 'How much sleep issues are affecting your performance and cognition.' },
  ]

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Hero section */}
      <div style={{
        padding: '52px 28px 40px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: `radial-gradient(ellipse at 50% 0%, ${band.color}18 0%, transparent 70%)`,
      }}>
        <EconaLogo size="sm" />

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--teal-light)',
          margin: '20px 0 6px',
        }}>
          Your Results
        </div>

        {/* Score display */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 8,
          transform: scoreVisible ? 'scale(1)' : 'scale(0.8)',
          opacity: scoreVisible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 96,
            fontWeight: 700,
            color: band.color,
            lineHeight: 1,
            textShadow: `0 0 40px ${band.color}60`,
          }}>
            {total}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: 'rgba(255,255,255,0.25)',
            marginBottom: 14,
          }}>
            /28
          </span>
        </div>

        {/* Band name */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: band.color,
          marginBottom: 32,
          opacity: scoreVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}>
          {band.label}
        </div>

        {/* Gradient spectrum bar */}
        <div style={{ maxWidth: 360, margin: '0 auto', position: 'relative' }}>
          <div style={{
            height: 10,
            borderRadius: 5,
            background: 'linear-gradient(to right, #E05252 0%, #E8803C 28%, #E8981D 48%, #8AC878 72%, #4CAF82 100%)',
            position: 'relative',
            marginBottom: 10,
          }}>
            {/* Marker dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: animated ? `${band.curvePosition}%` : '0%',
              transform: 'translate(-50%, -50%)',
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff',
              border: `3px solid ${band.color}`,
              boxShadow: `0 0 0 4px ${band.color}40, 0 2px 8px rgba(0,0,0,0.4)`,
              transition: 'left 1s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: '#E05252' }}>Distress</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Strain · Stability</span>
            <span style={{ color: '#4CAF82' }}>Vitality</span>
          </div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div style={{ padding: '32px 24px 0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
          By Domain
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {domainCards.map(d => (
            <div
              key={d.label}
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                padding: '16px 18px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  {d.label}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                  {d.score}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/{d.max}</span>
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{
                  height: '100%',
                  width: animated ? `${(d.score / d.max) * 100}%` : '0%',
                  background: d.color,
                  borderRadius: 2,
                  transition: 'width 1.2s ease 0.3s',
                }} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* What this means */}
        <div style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`,
          border: `1px solid ${band.color}25`,
          borderLeft: `3px solid ${band.color}`,
          borderRadius: 12,
          padding: '22px 20px',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: band.color, marginBottom: 12 }}>
            What This Means
          </div>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 17,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.75,
            fontWeight: 300,
          }}>
            {band.description}
          </p>
        </div>

        <button
          onClick={() => navigate('/ewc/resources')}
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
            marginBottom: 12,
            boxShadow: '0 4px 20px rgba(232,152,29,0.3)',
            letterSpacing: '0.03em',
          }}
        >
          See Your Resources →
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)',
            borderRadius: 14,
            padding: '16px',
            fontSize: 14,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-body)',
            marginBottom: 48,
          }}
        >
          Go to Dashboard
        </button>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.7, paddingBottom: 32 }}>
          This is a screening instrument, not a clinical diagnostic.<br />
          Results are for your personal awareness only.
        </p>
      </div>
    </div>
  )
}
