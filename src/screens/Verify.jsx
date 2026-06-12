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
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '64px 28px 48px',
    }}>
      {FLAME_BAR}

      <EconaLogo size="md" mark variant="color" />

      {/* Step 1: FounderScreen qualification gate */}
      {isQualified === null && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 34,
            fontStyle: 'italic',
            color: 'var(--ink)',
            margin: '28px 0 16px',
            fontWeight: 400,
            lineHeight: 1.2,
          }}>
            Are you, or were you, the founder or co-founder of a company?
          </div>
          <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 48 }}>
            FounderScreen is validated exclusively for entrepreneurs. The assessment questions and scoring are calibrated to this population.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="btn btn-primary btn-block"
              onClick={() => { setQualified(); setVerified(true); navigate('/demographics') }}
            >
              Yes — I'm a founder
            </button>
            <button
              className="btn btn-ghost btn-block"
              onClick={() => { setQualified(false); setIsQualified(false) }}
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
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28, fontSize: 24, color: 'var(--flame-bright)',
            boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          }}>✦</div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 30, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 16, fontWeight: 400 }}>
            Not the right fit — yet.
          </div>
          <p style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 48 }}>
            Thank you for your interest in FounderScreen, however it's not the right platform for you because it is only valid for entrepreneurs.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="https://econa.net"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                background: 'var(--surface-2)',
                border: '1px solid var(--hairline)',
                color: 'var(--ink)', borderRadius: 12, padding: '16px',
                fontSize: 17, textDecoration: 'none',
                fontFamily: 'var(--font-body)', fontWeight: 500,
                boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
              }}
            >
              Learn about Econa →
            </a>
            <button
              onClick={() => { setQualified(false); setIsQualified(null) }}
              style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 16, fontFamily: 'var(--font-body)', padding: '12px 0' }}
            >
              ← Go back
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontSize: 15, fontFamily: 'var(--font-body)', padding: '4px 0' }}
            >
              Return to home
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
