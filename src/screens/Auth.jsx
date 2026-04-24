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
        fontSize: floated ? 10 : 15,
        fontWeight: floated ? 700 : 400,
        letterSpacing: floated ? '0.12em' : '0',
        textTransform: floated ? 'uppercase' : 'none',
        color: focused ? 'var(--flame)' : 'rgba(255,255,255,0.4)',
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
          boxShadow: focused ? '0 0 0 3px rgba(232,152,29,0.15)' : 'none',
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
  const [error, setError] = useState(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const { signUp, signIn } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = mode === 'create'
      ? await signUp(email, password)
      : await signIn(email, password)

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (result.needsConfirmation) {
      setNeedsConfirmation(true)
      return
    }

    navigate('/verify')
  }

  if (needsConfirmation) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '64px 28px',
        textAlign: 'center',
      }}>
        {FLAME_BAR}
        <EconaLogo size="md" />
        <div style={{
          marginTop: 40,
          fontFamily: 'var(--font-editorial)',
          fontSize: 26,
          fontStyle: 'italic',
          color: '#fff',
          fontWeight: 300,
          lineHeight: 1.3,
          marginBottom: 16,
        }}>
          Check your inbox
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 320 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--flame)' }}>{email}</strong>.
          Click it to activate your account, then come back to sign in.
        </p>
        <button
          onClick={() => { setNeedsConfirmation(false); setMode('login') }}
          style={{
            marginTop: 36,
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)',
            borderRadius: 12,
            padding: '14px 28px',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Back to Sign In
        </button>
      </div>
    )
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
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer',
          fontSize: 14,
          padding: '0 0 36px',
          fontFamily: 'var(--font-body)',
          textAlign: 'left',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        ← Back
      </button>

      <EconaLogo size="md" />

      {/* Mode switcher pill */}
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
            onClick={() => { setMode(m); setError(null) }}
            style={{
              flex: 1,
              background: mode === m ? 'linear-gradient(135deg, var(--ember), var(--flame))' : 'none',
              border: 'none',
              borderRadius: 100,
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 600,
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
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
        fontWeight: 300,
        lineHeight: 1.2,
      }}>
        {mode === 'create' ? 'Start your journey' : 'Welcome back'}
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 36, lineHeight: 1.7 }}>
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

        {error && (
          <div style={{
            background: 'rgba(224,82,82,0.1)',
            border: '1px solid rgba(224,82,82,0.25)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 13,
            color: '#E05252',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading
              ? 'rgba(232,152,29,0.4)'
              : 'linear-gradient(135deg, var(--ember) 0%, var(--flame) 60%, var(--spark) 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '18px',
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-body)',
            marginTop: 8,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(232,152,29,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'One moment…' : mode === 'create' ? 'Create Account →' : 'Sign In →'}
        </button>
      </form>

      <p style={{
        marginTop: 'auto',
        paddingTop: 48,
        fontSize: 11,
        color: 'rgba(255,255,255,0.18)',
        textAlign: 'center',
        lineHeight: 1.7,
      }}>
        Anonymized data · GDPR compliant · Never sold
      </p>
    </div>
  )
}
