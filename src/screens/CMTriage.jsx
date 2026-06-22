import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { CONNECTED_MIND_URL } from '../lib/links.js'

const STEPS = [
  {
    step: 1,
    color: '#E05252',
    title: 'Connected Mind Mental Health Lab',
    body: "Your score indicates you may benefit from a deeper clinical assessment. We're partnering with Connected Mind to provide a confidential DSM-5 screening — the same tool used by vetted clinicians who specialize in entrepreneurs.",
    note: 'Takes about 10 minutes. No referral required. Free.',
    cta: 'Begin Mental Health Screening',
    link: CONNECTED_MIND_URL,
    external: true,
    highlight: true,
  },
  {
    step: 2,
    color: '#D4A03C',
    title: 'Your Personal Report',
    body: "After completing the screening, you'll receive a written assessment summary you can take to a licensed mental health professional. It translates your results into clinical language your provider will understand.",
    note: 'Printable PDF format.',
    cta: null,
    link: null,
    external: false,
  },
  {
    step: 3,
    color: '#5DADE2',
    title: 'Your Econa Labs',
    body: "Once you've completed the screening, come back and explore your personal Econa Labs — tools matched to your specific EWC item scores. You don't have to do everything at once.",
    note: null,
    cta: 'Explore My Labs',
    link: null,
    external: false,
    internal: '/labs',
  },
]

export default function CMTriage() {
  const navigate = useNavigate()
  const { score } = useAssessmentStore()

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 80,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #E05252, #D4A03C, var(--flame))', zIndex: 200 }} />

      <div style={{ padding: '48px 28px 0' }}>
        <EconaLogo size="md" mark variant="color" />

        {/* Score badge */}
        <div style={{
          background: 'rgba(224,82,82,0.08)',
          border: '1px solid rgba(224,82,82,0.25)',
          borderLeft: '3px solid #E05252',
          borderRadius: 12,
          padding: '20px 20px',
          margin: '24px 0 32px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(224,82,82,0.15)', border: '1px solid rgba(224,82,82,0.30)',
            borderRadius: 100, padding: '4px 12px', marginBottom: 14,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E05252' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#E05252' }}>
              Your score: {score ?? '—'}/28
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', fontWeight: 400, lineHeight: 1.3, marginBottom: 10 }}>
            You deserve more support than a self-help app.
          </div>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            Your results suggest significant distress. This isn't a character flaw — it's a signal the research takes seriously. The next step is a clinical screening designed specifically for entrepreneurs.
          </p>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: 16 }}>
          Your path forward
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          {STEPS.map(s => (
            <div key={s.step} style={{
              background: s.highlight ? `${s.color}08` : 'var(--surface-2)',
              border: s.highlight ? `1px solid ${s.color}30` : '1px solid var(--hairline)',
              borderLeft: s.highlight ? `3px solid ${s.color}` : undefined,
              borderRadius: 14,
              padding: '20px',
              boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${s.color}18`, border: `1px solid ${s.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: s.color, flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: '0.05em', color: 'var(--ink)' }}>
                  {s.title}
                </div>
              </div>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: s.cta ? 16 : 0 }}>
                {s.body}
              </p>
              {s.note && (
                <p style={{ fontSize: 14, color: s.color, marginBottom: s.cta ? 14 : 0 }}>
                  {s.note}
                </p>
              )}
              {s.cta && s.external && (
                <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', background: `linear-gradient(135deg, ${s.color}CC, ${s.color})`,
                  color: '#fff', textDecoration: 'none', borderRadius: 12, padding: '14px 18px',
                  fontSize: 14, fontWeight: 600, textAlign: 'center', fontFamily: 'var(--font-body)',
                }}>
                  {s.cta} →
                </a>
              )}
              {s.cta && s.internal && (
                <button onClick={() => navigate(s.internal)} style={{
                  background: 'none', border: `1px solid ${s.color}50`, color: s.color,
                  borderRadius: 12, padding: '14px 18px', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', width: '100%', fontFamily: 'var(--font-body)',
                }}>
                  {s.cta} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Crisis line */}
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--hairline)',
          borderRadius: 12, padding: '16px 18px', marginBottom: 32, textAlign: 'center',
          boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-muted)', marginBottom: 6 }}>
            If you need immediate support
          </div>
          <a href="tel:988" style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: '#E05252', textDecoration: 'none', fontWeight: 700 }}>
            988
          </a>
          <div style={{ fontSize: 15, color: 'var(--ink-muted)', marginTop: 4 }}>
            Suicide & Crisis Lifeline · Call or Text · Free · 24/7
          </div>
        </div>

        <button
          className="btn btn-ghost btn-block"
          onClick={() => navigate('/dashboard')}
          style={{ marginBottom: 32 }}
        >
          Go to Dashboard
        </button>

        <p style={{ fontSize: 14, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.8, paddingBottom: 16 }}>
          This is a screening instrument, not a clinical diagnostic.<br />
          Results are for your personal awareness and professional use.
        </p>
      </div>
      <NavBar />
    </div>
  )
}
