import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { scoreToBand, shouldTriage } from '../data/questions.js'

export default function Results() {
  const navigate = useNavigate()
  // Read the score/domains persisted by setResult at completion — authoritative and
  // identical to what was written to history. (Recomputing from `answers` here could
  // diverge if the user back-navigated and changed an answer after completing.)
  const { score: total, band: bandKey, domainScores: domains } = useAssessmentStore()
  const [animated, setAnimated] = useState(false)
  const [scoreVisible, setScoreVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setScoreVisible(true), 200)
    const t2 = setTimeout(() => setAnimated(true), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const triage = shouldTriage(total)
  const band = scoreToBand(total)

  if (!band || !bandKey) {
    navigate('/ewc/intro')
    return null
  }

  const domainCards = [
    { label: 'Wellbeing',               sublabel: 'Thriving · Satisfaction · Social',   score: domains.wellbeing,    max: 12, color: 'var(--flame)',    desc: 'How fully you are thriving, satisfied with life, and engaged socially.' },
    { label: 'Occupational Functioning', sublabel: 'Self-Efficacy · Burnout',           score: domains.occupational, max: 8,  color: 'var(--teal)',     desc: 'Your entrepreneurial confidence and freedom from burnout.' },
    { label: 'Emotional Stability',      sublabel: 'Emotional Regulation · Sleep',      score: domains.emotional,    max: 8,  color: 'var(--ember)',    desc: 'Frequency of negative emotions and sleep impairment at work.' },
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
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: 'var(--teal-light)',
          margin: '20px 0 6px',
        }}>
          Your results
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
            color: 'rgba(255,255,255,0.68)',
            marginBottom: 14,
          }}>
            /28
          </span>
        </div>

        {/* Band name — single word, so caps is OK; tracking kept low for dyslexic readers */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: band.color,
          marginBottom: 32,
          opacity: scoreVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}>
          {band.label}
        </div>

        {/* Spectrum bar — zones are divided and named, and the caption states the band in
            text, so the result never relies on hue or position alone (color-blind safe). */}
        <div style={{ maxWidth: 360, margin: '0 auto', position: 'relative' }}>
          <div style={{
            height: 12,
            borderRadius: 6,
            background: 'linear-gradient(to right, #E05252 0%, #E8803C 28%, #D4A03C 48%, #8AC878 72%, #4CAF82 100%)',
            position: 'relative',
            marginBottom: 6,
          }}>
            {/* Zone divider ticks at the band cutoffs (12/13, 16/17, 21/22 of 28) */}
            {[12.5, 16.5, 21.5].map(cut => (
              <div key={cut} style={{
                position: 'absolute',
                top: -2,
                left: `${(cut / 28) * 100}%`,
                width: 2,
                height: 16,
                background: 'var(--void)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.9)',
              }} />
            ))}
            {/* Marker dot — positioned by actual score so it lands inside its named zone */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: animated ? `${(total / 28) * 100}%` : '0%',
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
          {/* Zone names, width-matched to the cutoffs above */}
          <div style={{ display: 'flex', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.68)', marginBottom: 14 }}>
            <span style={{ width: `${(12.5 / 28) * 100}%`, textAlign: 'center' }}>Surviving</span>
            <span style={{ width: `${(4 / 28) * 100}%`, textAlign: 'center' }}>Striving</span>
            <span style={{ width: `${(5 / 28) * 100}%`, textAlign: 'center' }}>Driving</span>
            <span style={{ width: `${(6.5 / 28) * 100}%`, textAlign: 'center' }}>Thriving</span>
          </div>
          {/* Text caption — the score readable with zero reliance on color */}
          <span style={{
            display: 'inline-block',
            background: '#fff',
            color: 'var(--void)',
            fontSize: 12,
            fontWeight: 700,
            padding: '5px 14px',
            borderRadius: 100,
          }}>
            You: {band.label} · {total}/28
          </span>
        </div>
      </div>

      {/* Domain breakdown */}
      <div style={{ padding: '32px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.68)', marginBottom: 16 }}>
          By domain
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
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                    {d.label}
                  </div>
                  {d.sublabel && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', marginTop: 2 }}>{d.sublabel}</div>}
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                  {d.score}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', fontWeight: 400 }}>/{d.max}</span>
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
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Score=13 borderline callout — Dr. Freeman specified verbatim message */}
        {total === 13 && (
          <div style={{
            background: 'rgba(212,160,60,0.08)',
            border: '1px solid rgba(212,160,60,0.3)',
            borderLeft: '3px solid var(--flame)',
            borderRadius: 12,
            padding: '20px 20px',
            marginBottom: 20,
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--flame)',
              marginBottom: 10,
            }}>
              A note about your score
            </div>
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.75,
              margin: 0,
            }}>
              Tests like the EWC can have false positive and false negative results. Your score suggests that you may be experiencing enough distress to benefit from additional support. Please{' '}
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate('/triage')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/triage')}
                style={{
                  color: 'var(--flame)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                click here
              </span>
              {' '}for an additional assessment and some guidance about how to find professional support if you need it.
            </p>
          </div>
        )}

        {/* What this means */}
        <div style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`,
          border: `1px solid ${band.color}25`,
          borderLeft: `3px solid ${band.color}`,
          borderRadius: 12,
          padding: '22px 20px',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: band.color, marginBottom: 12 }}>
            What this means
          </div>
          {/* The most-read paragraph in the app: upright, weight ≥400 (dyslexia-friendly) */}
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 17,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.75,
            fontWeight: 400,
          }}>
            {band.description}
          </p>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate(triage ? '/triage' : '/village')}
          style={{
            marginBottom: 12,
          }}
        >
          {triage ? 'See Your Next Steps →' : 'Enter Econa Village →'}
        </button>
        <button
          className="btn btn-ghost btn-block"
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: 48,
          }}
        >
          Go to Dashboard
        </button>

        {/* Clinical disclaimer — must stay readable (≥0.70 opacity ≈ 5.3:1 on void) */}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.7, paddingBottom: 32 }}>
          This is a screening instrument, not a clinical diagnostic.<br />
          Results are for your personal awareness only.
        </p>
      </div>
    </div>
  )
}
