import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useAssessmentStore } from '../store/assessmentStore.js'

const BAND_META = {
  vitality:  { label: 'Vitality',  color: '#4CAF82', bg: 'rgba(76,175,130,0.1)' },
  stability: { label: 'Stability', color: '#3FA4B5', bg: 'rgba(63,164,181,0.1)' },
  strain:    { label: 'Strain',    color: '#E8981D', bg: 'rgba(232,152,29,0.1)' },
  distress:  { label: 'Distress',  color: '#E05252', bg: 'rgba(224,82,82,0.1)' },
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { history, score, band: bandKey, resetAssessment } = useAssessmentStore()

  const handleRetake = () => {
    resetAssessment()
    navigate('/ewc/intro')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const latestBand = bandKey ? BAND_META[bandKey] : null

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 90,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header */}
      <div style={{
        padding: '36px 24px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <EconaLogo size="sm" />
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            padding: '6px 14px',
            borderRadius: 100,
            letterSpacing: '0.05em',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          Sign out
        </button>
      </div>

      <div style={{ padding: '28px 24px', flex: 1 }}>
        {/* Greeting */}
        <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 28, fontStyle: 'italic', color: '#fff', marginBottom: 4, fontWeight: 300 }}>
          Welcome back
        </div>
        {user?.email && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 32, letterSpacing: '0.02em' }}>
            {user.email}
          </div>
        )}

        {/* Latest result card */}
        {latestBand ? (
          <div style={{
            background: `linear-gradient(135deg, ${latestBand.bg}, rgba(255,255,255,0.03))`,
            border: `1px solid ${latestBand.color}25`,
            borderLeft: `3px solid ${latestBand.color}`,
            borderRadius: 14,
            padding: '24px 22px',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              Latest Result
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 56,
                fontWeight: 700,
                color: latestBand.color,
                lineHeight: 1,
                textShadow: `0 0 30px ${latestBand.color}50`,
              }}>
                {score}
              </span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.25)' }}>/28</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: latestBand.color,
              marginBottom: 16,
            }}>
              {latestBand.label}
            </div>
            <button
              onClick={() => navigate('/ewc/resources')}
              style={{
                background: 'none',
                border: `1px solid ${latestBand.color}40`,
                color: latestBand.color,
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${latestBand.color}15`}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              View Resources →
            </button>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '32px 22px',
            marginBottom: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>✦</div>
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 20, fontStyle: 'italic', color: '#fff', marginBottom: 8, fontWeight: 300 }}>
              No results yet
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Take the free 3-minute check to see where you stand.
            </p>
          </div>
        )}

        <button
          onClick={handleRetake}
          style={{
            background: 'linear-gradient(135deg, var(--ember), var(--flame))',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '17px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-body)',
            marginBottom: 36,
            boxShadow: '0 4px 20px rgba(232,152,29,0.28)',
            letterSpacing: '0.03em',
          }}
        >
          {history.length > 0 ? 'Retake the Check →' : 'Take the Check →'}
        </button>

        {/* Check History */}
        {history.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
              Check History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h, i) => {
                const m = BAND_META[h.band] || { label: h.band, color: 'rgba(255,255,255,0.5)', bg: 'transparent' }
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: i === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '14px 18px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{formatDate(h.date)}</div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: m.bg,
                        border: `1px solid ${m.color}30`,
                        borderRadius: 100,
                        padding: '3px 10px',
                      }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.color }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: m.color }}>{m.label}</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: m.color }}>
                      {h.score}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>/28</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <p style={{ marginTop: 40, fontSize: 10, color: 'rgba(255,255,255,0.12)', textAlign: 'center', lineHeight: 1.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          History persists locally · Cloud sync via Supabase
        </p>
      </div>

      <NavBar />
    </div>
  )
}
