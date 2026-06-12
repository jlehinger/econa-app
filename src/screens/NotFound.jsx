import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', padding: '40px 32px', textAlign: 'center' }}>
      <EconaLogo size="md" mark variant="color" />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 600, color: 'var(--ink-muted)', margin: '24px 0 8px' }}>404</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 24, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 12, fontWeight: 400 }}>
        Page not found
      </div>
      <p style={{ fontSize: 17, color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 40 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  )
}
