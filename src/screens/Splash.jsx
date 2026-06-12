import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAuthStore } from '../store/authStore.js'

export default function Splash() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '64px 32px 48px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
    }}>
      {/* Flame accent bar at top */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))',
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <EconaLogo size="xl" mark align="start" variant="color" />

        <div style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(40px, 11vw, 54px)',
          fontStyle: 'italic',
          color: 'var(--ink)',
          lineHeight: 1.12,
          margin: '32px 0 16px',
          fontWeight: 500,
        }}>
          The Entrepreneur<br />Wellbeing Check
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: 'var(--flame-bright)',
          marginBottom: 36,
        }}>
          7 questions · 3 minutes · Free
        </div>

        <p style={{
          fontSize: 19,
          color: 'var(--ink-soft)',
          lineHeight: 1.7,
          marginBottom: 56,
          maxWidth: 380,
        }}>
          A scientifically validated screening tool that tells you where you stand — and connects you with resources matched to where you actually are.
        </p>

        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate(user ? '/dashboard' : '/auth')}
          style={{
            marginBottom: 14,
          }}
        >
          {user ? 'Go to Dashboard' : 'Take the Free Check'}
        </button>

        {!user && (
          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/auth?mode=login')}
          >
            Sign In
          </button>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: 14,
        color: 'var(--ink-muted)',
        letterSpacing: '0.03em',
        lineHeight: 2,
      }}>
        Built by Econa<br />
        Global Center of Excellence for Entrepreneur Mental Wellness<br />
        © 2025 Econa
      </div>
    </div>
  )
}
