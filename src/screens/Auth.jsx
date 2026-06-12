import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAuthStore } from '../store/authStore.js'

const FLAME_BAR = (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />
)

function FloatingInput({ label, type, value, onChange, placeholder, autoFocus }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const floated = focused || value.length > 0

  return (
    <div
      style={{ position: 'relative', cursor: 'text' }}
      onClick={() => inputRef.current?.focus()}
    >
      <label style={{
        position: 'absolute',
        left: 16,
        top: floated ? 8 : '50%',
        transform: floated ? 'none' : 'translateY(-50%)',
        fontSize: floated ? 11 : 15,
        fontWeight: floated ? 700 : 400,
        letterSpacing: floated ? '0.05em' : '0',
        textTransform: 'none',
        color: focused ? 'var(--flame)' : 'rgba(255,255,255,0.65)',
        transition: 'all 0.18s ease',
        pointerEvents: 'none',
        zIndex: 1,
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={floated ? placeholder : ''}
        required
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: focused
            ? '1.5px solid var(--flame)'
            : '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: floated ? '28px 16px 10px' : '18px 16px',
          fontSize: 15,
          color: '#fff',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'border-color 0.18s, box-shadow 0.18s',
          boxShadow: focused ? '0 0 0 3px rgba(212,160,60,0.15)' : 'none',
          caretColor: 'var(--flame)',
        }}
      />
    </div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'create'
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotClicked, setForgotClicked] = useState(false)
  const { setUser } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setUser({ id: crypto.randomUUID(), email })
      setLoading(false)
      navigate('/verify')
    }, 700)
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

      <button
        className="btn btn-ghost"
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 36,
        }}
      >
        ← Back
      </button>

      <EconaLogo size="md" />

      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 100,
        padding: 4,
        margin: '24px 0 32px',
        gap: 4,
      }}>
        {['create', 'login'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              background: mode === m ? 'var(--flame)' : 'transparent',
              border: 'none',
              borderRadius: 100,
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 600,
              color: mode === m ? 'var(--void)' : 'rgba(255,255,255,0.82)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s',
            }}
          >
            {m === 'create' ? 'Create Account' : 'Sign In'}
          </button>
        ))}
      </div>

      <div style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 30,
        fontStyle: 'italic',
        color: '#fff',
        marginBottom: 8,
        fontWeight: 400,
        lineHeight: 1.2,
      }}>
        {mode === 'create' ? 'Start your journey' : 'Welcome back'}
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 36, lineHeight: 1.7 }}>
        Your responses are always anonymized. We never identify individuals.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FloatingInput
          label="Email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoFocus
        />
        <FloatingInput
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={mode === 'create' ? 'Create a password' : 'Enter your password'}
        />

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
          style={{
            marginTop: 8,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'One moment…' : mode === 'create' ? 'Create Account →' : 'Sign In →'}
        </button>

        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <button
              type="button"
              onClick={() => setForgotClicked(f => !f)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(212,187,113,0.6)',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.02em',
                padding: '4px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--spark)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,187,113,0.6)'}
            >
              Forgot password?
            </button>
            {forgotClicked && (
              <p style={{
                marginTop: 8,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
                letterSpacing: '0.01em',
              }}>
                Password reset will be available once email sign-in is enabled.
              </p>
            )}
          </div>
        )}
      </form>

      <p style={{
        marginTop: 'auto',
        paddingTop: 48,
        fontSize: 11,
        color: 'rgba(255,255,255,0.68)',
        textAlign: 'center',
        lineHeight: 1.7,
      }}>
        Anonymized data · GDPR compliant · Never sold
      </p>
    </div>
  )
}
