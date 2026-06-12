import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { useAuthStore } from '../store/authStore.js'
import { rankedLabs } from '../data/labs.js'
import NavBar from '../components/NavBar.jsx'

export default function VillageWelcome() {
  const navigate = useNavigate()
  const { score, itemScores } = useAssessmentStore()
  const { joinVillage, villageStatus } = useAuthStore()

  useEffect(() => {
    if (villageStatus !== 'active') {
      joinVillage()
    }
  }, [villageStatus, joinVillage])

  const topLab = rankedLabs(itemScores).find(l => l.available) || null

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 80,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <div style={{ padding: '52px 28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <EconaLogo size="md" mark variant="color" />

        {/* Village badge */}
        <div style={{
          marginTop: 32, marginBottom: 8,
          background: 'linear-gradient(135deg, rgba(212,160,60,0.15), rgba(224,123,84,0.1))',
          border: '1px solid rgba(212,160,60,0.3)',
          borderRadius: 100, padding: '6px 20px',
          fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
          color: 'var(--flame-bright)',
        }}>
          Welcome to Econa Village
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          fontWeight: 700,
          color: 'var(--flame-bright)',
          lineHeight: 1,
          margin: '12px 0 6px',
        }}>
          {score ?? '—'}/28
        </div>

        <div style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 24,
          fontStyle: 'italic',
          color: 'var(--ink)',
          fontWeight: 400,
          lineHeight: 1.4,
          marginBottom: 14,
        }}>
          You're in the village now.
        </div>

        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: 340, marginBottom: 40 }}>
          You've completed your first EWC. Your score and item breakdown have unlocked your personal Econa Labs — tools matched to exactly where you are right now.
        </p>

        {/* Membership card */}
        <div style={{
          width: '100%',
          background: 'var(--surface-2)',
          border: '1px solid var(--hairline)',
          boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 28,
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: 16 }}>
            Your membership
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Status', value: 'Village Member — Active', color: '#2E7D55' },
              { label: 'Access', value: 'Full — All Econa Labs + FounderScreen', color: 'var(--ink)' },
              { label: 'Free through', value: 'One year from today', color: 'var(--ink)' },
              { label: 'After Year 1', value: '$30 / month', color: 'var(--ink-soft)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>{row.label}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* First suggested lab */}
        {topLab && (
          <div style={{ width: '100%', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: 12, textAlign: 'left' }}>
              Your highest-need lab
            </div>
            <button
              onClick={() => navigate(`/labs/${topLab.id}`)}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--hairline)',
                borderLeft: `3px solid ${topLab.color}`,
                boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
                borderRadius: 14,
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginBottom: 6 }}>
                {topLab.title}
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 12 }}>
                {topLab.tagline}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['How am I doing', 'What to do', 'Resources'].map(tag => (
                  <div key={tag} style={{
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.05em',
                    color: topLab.color, background: `${topLab.color}15`,
                    border: `1px solid ${topLab.color}25`, borderRadius: 100, padding: '3px 8px',
                  }}>
                    {tag}
                  </div>
                ))}
              </div>
            </button>
          </div>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate('/labs')}
          style={{
            marginBottom: 12,
          }}
        >
          Explore All My Labs →
        </button>

        <button
          className="btn btn-ghost btn-block"
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: 40,
          }}
        >
          Go to Dashboard
        </button>
      </div>
      <NavBar />
    </div>
  )
}
