import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAuthStore } from '../store/authStore.js'

const STAGES = [
  { key: 'pre-idea',      label: 'Pre-idea',      desc: 'Exploring the possibility of building' },
  { key: 'pre-revenue',   label: 'Pre-revenue',   desc: 'Building but not yet earning revenue' },
  { key: 'early-revenue', label: 'Early revenue', desc: 'First customers, proving the model' },
  { key: 'growth',        label: 'Growth',        desc: 'Scaling an established business' },
  { key: 'established',   label: 'Established',   desc: 'Running a mature, stable business' },
]

const FLAME_BAR = (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />
)

export default function Verify() {
  const navigate = useNavigate()
  const { setVerified } = useAuthStore()
  const [isEntrepreneur, setIsEntrepreneur] = useState(null)
  const [stage, setStage] = useState(null)

  const handleProceed = () => {
    setVerified(true)
    navigate('/ewc/intro')
  }

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

      {/* Step 1: Are you an entrepreneur? */}
      {isEntrepreneur === null && (
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
            Are you currently building or running a business?
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 48 }}>
            The Entrepreneur Wellbeing Check is built specifically for people building or running a business. The questions and scoring are calibrated to the unique pressures of entrepreneurship.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setIsEntrepreneur(true)}
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
                boxShadow: '0 4px 20px rgba(232,152,29,0.3)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              Yes, I'm building or running a business
            </button>
            <button
              onClick={() => setIsEntrepreneur(false)}
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
              No, not currently
            </button>
          </div>
        </div>
      )}

      {/* No path: respectful exit */}
      {isEntrepreneur === false && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            fontSize: 24,
          }}>
            ✦
          </div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 30, fontStyle: 'italic', color: '#fff', marginBottom: 16, fontWeight: 300 }}>
            Thank you for your interest
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 48 }}>
            This tool was built specifically for entrepreneurs. The questions and scoring are calibrated to the unique pressures of building and running a business. We hope to see you here when the time is right.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="https://econa.net"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                borderRadius: 12,
                padding: '16px',
                fontSize: 14,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            >
              Learn about Econa →
            </a>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', padding: '12px 0' }}
            >
              Return to Econa
            </button>
          </div>
        </div>
      )}

      {/* Yes path: stage selection */}
      {isEntrepreneur === true && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 30, fontStyle: 'italic', color: '#fff', margin: '28px 0 12px', fontWeight: 300, lineHeight: 1.2 }}>
            What stage best describes your business?
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32, lineHeight: 1.7 }}>
            This helps us contextualize your results.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
            {STAGES.map(s => (
              <button
                key={s.key}
                onClick={() => setStage(s.key)}
                style={{
                  background: stage === s.key ? 'rgba(232,152,29,0.12)' : 'rgba(255,255,255,0.04)',
                  border: stage === s.key ? '1.5px solid var(--flame)' : '1.5px solid rgba(255,255,255,0.09)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: stage === s.key ? '#fff' : 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 12, color: stage === s.key ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)' }}>
                  {s.desc}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleProceed}
            disabled={!stage}
            style={{
              background: stage
                ? 'linear-gradient(135deg, var(--ember), var(--flame))'
                : 'rgba(255,255,255,0.08)',
              color: stage ? '#fff' : 'rgba(255,255,255,0.25)',
              border: 'none',
              borderRadius: 14,
              padding: '18px',
              fontSize: 15,
              fontWeight: 600,
              cursor: stage ? 'pointer' : 'not-allowed',
              width: '100%',
              fontFamily: 'var(--font-body)',
              boxShadow: stage ? '0 4px 20px rgba(232,152,29,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Continue to the Check →
          </button>
        </div>
      )}
    </div>
  )
}
