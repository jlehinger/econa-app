import { useNavigate } from 'react-router-dom'

export default function ScreenWrapper({ children, showBack = false, backTo }) {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--void)',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {showBack && (
        <button
          onClick={() => backTo ? navigate(backTo) : navigate(-1)}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: 14,
            padding: '8px 0',
            fontFamily: 'var(--font-body)',
          }}
        >
          ← Back
        </button>
      )}
      {children}
    </div>
  )
}
