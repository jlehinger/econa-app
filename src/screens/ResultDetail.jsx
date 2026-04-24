import { useParams, useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { scoreToBand } from '../data/questions.js'

const BAND_META = {
  vitality:  { label: 'Vitality Zone',  color: '#4CAF82', bg: 'rgba(76,175,130,0.1)' },
  stability: { label: 'Stability Zone', color: '#3FA4B5', bg: 'rgba(63,164,181,0.1)' },
  strain:    { label: 'Strain Zone',    color: '#E8981D', bg: 'rgba(232,152,29,0.1)' },
  distress:  { label: 'Distress Zone',  color: '#E05252', bg: 'rgba(224,82,82,0.1)' },
}

const RESOURCES = {
  distress: [
    { color: '#E05252', title: 'Connected Mind Clinicians', body: 'Vetted clinicians who specialize in entrepreneurial mental health. Free initial consultation available.', cta: 'Book a Consultation', link: 'https://connectedmind.com' },
    { color: '#E8803C', title: '988 Crisis Lifeline', body: 'Call or text 988 anytime. For entrepreneurs and all individuals experiencing crisis.', cta: 'Call or Text 988', link: 'https://988lifeline.org' },
    { color: '#3FA4B5', title: 'Econa Crisis Support', body: 'Resources and vetted practitioners who understand the entrepreneurial experience at depth.', cta: 'Find Support', link: 'https://econa.net' },
  ],
  strain: [
    { color: '#E8981D', title: 'Econa Programs', body: 'Workshops and retreats built for founders experiencing strain — resilience before crisis.', cta: 'View Programs', link: 'https://econa.net' },
    { color: '#3FA4B5', title: 'Connected Mind', body: 'Evidence-based mental health tools built for high-performance environments.', cta: 'Visit Connected Mind', link: 'https://connectedmind.com' },
  ],
  stability: [
    { color: '#3FA4B5', title: 'FounderScreen', body: 'Contribute to the global entrepreneur wellbeing dataset and track longitudinally over time.', cta: 'Join FounderScreen', link: 'https://econa.net' },
    { color: '#E8981D', title: 'Econa Programs', body: 'Keynotes, workshops, and retreats to sustain and grow from your stable foundation.', cta: 'View Programs', link: 'https://econa.net' },
    { color: '#4CAF82', title: 'Econaclast Community', body: 'Connect with other stable and thriving founders. Build accountability and share practices.', cta: 'Learn More', link: 'https://econa.net' },
  ],
  vitality: [
    { color: '#4CAF82', title: 'Econaclast Community', body: "You're thriving — now help others get here. Lead, mentor, and build the ecosystem.", cta: 'Join Econaclast', link: 'https://econa.net' },
    { color: '#E8981D', title: "Dr. Freeman's Programs", body: 'Keynote, workshop, and leadership programs from Dr. Freeman — for high-vitality founders ready to amplify impact.', cta: 'Book Dr. Freeman', link: 'https://econa.net' },
    { color: '#3FA4B5', title: 'FounderScreen', body: "Join the global dataset and contribute to the future of founder wellbeing science.", cta: 'Join FounderScreen', link: 'https://econa.net' },
  ],
}

const DOMAIN_CARDS = [
  { key: 'd1', label: 'Thriving & Satisfaction', max: 8,  color: 'var(--flame)' },
  { key: 'd2', label: 'Effectiveness',           max: 8,  color: 'var(--teal)' },
  { key: 'd3', label: 'Burnout & Emotions',      max: 8,  color: 'var(--ember)' },
  { key: 'd4', label: 'Sleep & Recovery',        max: 4,  color: 'var(--vitality)' },
]

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function ResultDetail() {
  const { index } = useParams()
  const navigate = useNavigate()
  const { history, resetAssessment } = useAssessmentStore()

  const idx = parseInt(index, 10)
  const entry = history[idx]

  if (!entry) {
    navigate('/history')
    return null
  }

  const bandKey = entry.band
  const band = BAND_META[bandKey] || BAND_META.stability
  const bandData = scoreToBand(entry.score)
  const domains = entry.domains
  const resources = RESOURCES[bandKey] || RESOURCES.stability

  const handleRetake = () => {
    resetAssessment()
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
      paddingBottom: 90,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header */}
      <div style={{
        padding: '36px 24px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => navigate('/history')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          ← History
        </button>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>
          {idx === 0 ? 'Latest Result' : 'Past Result'}
        </div>
        <div style={{ width: 64 }} />
      </div>

      <div style={{ padding: '24px 24px', flex: 1 }}>
        {/* Date + EconaLogo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
            {formatDate(entry.date)}
          </div>
          <EconaLogo size="sm" />
        </div>

        {/* Score hero */}
        <div style={{
          background: `radial-gradient(ellipse at 10% 0%, ${band.color}18, transparent 65%)`,
          border: `1px solid ${band.color}25`,
          borderLeft: `3px solid ${band.color}`,
          borderRadius: 14,
          padding: '24px 22px',
          marginBottom: 24,
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 72,
              fontWeight: 700,
              color: band.color,
              lineHeight: 1,
              textShadow: `0 0 30px ${band.color}50`,
            }}>
              {entry.score}
            </span>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>/28</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: band.color,
            marginBottom: 16,
          }}>
            {band.label}
          </div>
          {bandData?.description && (
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 15,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.75,
              fontWeight: 300,
            }}>
              {bandData.description}
            </p>
          )}
        </div>

        {/* Domain breakdown */}
        {domains && (
          <>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 12,
            }}>
              By Domain
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {DOMAIN_CARDS.map(d => {
                const val = domains[d.key] ?? 0
                return (
                  <div key={d.key} style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 8,
                    }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}>
                        {d.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                        {val}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/{d.max}</span>
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(val / d.max) * 100}%`,
                        background: d.color,
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Resources surfaced at this time */}
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 12,
        }}>
          Resources Surfaced
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {resources.map((r, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '18px 18px',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                letterSpacing: '0.05em',
                color: '#fff',
                marginBottom: 6,
              }}>
                {r.title}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>
                {r.body}
              </p>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: r.color,
                  textDecoration: 'none',
                }}
              >
                {r.cta} →
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={handleRetake}
          style={{
            background: 'linear-gradient(135deg, var(--ember), var(--flame))',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '17px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-body)',
            marginBottom: 8,
            boxShadow: '0 4px 20px rgba(232,152,29,0.28)',
            letterSpacing: '0.03em',
          }}
        >
          Retake the Check →
        </button>

        <p style={{
          marginTop: 12,
          fontSize: 10,
          color: 'rgba(255,255,255,0.12)',
          textAlign: 'center',
          lineHeight: 1.8,
          paddingBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          This is a screening instrument, not a clinical diagnostic.
        </p>
      </div>

      <NavBar />
    </div>
  )
}
