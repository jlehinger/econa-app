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
      background: 'var(--void)',
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
        <EconaLogo size="lg" />

        <div style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(36px, 10vw, 48px)',
          fontStyle: 'italic',
          color: '#fff',
          lineHeight: 1.15,
          margin: '28px 0 14px',
          fontWeight: 300,
        }}>
          The Entrepreneur<br />Wellbeing Check
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'var(--flame)',
          textTransform: 'uppercase',
          marginBottom: 36,
        }}>
          7 Questions · 3 Minutes · Free
        </div>

        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
          marginBottom: 56,
          maxWidth: 340,
        }}>
          A scientifically validated tool that tells you where you stand — and connects you with resources matched to where you actually are.
        </p>

        <button
          onClick={() => navigate(user ? '/dashboard' : '/auth')}
          style={{
            background: 'linear-gradient(135deg, var(--ember) 0%, var(--flame) 60%, var(--spark) 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '20px 32px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-body)',
            marginBottom: 14,
            width: '100%',
            boxShadow: '0 4px 24px rgba(232,152,29,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(232,152,29,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(232,152,29,0.35)' }}
        >
          {user ? 'Go to Dashboard' : 'Take the Free Check'}
        </button>

        {!user && (
          <button
            onClick={() => navigate('/auth?mode=login')}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)',
              borderRadius: 14,
              padding: '18px 32px',
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              width: '100%',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            Sign In
          </button>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: 10,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.1em',
        lineHeight: 2,
        textTransform: 'uppercase',
      }}>
        Built by Econa<br />
        Global Center of Excellence for Entrepreneur Mental Wellness
      </div>
    </div>
  )
}
