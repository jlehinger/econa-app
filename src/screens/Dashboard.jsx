import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { BANDS } from '../data/questions.js'

// Band labels/colors come from the one scale in questions.js — never redefine them locally.
const BAND_META = Object.fromEntries(
  Object.values(BANDS).map(b => [b.key, { label: b.label, color: b.color, bg: `${b.color}1A` }])
)

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
      background: 'var(--surface)',
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
        borderBottom: '1px solid var(--hairline)',
      }}>
        <EconaLogo size="md" mark variant="color" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/settings')}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 24px', flex: 1 }}>
        {/* Greeting */}
        <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 28, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 4, fontWeight: 400 }}>
          Welcome back
        </div>
        {user?.email && (
          <div style={{ fontSize: 15, color: 'var(--ink-muted)', marginBottom: 32, letterSpacing: '0.02em' }}>
            {user.email}
          </div>
        )}

        {/* Latest result card */}
        {latestBand ? (
          <div style={{
            background: `linear-gradient(135deg, ${latestBand.bg}, var(--surface-2))`,
            border: '1px solid var(--hairline)',
            borderLeft: `3px solid ${latestBand.color}`,
            borderRadius: 14,
            padding: '24px 22px',
            marginBottom: 20,
            boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: 12 }}>
              Latest result
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
              <span style={{ fontSize: 18, color: 'var(--ink-muted)' }}>/28</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.06em',
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
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${latestBand.color}15`}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              View resources →
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            borderRadius: 14,
            padding: '32px 22px',
            marginBottom: 20,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>✦</div>
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 20, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8, fontWeight: 400 }}>
              No results yet
            </div>
            <p style={{ fontSize: 16, color: 'var(--ink-muted)', lineHeight: 1.7 }}>
              Take the free 3-minute check to see where you stand.
            </p>
          </div>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={handleRetake}
          style={{
            marginBottom: 36,
          }}
        >
          {history.length > 0 ? 'Retake the Check →' : 'Take the Check →'}
        </button>

        {/* Check History */}
        {history.length > 0 && (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: 16 }}>
              Check history
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h, i) => {
                const m = BAND_META[h.band] || { label: h.band, color: 'var(--ink-muted)', bg: 'transparent' }
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 12,
                      padding: '14px 18px',
                      boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, color: 'var(--ink-muted)', marginBottom: 4 }}>{formatDate(h.date)}</div>
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
                        <span style={{ fontSize: 14, fontWeight: 600, color: m.color }}>{m.label}</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: m.color }}>
                      {h.score}<span style={{ fontSize: 16, color: 'var(--ink-muted)', fontWeight: 400 }}>/28</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>

      <NavBar />
    </div>
  )
}
