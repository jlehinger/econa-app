import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { rankedLabs } from '../data/labs.js'

const DOMAIN_LABELS = {
  wellbeing: 'Wellbeing',
  occupational: 'Occupational',
  emotional: 'Emotional Stability',
}

export default function LabsList() {
  const navigate = useNavigate()
  const { itemScores, labProgress } = useAssessmentStore()

  const labs = rankedLabs(itemScores.length === 7 ? itemScores : Array(7).fill(2))

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column',
      maxWidth: '480px', margin: '0 auto', paddingBottom: 80,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <div style={{ padding: '48px 24px 0' }}>
        <EconaLogo size="md" mark variant="color" />

        <div style={{ marginTop: 24, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--teal-light)', marginBottom: 6 }}>
            Econa Labs
          </div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 24, fontStyle: 'italic', color: 'var(--ink)', fontWeight: 400, lineHeight: 1.3 }}>
            Your personalized<br />wellbeing curriculum.
          </div>
          <p style={{ fontSize: 16, color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: 10 }}>
            Labs are ranked by your lowest EWC item scores — biggest need first.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {labs.map((lab) => {
            const progress = labProgress[lab.id]
            const started = progress?.started
            const seen = progress?.sectionsSeen?.length || 0

            return (
              <button
                key={lab.id}
                onClick={lab.available ? () => navigate(`/labs/${lab.id}`) : undefined}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--hairline)',
                  borderLeft: lab.available ? `3px solid ${lab.color}` : '3px solid var(--hairline)',
                  boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
                  borderRadius: 14, padding: '18px 18px',
                  cursor: lab.available ? 'pointer' : 'default',
                  textAlign: 'left', width: '100%',
                  opacity: lab.available ? 1 : 0.55,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 700, letterSpacing: '0.05em',
                        color: lab.available ? lab.color : 'var(--ink-muted)',
                        background: lab.available ? `${lab.color}15` : 'rgba(15,43,76,0.05)',
                        border: `1px solid ${lab.available ? lab.color + '25' : 'var(--hairline)'}`,
                        borderRadius: 100, padding: '2px 7px',
                      }}>
                        {DOMAIN_LABELS[lab.domain]}
                      </span>
                      {!lab.available && (
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-muted)', background: 'rgba(15,43,76,0.05)', borderRadius: 100, padding: '2px 7px' }}>
                          {lab.phase === 'summer2026' ? "Coming Summer '26" : 'Phase 2'}
                        </span>
                      )}
                      {lab.available && lab.phase === 'draft' && (
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--flame-bright)', background: 'rgba(200,138,30,0.12)', border: '1px solid rgba(200,138,30,0.3)', borderRadius: 100, padding: '2px 7px' }}>
                          Draft
                        </span>
                      )}
                      {started && (
                        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: '#2E7D55', background: 'rgba(76,175,130,0.14)', borderRadius: 100, padding: '2px 7px' }}>
                          In progress
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: lab.available ? 'var(--ink)' : 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.04em' }}>
                      {lab.title}
                    </div>
                    <div style={{ fontSize: 15, color: lab.available ? 'var(--ink-soft)' : 'var(--ink-muted)' }}>
                      {lab.available ? lab.tagline : lab.subtitle}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                      color: lab.available ? lab.color : 'var(--ink-muted)',
                    }}>
                      {itemScores[lab.ewcIndex] ?? '—'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>/4</div>
                  </div>
                </div>

                {started && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Progress</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{seen}/5 sections</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(15,43,76,0.08)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${(seen / 5) * 100}%`, background: lab.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p style={{ fontSize: 14, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.8, padding: '28px 0 16px', letterSpacing: '0.04em' }}>
          Phase 2 labs unlock as content is added
        </p>
      </div>
      <NavBar />
    </div>
  )
}
