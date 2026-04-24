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
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.8"
          fill={active ? 'rgba(232,152,29,0.15)' : 'none'}
        />
        <path
          d="M9 21V13h6v8"
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
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
          fill={active ? '#E8981D' : 'none'}
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.8"
        />
        <path
          d="M12 16v2M9 21h6"
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    resetOnTap: true,
  },
  {
    to: '/history',
    label: 'History',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline
          points="3,18 8,12 13,15 21,6"
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="8" cy="12" r="2.2" fill={active ? '#E8981D' : 'rgba(255,255,255,0.4)'} />
        <circle cx="13" cy="15" r="2.2" fill={active ? '#E8981D' : 'rgba(255,255,255,0.4)'} />
        <circle cx="21" cy="6" r="2.2" fill={active ? '#E8981D' : 'rgba(255,255,255,0.4)'} />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.8"
          fill={active ? 'rgba(232,152,29,0.15)' : 'none'}
        />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={active ? '#E8981D' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.8"
          strokeLinecap="round"
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
      background: 'rgba(20,20,36,0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
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
              fontSize: 10,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: active ? '#E8981D' : 'rgba(255,255,255,0.35)',
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
