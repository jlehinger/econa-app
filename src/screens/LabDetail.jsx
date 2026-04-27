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
    startLab(lab.id)
  }, [lab?.id, navigate, startLab])

  useEffect(() => {
    if (lab) markLabSection(lab.id, activeSection)
  }, [activeSection, lab?.id, markLabSection])

  if (!lab) return null
  if (!lab.available) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--void)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 32 }}>
          The {lab.title} lab is coming in Phase 2.
        </div>
        <button onClick={() => navigate('/labs')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', borderRadius: 14, padding: '14px 28px', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
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
        <button onClick={() => navigate('/labs')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
          ← Labs
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: lab.color, marginBottom: 6 }}>
              Econa Lab
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 6 }}>
              {lab.title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{lab.tagline}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: lab.color }}>{userScore}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>/ 4</div>
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
              color: activeSection === s.id ? lab.color : 'rgba(255,255,255,0.3)',
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
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 16 }}>
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

function AssessmentSection({ lab, color }) {
  const a = lab.assessment
  if (!a) return <PlaceholderSection message="Assessment content coming soon." />
  return (
    <>
      <SectionLabel text="How am I doing?" color={color} />
      <Card color={color} highlight>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{a.instrumentName}</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 12 }}>{a.description}</p>
        <div style={{ fontSize: 11, color: color, fontWeight: 600, marginBottom: 8 }}>Scoring</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>{a.scoring}</p>
        {a.trackingNote && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{a.trackingNote}</p>}
      </Card>
      <Card color={color}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Citation</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{a.citation}</p>
      </Card>
    </>
  )
}

function ActionSection({ lab, color }) {
  const a = lab.action
  if (!a) return <PlaceholderSection message="Action content coming soon." />
  return (
    <>
      <SectionLabel text="What should I do now?" color={color} />
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 18, fontStyle: 'italic', color: '#fff', fontWeight: 300, lineHeight: 1.4, marginBottom: 20 }}>{a.headline}</p>
      {a.interventions.map((item, i) => (
        <Card key={i} color={color} highlight={i === 0}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{item.title}</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: item.source ? 10 : 0 }}>{item.body}</p>
          {item.source && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Source: {item.source}</div>}
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
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 18, fontStyle: 'italic', color: '#fff', fontWeight: 300, lineHeight: 1.4, marginBottom: 20 }}>{b.headline}</p>
      {b.practices.map((p, i) => (
        <Card key={i} color={color}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', marginBottom: 8 }}>{p.title}</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{p.body}</p>
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
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>{cat.label}</div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 6 }} />
                <div>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: color, textDecoration: 'none' }}>{item.name}</a>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.name}</span>
                  )}
                  {item.note && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{item.note}</div>}
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
            <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, fontStyle: 'italic', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.65 }}>
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
      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>{message}</p>
    </div>
  )
}
