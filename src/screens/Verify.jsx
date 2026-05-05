import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAuthStore } from '../store/authStore.js'

const FLAME_BAR = (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />
)

export default function Verify() {
  const navigate = useNavigate()
  const { setVerified, setQualified } = useAuthStore()
  const [isQualified, setIsQualified] = useState(null)

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '64px 28px 48px',
    }}>
      {FLAME_BAR}

      <EconaLogo size="md" />

      {/* Step 1: FounderScreen qualification gate */}
      {isQualified === null && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 34,
            fontStyle: 'italic',
            color: '#fff',
            margin: '28px 0 16px',
            fontWeight: 300,
            lineHeight: 1.2,
          }}>
            Are you, or were you, the founder or co-founder of a company?
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 48 }}>
            FounderScreen is validated exclusively for entrepreneurs. The assessment questions and scoring are calibrated to this population.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => { setQualified(); setVerified(true); navigate('/demographics') }}
              style={{
                background: 'linear-gradient(135deg, var(--ember), var(--flame))',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '20px 28px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.03em',
                boxShadow: '0 4px 20px rgba(212,160,60,0.3)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              Yes — I'm a founder
            </button>
            <button
              onClick={() => { setQualified(false); setIsQualified(false) }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: 14,
                padding: '18px 28px',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* No path: respectful exit */}
      {isQualified === false && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28, fontSize: 24,
          }}>✦</div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 30, fontStyle: 'italic', color: '#fff', marginBottom: 16, fontWeight: 300 }}>
            Not the right fit — yet.
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 48 }}>
            Thank you for your interest in FounderScreen, however it's not the right platform for you because it is only valid for entrepreneurs.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="https://econa.net"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 12, padding: '16px',
                fontSize: 14, textDecoration: 'none',
                fontFamily: 'var(--font-body)', fontWeight: 500,
              }}
            >
              Learn about Econa →
            </a>
            <button
              onClick={() => { setQualified(false); setIsQualified(null) }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', padding: '12px 0' }}
            >
              ← Go back
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', padding: '4px 0' }}
            >
              Return to home
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
