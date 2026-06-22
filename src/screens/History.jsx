import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { BANDS } from '../data/questions.js'

// Band labels/colors come from the one scale in questions.js — never redefine them locally.
// Each band also gets a distinct SHAPE so chart marks are readable without color vision.
const BAND_META = Object.fromEntries(
  Object.values(BANDS).map(b => [b.key, { label: b.label, color: b.color, bg: `${b.color}1F` }])
)

const BAND_SHAPES = {
  vitality:  'circle',
  stability: 'diamond',
  strain:    'square',
  distress:  'triangle',
}

// One SVG mark per band: shape + color together, so two bands never differ by hue alone.
function BandMark({ band, cx, cy, r = 4.5, fill }) {
  const shape = BAND_SHAPES[band] || 'circle'
  if (shape === 'square') {
    return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={1} fill={fill} />
  }
  if (shape === 'diamond') {
    return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={1} fill={fill} transform={`rotate(45 ${cx} ${cy})`} />
  }
  if (shape === 'triangle') {
    return <polygon points={`${cx},${cy - r * 1.2} ${cx + r * 1.2},${cy + r} ${cx - r * 1.2},${cy + r}`} fill={fill} />
  }
  return <circle cx={cx} cy={cy} r={r} fill={fill} />
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
          <stop offset="0%" stopColor="#D4A03C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4A03C" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal band zone lines */}
      {[
        { score: 22, color: BANDS.vitality.color, label: '22' },
        { score: 17, color: BANDS.stability.color, label: '17' },
        { score: 12, color: BANDS.strain.color, label: '12' },
      ].map(({ score, color, label }) => {
        const y = padY + ((28 - score) / 28) * (H - 2 * padY)
        return (
          <g key={score}>
            <line x1={0} y1={y} x2={W} y2={y} stroke={color} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.25" />
            <text x={4} y={y - 3} fontSize="8" fill={color} opacity="0.5" fontFamily="Inter, sans-serif">{label}</text>
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
          stroke="rgba(212,160,60,0.55)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Marks — shape + color per band, latest point also labeled with its band name */}
      {chronological.map((entry, i) => {
        const meta = BAND_META[entry.band] || BAND_META.stability
        const isLatest = i === N - 1
        return (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r={8} fill={meta.color} opacity={0.15} />
            <BandMark band={entry.band} cx={xs[i]} cy={ys[i]} fill={meta.color} />
            {isLatest && (
              <text
                x={xs[i]}
                y={ys[i] - 12}
                fontSize="12"
                fontWeight="600"
                fill="var(--ink)"
                textAnchor={N === 1 ? 'middle' : 'end'}
                fontFamily="Inter, sans-serif"
              >
                {meta.label} · {entry.score}
              </text>
            )}
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
      background: 'var(--surface)',
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
        borderBottom: '1px solid var(--hairline)',
      }}>
        <EconaLogo size="md" mark variant="color" />
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: 'var(--ink-muted)',
        }}>
          Resilience history
        </div>
      </div>

      <div style={{ padding: '28px 24px', flex: 1 }}>
        {history.length === 0 ? (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            borderRadius: 16,
            padding: '52px 28px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 20, opacity: 0.2 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 22,
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--ink)',
              marginBottom: 10,
              lineHeight: 1.4,
            }}>
              Your timeline starts here
            </div>
            <p style={{ fontSize: 16, color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 28 }}>
              Complete your first check to begin tracking your wellbeing over time.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleRetake}
            >
              Take the Check →
            </button>
          </div>
        ) : (
          <>
            {/* Trend chart */}
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--hairline)',
              borderRadius: 16,
              padding: '20px 16px 14px',
              marginBottom: 20,
              boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
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
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--ink-muted)',
                }}>
                  Score trend
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', letterSpacing: '0.02em' }}>
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
                {['distress', 'strain', 'stability', 'vitality'].map(key => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <BandMark band={key} cx={5} cy={5} r={4} fill={BAND_META[key].color} />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: BAND_META[key].color }}>{BAND_META[key].label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleRetake}
              style={{
                marginBottom: 32,
              }}
            >
              Retake the Check →
            </button>

            <div style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--ink-muted)',
              marginBottom: 14,
            }}>
              All assessments · {history.length} {history.length === 1 ? 'result' : 'results'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((entry, i) => {
                const meta = BAND_META[entry.band] || BAND_META.stability
                return (
                  <button
                    key={i}
                    onClick={() => navigate(`/history/${i}`)}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 14,
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                      boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,43,76,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                        {i === 0 && (
                          <span style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--flame-bright)',
                            background: 'rgba(212,160,60,0.12)',
                            padding: '2px 8px',
                            borderRadius: 100,
                            border: '1px solid rgba(212,160,60,0.2)',
                          }}>Latest</span>
                        )}
                        <span style={{ fontSize: 15, color: 'var(--ink-muted)' }}>{formatDate(entry.date)}</span>
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
                        <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: meta.color }}>
                        {entry.score}<span style={{ fontSize: 16, color: 'var(--ink-muted)', fontWeight: 400 }}>/28</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="rgba(15,43,76,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>

          </>
        )}
      </div>

      <NavBar />
    </div>
  )
}
