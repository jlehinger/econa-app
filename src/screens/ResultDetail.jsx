import { useParams, useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { scoreToBand, BANDS } from '../data/questions.js'
import { CONNECTED_MIND_URL } from '../lib/links.js'

// Band labels/colors come from the one scale in questions.js — never redefine them locally.
const BAND_META = Object.fromEntries(
  Object.values(BANDS).map(b => [b.key, { label: b.label, color: b.color, bg: `${b.color}1A` }])
)

const RESOURCES = {
  distress: [
    { color: '#E05252', title: 'Connected Mind Clinicians', body: 'Vetted clinicians who specialize in entrepreneurial mental health. Free initial consultation available.', cta: 'Book a Consultation', link: CONNECTED_MIND_URL },
    { color: '#E8803C', title: '988 Crisis Lifeline', body: 'Call or text 988 anytime. For entrepreneurs and all individuals experiencing crisis.', cta: 'Call or Text 988', link: 'https://988lifeline.org' },
    { color: BANDS.stability.color, title: 'Econa Crisis Support', body: 'Resources and vetted practitioners who understand the entrepreneurial experience at depth.', cta: 'Find Support', link: 'https://econa.net' },
  ],
  strain: [
    { color: '#D4A03C', title: 'Econa Programs', body: 'Workshops and retreats built for founders experiencing strain — resilience before crisis.', cta: 'View Programs', link: 'https://econa.net' },
    { color: BANDS.stability.color, title: 'Connected Mind', body: 'Evidence-based mental health tools built for high-performance environments.', cta: 'Visit Connected Mind', link: CONNECTED_MIND_URL },
  ],
  stability: [
    { color: BANDS.stability.color, title: 'FounderScreen', body: 'Contribute to the global entrepreneur wellbeing dataset and track longitudinally over time.', cta: 'Join FounderScreen', link: 'https://econa.net' },
    { color: '#D4A03C', title: 'Econa Programs', body: 'Keynotes, workshops, and retreats to sustain and grow from your stable foundation.', cta: 'View Programs', link: 'https://econa.net' },
    { color: '#4CAF82', title: 'Econaclast Community', body: 'Connect with other stable and thriving founders. Build accountability and share practices.', cta: 'Learn More', link: 'https://econa.net' },
  ],
  vitality: [
    { color: '#4CAF82', title: 'Econaclast Community', body: "You're thriving — now help others get here. Lead, mentor, and build the ecosystem.", cta: 'Join Econaclast', link: 'https://econa.net' },
    { color: '#D4A03C', title: "Dr. Freeman's Programs", body: 'Keynote, workshop, and leadership programs from Dr. Freeman — for high-vitality founders ready to amplify impact.', cta: 'Book Dr. Freeman', link: 'https://econa.net' },
    { color: BANDS.stability.color, title: 'FounderScreen', body: "Join the global dataset and contribute to the future of founder wellbeing science.", cta: 'Join FounderScreen', link: 'https://econa.net' },
  ],
}

const DOMAIN_CARDS = [
  { key: 'wellbeing',    label: 'Wellbeing',                max: 12, color: 'var(--flame)' },
  { key: 'occupational', label: 'Occupational Functioning', max: 8,  color: 'var(--teal)' },
  { key: 'emotional',    label: 'Emotional Stability',      max: 8,  color: 'var(--ember)' },
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
  const domains = entry.domainScores
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
          className="btn btn-ghost"
          onClick={() => navigate('/history')}
        >
          ← History
        </button>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.68)',
        }}>
          {idx === 0 ? 'Latest result' : 'Past result'}
        </div>
        <div style={{ width: 64 }} />
      </div>

      <div style={{ padding: '24px 24px', flex: 1 }}>
        {/* Date + EconaLogo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.02em' }}>
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
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.68)', marginBottom: 8 }}>/28</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
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
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.75,
              fontWeight: 400,
            }}>
              {bandData.description}
            </p>
          )}
        </div>

        {/* Domain breakdown */}
        {domains && (
          <>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.68)',
              marginBottom: 12,
            }}>
              By domain
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
                        letterSpacing: '0.05em',
                        color: 'rgba(255,255,255,0.68)',
                      }}>
                        {d.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                        {val}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)', fontWeight: 400 }}>/{d.max}</span>
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
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.68)',
          marginBottom: 12,
        }}>
          Resources surfaced
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
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 12 }}>
                {r.body}
              </p>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
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
          className="btn btn-primary btn-block"
          onClick={handleRetake}
          style={{
            marginBottom: 8,
          }}
        >
          Retake the Check →
        </button>

        <p style={{
          marginTop: 12,
          fontSize: 11,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          lineHeight: 1.8,
          paddingBottom: 8,
        }}>
          This is a screening instrument, not a clinical diagnostic.
        </p>
      </div>

      <NavBar />
    </div>
  )
}
