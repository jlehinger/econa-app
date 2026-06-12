import { useNavigate, useLocation } from 'react-router-dom'
import { useAssessmentStore } from '../store/assessmentStore.js'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
          fill={active ? 'rgba(200,138,30,0.14)' : 'none'}
        />
        <path
          d="M9 21V13h6v8"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    to: '/ewc/intro',
    label: 'Check',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C9.5 5 7 7.5 7 11c0 2.76 2.24 5 5 5s5-2.24 5-5c0-3.5-2.5-6-5-9z"
          fill={active ? '#C88A1E' : 'none'}
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
        />
        <path
          d="M12 16v2M9 21h6"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    resetOnTap: true,
  },
  {
    to: '/labs',
    label: 'Labs',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 2 8 7 8 12a4 4 0 008 0c0-5-4-10-4-10z"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? 'rgba(200,138,30,0.14)' : 'none'}
        />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
          fill={active ? 'rgba(200,138,30,0.10)' : 'none'}
        />
        <path
          d="M12 7v5l3 3"
          stroke={active ? '#C88A1E' : 'rgba(15,43,76,0.5)'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetAssessment } = useAssessmentStore()

  const handleTap = (item) => {
    if (item.resetOnTap) {
      resetAssessment()
    }
    navigate(item.to)
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--hairline)',
      boxShadow: '0 -2px 16px rgba(15,43,76,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
        return (
          <button
            key={item.label}
            onClick={() => handleTap(item)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '4px 16px',
              minWidth: 56,
              transition: 'opacity 0.15s',
            }}
          >
            {item.icon(active)}
            <span style={{
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: active ? '#C88A1E' : 'var(--ink-muted)',
              transition: 'color 0.15s',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
