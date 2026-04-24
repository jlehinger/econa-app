import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', padding: '40px 32px', textAlign: 'center' }}>
      <EconaLogo size="md" />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 600, color: 'rgba(255,255,255,0.08)', margin: '24px 0 8px' }}>404</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 24, fontStyle: 'italic', color: '#fff', marginBottom: 12, fontWeight: 300 }}>
        Page not found
      </div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 40 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'linear-gradient(135deg, var(--ember), var(--flame))', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
      >
        Go Home
      </button>
    </div>
  )
}
