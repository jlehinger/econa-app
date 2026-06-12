import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { LABS } from '../data/labs.js'

const SECTIONS = [
  { id: 'assessment', label: 'How am I doing?',    short: 'Assess',   icon: '◎' },
  { id: 'action',     label: 'What to do now?',    short: 'Act',      icon: '⚡' },
  { id: 'better',     label: 'Get even better?',   short: 'Better',   icon: '↑' },
  { id: 'resources',  label: 'Where to look?',     short: 'Resources',icon: '◈' },
  { id: 'motivation', label: 'Why try?',            short: 'Why',      icon: '★' },
]

export default function LabDetail() {
  const { labId } = useParams()
  const navigate = useNavigate()
  const { itemScores, startLab, markLabSection } = useAssessmentStore()
  const [activeSection, setActiveSection] = useState('assessment')

  const lab = LABS.find(l => l.id === labId)

  useEffect(() => {
    if (!lab) { navigate('/labs'); return }
    if (lab.available) startLab(lab.id)
  }, [lab?.id, navigate, startLab])

  useEffect(() => {
    if (lab) markLabSection(lab.id, activeSection)
  }, [activeSection, lab?.id, markLabSection])

  if (!lab) return null
  if (!lab.available) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--void)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', textAlign: 'center', marginBottom: 32 }}>
          The {lab.title} lab is coming in Phase 2.
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/labs')}>
          Back to Labs
        </button>
        <NavBar />
      </div>
    )
  }

  const userScore = itemScores[lab.ewcIndex] ?? '—'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--void)', display: 'flex', flexDirection: 'column', maxWidth: '480px', margin: '0 auto', paddingBottom: 80 }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${lab.color}, ${lab.color}99)`, zIndex: 200 }} />

      {/* Header */}
      <div style={{ padding: '48px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `radial-gradient(ellipse at 50% 0%, ${lab.color}10 0%, transparent 70%)` }}>
        <button className="btn btn-ghost" onClick={() => navigate('/labs')} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
          ← Labs
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: lab.color, marginBottom: 6 }}>
              Econa Lab
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 6 }}>
              {lab.title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{lab.tagline}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: lab.color }}>{userScore}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)' }}>/ 4</div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              flex: '0 0 auto', padding: '14px 16px', background: 'none', border: 'none',
              borderBottom: activeSection === s.id ? `2px solid ${lab.color}` : '2px solid transparent',
              color: activeSection === s.id ? lab.color : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
          >
            {s.short}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div style={{ padding: '28px 24px', flex: 1 }}>
        {activeSection === 'assessment' && <AssessmentSection lab={lab} color={lab.color} />}
        {activeSection === 'action' && <ActionSection lab={lab} color={lab.color} />}
        {activeSection === 'better' && <BetterSection lab={lab} color={lab.color} />}
        {activeSection === 'resources' && <ResourcesSection lab={lab} color={lab.color} />}
        {activeSection === 'motivation' && <MotivationSection lab={lab} color={lab.color} />}
      </div>

      <NavBar />
    </div>
  )
}

function SectionLabel({ text, color }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color, marginBottom: 16 }}>
      {text}
    </div>
  )
}

function Card({ children, color, highlight }) {
  return (
    <div style={{
      background: highlight ? `${color}08` : 'rgba(255,255,255,0.04)',
      border: highlight ? `1px solid ${color}25` : '1px solid rgba(255,255,255,0.07)',
      borderLeft: highlight ? `3px solid ${color}` : undefined,
      borderRadius: 14, padding: '18px', marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

function getBMS10Band(score) {
  if (score === null || score === '') return null
  const n = parseFloat(score)
  if (isNaN(n)) return null
  if (n <= 2.4)  return { label: 'Very Low Burnout',          color: '#4ade80', urgent: false }
  if (n <= 3.4)  return { label: 'Danger Signs',              color: '#facc15', urgent: false }
  if (n <= 4.4)  return { label: 'Burnout',                   color: '#fb923c', urgent: false }
  if (n <= 5.4)  return { label: 'Very Serious',              color: '#f97316', urgent: false }
  return           { label: 'Requires Immediate Support',     color: '#ef4444', urgent: true  }
}

function BMS10Calculator({ color }) {
  const navigate = useNavigate()
  const [scoreInput, setScoreInput] = useState('')
  const band = getBMS10Band(scoreInput)

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color, marginBottom: 14 }}>
        Calculate your score
      </div>

      <Card color={color}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 6 }}>
          Average item score
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 12, lineHeight: 1.5 }}>
          Enter your average (add all 10 item scores, divide by 10)
        </div>
        <input
          type="number"
          min={1}
          max={7}
          step={0.1}
          value={scoreInput}
          onChange={e => setScoreInput(e.target.value)}
          placeholder="1.0 – 7.0"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)',
            border: band ? `1px solid ${band.color}50` : '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 18,
            fontFamily: 'var(--font-display)',
            color: band ? band.color : '#fff',
            outline: 'none',
            letterSpacing: '0.04em',
          }}
        />

        {band && (
          <div style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: `${band.color}12`,
            border: `1px solid ${band.color}30`,
            borderRadius: 10,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: band.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: band.color }}>{band.label}</span>
          </div>
        )}
      </Card>

      {band?.urgent && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderLeft: '3px solid #ef4444',
          borderRadius: 14,
          padding: '18px',
          marginTop: 4,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#ef4444', marginBottom: 8 }}>
            Professional support recommended
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: 16 }}>
            Your score suggests you may benefit from immediate professional support. Connected Mind offers confidential care designed for entrepreneurs.
          </p>
          <button
            onClick={() => navigate('/triage')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              border: 'none',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              color: '#fff',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Connect with CM Support →
          </button>
        </div>
      )}
    </div>
  )
}

const ER_INSTRUMENTS = [
  {
    key: 'gad7',
    label: 'GAD-7',
    sublabel: 'Generalized Anxiety',
    hint: 'Sum all 7 items (each 0–3)',
    min: 0, max: 21, step: 1,
    placeholder: '0 – 21',
    getBand: (n) => {
      if (n <= 4)  return { label: 'Minimal Anxiety',   color: '#4ade80', urgent: false }
      if (n <= 9)  return { label: 'Mild Anxiety',      color: '#facc15', urgent: false }
      if (n <= 14) return { label: 'Moderate Anxiety',  color: '#fb923c', urgent: true  }
      return             { label: 'Severe Anxiety',     color: '#ef4444', urgent: true  }
    },
  },
  {
    key: 'phq9',
    label: 'PHQ-9',
    sublabel: 'Depression',
    hint: 'Sum all 9 items (each 0–3)',
    min: 0, max: 27, step: 1,
    placeholder: '0 – 27',
    getBand: (n) => {
      if (n <= 4)  return { label: 'Minimal Depression',          color: '#4ade80', urgent: false }
      if (n <= 9)  return { label: 'Mild Depression',             color: '#facc15', urgent: false }
      if (n <= 14) return { label: 'Moderate Depression',         color: '#fb923c', urgent: true  }
      if (n <= 19) return { label: 'Moderately Severe Depression',color: '#f97316', urgent: true  }
      return             { label: 'Severe Depression',            color: '#ef4444', urgent: true  }
    },
  },
  {
    key: 'bpaq',
    label: 'BPAQ-SF',
    sublabel: 'Anger & Hostility',
    hint: 'Sum all 12 items (each 1–5)',
    min: 12, max: 60, step: 1,
    placeholder: '12 – 60',
    getBand: (n) => {
      if (n < 30)  return { label: 'Low',                    color: '#4ade80', urgent: false }
      if (n < 45)  return { label: 'Moderate',               color: '#facc15', urgent: false }
      return             { label: 'Clinically Significant',  color: '#ef4444', urgent: true  }
    },
  },
]

function EmotionRegCalculator({ color }) {
  const navigate = useNavigate()
  const [scores, setScores] = useState({ gad7: '', phq9: '', bpaq: '' })

  const results = ER_INSTRUMENTS.map(inst => {
    const raw = scores[inst.key]
    if (raw === '' || raw === null) return { inst, band: null }
    const n = parseInt(raw, 10)
    if (isNaN(n)) return { inst, band: null }
    return { inst, band: inst.getBand(n) }
  })

  const anyUrgent = results.some(r => r.band?.urgent)

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color, marginBottom: 14 }}>
        Calculate your scores
      </div>

      {results.map(({ inst, band }) => (
        <Card key={inst.key} color={color}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#fff', fontWeight: 600 }}>{inst.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.05em' }}>{inst.sublabel}</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>{inst.hint}</div>
          <input
            type="number"
            min={inst.min}
            max={inst.max}
            step={inst.step}
            value={scores[inst.key]}
            onChange={e => setScores(prev => ({ ...prev, [inst.key]: e.target.value }))}
            placeholder={inst.placeholder}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)',
              border: band ? `1px solid ${band.color}50` : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '11px 14px',
              fontSize: 17,
              fontFamily: 'var(--font-display)',
              color: band ? band.color : '#fff',
              outline: 'none',
            }}
          />
          {band && (
            <div style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: `${band.color}12`,
              border: `1px solid ${band.color}30`,
              borderRadius: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: band.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: band.color }}>{band.label}</span>
            </div>
          )}
        </Card>
      ))}

      {anyUrgent && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderLeft: '3px solid #ef4444',
          borderRadius: 14,
          padding: '18px',
          marginTop: 4,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#ef4444', marginBottom: 8 }}>
            Professional support recommended
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: 16 }}>
            One or more of your scores suggests you may benefit from professional support. Connected Mind offers confidential care designed for entrepreneurs.
          </p>
          <button
            onClick={() => navigate('/triage')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              border: 'none',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              color: '#fff',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Connect with CM Support →
          </button>
        </div>
      )}
    </div>
  )
}

function AssessmentSection({ lab, color }) {
  const a = lab.assessment
  if (!a) return <PlaceholderSection message="Assessment content coming soon." />
  return (
    <>
      <SectionLabel text="How am I doing?" color={color} />
      <Card color={color} highlight>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{a.instrumentName}</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: 12 }}>{a.description}</p>
        <div style={{ fontSize: 11, color: color, fontWeight: 600, marginBottom: 8 }}>Scoring</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 12 }}>{a.scoring}</p>
        {a.trackingNote && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{a.trackingNote}</p>}
      </Card>
      <Card color={color}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Citation</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>{a.citation}</p>
      </Card>
      {lab.id === 'burnout' && <BMS10Calculator color={color} />}
      {lab.id === 'emotional-regulation' && <EmotionRegCalculator color={color} />}
    </>
  )
}

function ActionSection({ lab, color }) {
  const a = lab.action
  if (!a) return <PlaceholderSection message="Action content coming soon." />
  return (
    <>
      <SectionLabel text="What should I do now?" color={color} />
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 18, color: '#fff', fontWeight: 400, lineHeight: 1.4, marginBottom: 20 }}>{a.headline}</p>
      {a.interventions.map((item, i) => (
        <Card key={i} color={color} highlight={i === 0}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{item.title}</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: item.source ? 10 : 0 }}>{item.body}</p>
          {item.source && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic' }}>Source: {item.source}</div>}
        </Card>
      ))}
    </>
  )
}

function BetterSection({ lab, color }) {
  const b = lab.better
  if (!b) return <PlaceholderSection message="Long-term practices content coming soon." />
  return (
    <>
      <SectionLabel text="How can I get even better?" color={color} />
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 18, color: '#fff', fontWeight: 400, lineHeight: 1.4, marginBottom: 20 }}>{b.headline}</p>
      {b.practices.map((p, i) => (
        <Card key={i} color={color}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{p.title}</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65 }}>{p.body}</p>
        </Card>
      ))}
    </>
  )
}

function ResourcesSection({ lab, color }) {
  const r = lab.resources
  if (!r) return <PlaceholderSection message="Resources content coming soon." />
  const categories = [
    { key: 'apps', label: 'Apps & Tools' },
    { key: 'books', label: 'Books' },
    { key: 'podcasts', label: 'Podcasts' },
    { key: 'websites', label: 'Websites' },
  ]
  return (
    <>
      <SectionLabel text="Where can I find helpful resources?" color={color} />
      {categories.map(cat => {
        const items = r[cat.key]
        if (!items?.length) return null
        return (
          <div key={cat.key} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>{cat.label}</div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 6 }} />
                <div>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: color, textDecoration: 'none' }}>{item.name}</a>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.name}</span>
                  )}
                  {item.note && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}

function MotivationSection({ lab, color }) {
  const messages = lab.motivation
  if (!messages?.length) return <PlaceholderSection message="Motivational content coming soon." />
  return (
    <>
      <SectionLabel text="Why should I try?" color={color} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)`,
            borderLeft: i === 0 ? `3px solid ${color}` : undefined,
            borderRadius: 12, padding: '18px 18px',
          }}>
            <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.82)', fontWeight: 400, lineHeight: 1.65 }}>
              "{msg}"
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

function PlaceholderSection({ message }) {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{message}</p>
    </div>
  )
}
