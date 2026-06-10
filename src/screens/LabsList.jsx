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
      minHeight: '100dvh', background: 'var(--void)',
      display: 'flex', flexDirection: 'column',
      maxWidth: '480px', margin: '0 auto', paddingBottom: 80,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <div style={{ padding: '48px 24px 0' }}>
        <EconaLogo size="sm" />

        <div style={{ marginTop: 24, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--teal-light)', marginBottom: 6 }}>
            Econa Labs
          </div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 24, fontStyle: 'italic', color: '#fff', fontWeight: 300, lineHeight: 1.3 }}>
            Your personalized<br />wellbeing curriculum.
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginTop: 10 }}>
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
                  background: lab.available ? `${lab.color}08` : 'rgba(255,255,255,0.02)',
                  border: lab.available ? `1px solid ${lab.color}25` : '1px solid rgba(255,255,255,0.05)',
                  borderLeft: lab.available ? `3px solid ${lab.color}` : '3px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '18px 18px',
                  cursor: lab.available ? 'pointer' : 'default',
                  textAlign: 'left', width: '100%',
                  opacity: lab.available ? 1 : 0.45,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                        color: lab.available ? lab.color : 'rgba(255,255,255,0.65)',
                        background: lab.available ? `${lab.color}15` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${lab.available ? lab.color + '25' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 100, padding: '2px 7px',
                      }}>
                        {DOMAIN_LABELS[lab.domain]}
                      </span>
                      {!lab.available && (
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.04)', borderRadius: 100, padding: '2px 7px' }}>
                          {lab.phase === 'summer2026' ? "Coming Summer '26" : 'Phase 2'}
                        </span>
                      )}
                      {started && (
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#4CAF82', background: 'rgba(76,175,130,0.1)', borderRadius: 100, padding: '2px 7px' }}>
                          In progress
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: lab.available ? '#fff' : 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.04em' }}>
                      {lab.title}
                    </div>
                    <div style={{ fontSize: 12, color: lab.available ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                      {lab.available ? lab.tagline : lab.subtitle}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                      color: lab.available ? lab.color : 'rgba(255,255,255,0.2)',
                    }}>
                      {itemScores[lab.ewcIndex] ?? '—'}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>/4</div>
                  </div>
                </div>

                {started && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Progress</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{seen}/5 sections</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${(seen / 5) * 100}%`, background: lab.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.8, padding: '28px 0 16px', letterSpacing: '0.04em' }}>
          Phase 2 labs unlock as content is added
        </p>
      </div>
      <NavBar />
    </div>
  )
}
