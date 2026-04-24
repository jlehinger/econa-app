import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

const BAND_META = {
  vitality:  { label: 'Vitality',  color: '#4CAF82', bg: 'rgba(76,175,130,0.12)' },
  stability: { label: 'Stability', color: '#3FA4B5', bg: 'rgba(63,164,181,0.12)' },
  strain:    { label: 'Strain',    color: '#E8981D', bg: 'rgba(232,152,29,0.12)' },
  distress:  { label: 'Distress',  color: '#E05252', bg: 'rgba(224,82,82,0.12)' },
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

function TrendChart({ history }) {
  const chronological = [...history].reverse()
  const N = chronological.length

  const W = 340
  const H = 130
  const padX = 28
  const padY = 18

  const xs = chronological.map((_, i) =>
    N === 1 ? W / 2 : padX + (i / (N - 1)) * (W - 2 * padX)
  )
  const ys = chronological.map(p =>
    padY + ((28 - p.score) / 28) * (H - 2 * padY)
  )

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ')
  const fillPath = N > 1
    ? `${linePath} L ${xs[N - 1]} ${H} L ${xs[0]} ${H} Z`
    : ''

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8981D" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#E8981D" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal band zone lines */}
      {[
        { score: 22, color: '#4CAF82', label: '22' },
        { score: 17, color: '#3FA4B5', label: '17' },
        { score: 12, color: '#E8981D', label: '12' },
      ].map(({ score, color, label }) => {
        const y = padY + ((28 - score) / 28) * (H - 2 * padY)
        return (
          <g key={score}>
            <line x1={0} y1={y} x2={W} y2={y} stroke={color} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.25" />
            <text x={4} y={y - 3} fontSize="8" fill={color} opacity="0.5" fontFamily="DM Sans, sans-serif">{label}</text>
          </g>
        )
      })}

      {/* Fill */}
      {N > 1 && <path d={fillPath} fill="url(#chartFill)" />}

      {/* Line */}
      {N > 1 && (
        <path
          d={linePath}
          fill="none"
          stroke="rgba(232,152,29,0.55)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Dots */}
      {chronological.map((entry, i) => {
        const meta = BAND_META[entry.band] || BAND_META.stability
        return (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r={8} fill={meta.color} opacity={0.15} />
            <circle cx={xs[i]} cy={ys[i]} r={4} fill={meta.color} />
          </g>
        )
      })}
    </svg>
  )
}

export default function History() {
  const navigate = useNavigate()
  const { history, resetAssessment } = useAssessmentStore()

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

      <div style={{
        padding: '36px 24px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <EconaLogo size="sm" />
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>
          Wellbeing History
        </div>
      </div>

      <div style={{ padding: '28px 24px', flex: 1 }}>
        {history.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '52px 28px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 20, opacity: 0.2 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 22,
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#fff',
              marginBottom: 10,
              lineHeight: 1.4,
            }}>
              Your timeline starts here
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
              Complete your first check to begin tracking your wellbeing over time.
            </p>
            <button
              onClick={handleRetake}
              style={{
                background: 'linear-gradient(135deg, var(--ember), var(--flame))',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 20px rgba(232,152,29,0.28)',
              }}
            >
              Take the Check →
            </button>
          </div>
        ) : (
          <>
            {/* Trend chart */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '20px 16px 14px',
              marginBottom: 20,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 12,
                paddingLeft: 4,
                paddingRight: 4,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                }}>
                  Score Trend
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
                  out of 28
                </div>
              </div>

              <TrendChart history={history} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: 4,
                paddingRight: 4,
                marginTop: 8,
              }}>
                {[
                  { label: 'Distress', color: '#E05252' },
                  { label: 'Strain',   color: '#E8981D' },
                  { label: 'Stability', color: '#3FA4B5' },
                  { label: 'Vitality', color: '#4CAF82' },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, opacity: 0.6 }} />
                    <span style={{ fontSize: 9, color: color, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>{label}</span>
                  </div>
                ))}
              </div>
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
                marginBottom: 32,
                boxShadow: '0 4px 20px rgba(232,152,29,0.28)',
                letterSpacing: '0.03em',
              }}
            >
              Retake the Check →
            </button>

            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 14,
            }}>
              All Assessments · {history.length} {history.length === 1 ? 'result' : 'results'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((entry, i) => {
                const meta = BAND_META[entry.band] || BAND_META.stability
                return (
                  <button
                    key={i}
                    onClick={() => navigate(`/history/${i}`)}
                    style={{
                      background: i === 0 ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${i === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 14,
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                        {i === 0 && (
                          <span style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--flame)',
                            background: 'rgba(232,152,29,0.12)',
                            padding: '2px 8px',
                            borderRadius: 100,
                            border: '1px solid rgba(232,152,29,0.2)',
                          }}>Latest</span>
                        )}
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{formatDate(entry.date)}</span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        background: meta.bg,
                        border: `1px solid ${meta.color}30`,
                        borderRadius: 100,
                        padding: '3px 10px',
                      }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: meta.color }}>
                        {entry.score}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>/28</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>

            <p style={{
              marginTop: 32,
              fontSize: 10,
              color: 'rgba(255,255,255,0.12)',
              textAlign: 'center',
              lineHeight: 1.8,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              paddingBottom: 8,
            }}>
              History stored locally · Cloud sync via Supabase
            </p>
          </>
        )}
      </div>

      <NavBar />
    </div>
  )
}
