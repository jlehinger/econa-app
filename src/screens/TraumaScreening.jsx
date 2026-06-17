import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'
import {
  TRIGGER, EB_PTSD, PC_PTSD, PART2, POSITIVE_MESSAGE, OPEN_QUESTIONS, scoreTrauma,
} from '../data/trauma.js'

const ACCENT = '#7E5A86' // calm plum — distinct, serious, complements navy/gold
const ROSE = '#9E3B53'
const GREEN = '#2E9E6B'

const shell = {
  minHeight: '100dvh', background: 'var(--surface)', display: 'flex',
  flexDirection: 'column', maxWidth: 480, margin: '0 auto', padding: '20px 28px 100px',
}

export default function TraumaScreening() {
  const navigate = useNavigate()
  const { setTraumaResult, startLab, markLabSection } = useAssessmentStore()

  const [step, setStep] = useState('intro')   // intro|trigger|declined|labintro|eb|pc|part2|result
  const [ebExp, setEbExp] = useState(null)
  const [pcExp, setPcExp] = useState(null)
  const [part2, setPart2] = useState([null, null, null, null, null])
  const [result, setResult] = useState(null)
  const [showNotes, setShowNotes] = useState(false)

  const exit = () => navigate('/labs/trauma')

  const finish = (outcome) => {
    setResult(outcome)
    markLabSection('trauma', 'assessment')
    setTraumaResult({
      exposure: outcome.screen !== 'none',
      symptomYes: outcome.symptomYes,
      screen: outcome.screen,
      takenAt: new Date().toISOString(),
    })
    setStep('result')
  }

  const afterExposure = (pc) => {
    if (ebExp === false && pc === false) {
      finish(scoreTrauma({ exposed: false, part2: [] }))
    } else {
      setStep('part2')
    }
  }

  const setSymptom = (i, val) => {
    const next = [...part2]; next[i] = val; setPart2(next)
  }

  const scoreNow = () => {
    finish(scoreTrauma({ exposed: ebExp || pcExp, part2: part2.map(Boolean) }))
  }

  return (
    <div style={shell}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT}, var(--flame))`, zIndex: 200 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={exit}>← Trauma Lab</button>
        <EconaLogo size="md" mark variant="color" />
      </div>

      <DraftBanner show={showNotes} toggle={() => setShowNotes(s => !s)} />

      {step === 'intro' && <Intro onBegin={() => { startLab('trauma'); setStep('trigger') }} />}
      {step === 'trigger' && (
        <Question
          eyebrow={TRIGGER.eyebrow} stem={TRIGGER.text} help={TRIGGER.help}
          onYes={() => setStep('labintro')} onNo={() => setStep('declined')}
        />
      )}
      {step === 'declined' && (
        <Outcome tone={GREEN} ring="✓" title="Thanks — on to your EWC results"
          body="No trauma history noted. We’ll take you to your personalized Entrepreneur Wellbeing Check results and resources."
          cta="Back to Labs" onCta={() => navigate('/labs')} />
      )}
      {step === 'labintro' && <LabIntro onBegin={() => setStep('eb')} />}
      {step === 'eb' && (
        <Exposure data={EB_PTSD} provenance={EB_PTSD.provenance}
          onAnswer={(v) => { setEbExp(v); setStep('pc') }} />
      )}
      {step === 'pc' && (
        <Exposure data={PC_PTSD}
          onAnswer={(v) => { setPcExp(v); afterExposure(v) }} />
      )}
      {step === 'part2' && (
        <Part2 answers={part2} onSet={setSymptom} onDone={scoreNow} />
      )}
      {step === 'result' && result && (
        <Result result={result} navigate={navigate} onRestart={() => navigate('/labs/trauma')} />
      )}

      <NavBar />
    </div>
  )
}

// ── DRAFT banner + collapsible notes ────────────────────────────────────────
function DraftBanner({ show, toggle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div onClick={toggle} style={{
        background: 'rgba(200,138,30,0.08)', border: '1px solid rgba(200,138,30,0.4)',
        borderLeft: '3px solid var(--flame)', borderRadius: 10, padding: '11px 14px',
        fontSize: 13.5, color: 'var(--ink-soft)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontWeight: 700, color: 'var(--flame-bright)', letterSpacing: '0.04em' }}>DRAFT</span>
        <span>Trauma Lab — for review, not live. {show ? 'Hide' : 'See'} what we still need to confirm.</span>
        <span style={{ marginLeft: 'auto' }}>{show ? '▴' : '▾'}</span>
      </div>
      {show && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {OPEN_QUESTIONS.map((q, i) => (
            <div key={i} style={{
              background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: 9,
              padding: '10px 13px',
            }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginBottom: 2 }}>★ {q.h}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{q.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Intro({ onBegin }) {
  return (
    <>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 34, fontStyle: 'italic', color: 'var(--ink)', margin: '8px 0 12px', fontWeight: 400, lineHeight: 1.15 }}>
        The Trauma Lab
      </div>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 28 }}>
        Entrepreneurship can carry real trauma — from business and from life. This short, confidential check-in helps you understand whether what you’re carrying is worth talking through with a professional.
      </p>
      <button className="btn btn-primary btn-block" onClick={onBegin}>Continue →</button>
    </>
  )
}

function LabIntro({ onBegin }) {
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>Trauma Lab</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 26, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 12, fontWeight: 400 }}>A short, confidential check-in</div>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 18 }}>
        Two brief screens, then five questions about the past month. About two minutes. Your answers are confidential.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {['Part 1a — business-related experiences', 'Part 1b — general life experiences', 'Part 2 — how you’ve felt in the past month'].map(t => (
          <div key={t} style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: 9, padding: '11px 14px', fontSize: 14.5, color: 'var(--ink-soft)' }}>{t}</div>
        ))}
      </div>
      <button className="btn btn-primary btn-block" onClick={onBegin}>Begin →</button>
    </>
  )
}

function Question({ eyebrow, stem, help, onYes, onNo }) {
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 24, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 10, fontStyle: 'italic', fontWeight: 400 }}>{stem}</div>
      {help && <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', marginBottom: 22 }}>{help}</p>}
      <YesNo onYes={onYes} onNo={onNo} />
    </>
  )
}

function Exposure({ data, provenance, onAnswer }) {
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>{data.code} · Part 1</div>
      <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 12, fontWeight: 500 }}>{data.stem}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: provenance ? 12 : 20 }}>
        {data.examples.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            <span style={{ color: ACCENT, flexShrink: 0 }}>•</span><span>{e}</span>
          </div>
        ))}
      </div>
      {provenance && (
        <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', fontStyle: 'italic', background: 'rgba(15,43,76,0.04)', borderLeft: `2px solid ${ACCENT}`, borderRadius: 8, padding: '9px 12px', marginBottom: 20 }}>
          {data.title} — {provenance}
        </div>
      )}
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>{data.gate}</div>
      <YesNo onYes={() => onAnswer(true)} onNo={() => onAnswer(false)} />
    </>
  )
}

function Part2({ answers, onSet, onDone }) {
  const done = answers.every(a => a !== null)
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>Shared Part 2 — past month</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, color: 'var(--ink)', marginBottom: 4, fontStyle: 'italic', fontWeight: 400 }}>{PART2.stem}</div>
      <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', marginBottom: 18 }}>Answer for the event(s) you noted.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {PART2.items.map((item, i) => (
          <div key={i} style={{ border: '1px solid var(--hairline)', borderRadius: 12, padding: '13px 15px', background: 'var(--surface-2)' }}>
            <p style={{ fontSize: 14.5, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.45 }}>{i + 1}. {item}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <SymBtn label="Yes" on={answers[i] === true} color={ROSE} onClick={() => onSet(i, true)} />
              <SymBtn label="No" on={answers[i] === false} color={GREEN} onClick={() => onSet(i, false)} />
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-block" disabled={!done} onClick={onDone}>See my result</button>
    </>
  )
}

function Result({ result, navigate, onRestart }) {
  if (result.screen === 'none') {
    return (
      <Outcome tone={GREEN} ring="✓" title="Thank you for checking in"
        body="You didn’t note a traumatic exposure, so there’s nothing further to screen here. Your wellbeing still matters — explore the other Labs and resources whenever you’d like."
        cta="Back to Labs" onCta={() => navigate('/labs')} />
    )
  }
  if (result.screen === 'positive') {
    return (
      <>
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: ROSE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-editorial)', fontSize: 30, fontWeight: 600, margin: '0 auto 16px' }}>{result.symptomYes}</div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 14 }}>Your check-in suggests this is worth attention</div>
        </div>
        <div style={{ background: 'rgba(158,59,83,0.06)', border: '1px solid rgba(158,59,83,0.22)', borderRadius: 12, padding: '15px 17px', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>
          {POSITIVE_MESSAGE}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', fontStyle: 'italic', marginBottom: 16, textAlign: 'center' }}>
          Draft: the emailed report + clinician-finder is a pending build.
        </div>
        <button className="btn btn-primary btn-block" onClick={() => navigate('/triage')} style={{ marginBottom: 12 }}>Find support →</button>
        <button className="btn btn-ghost btn-block" onClick={onRestart}>Back to Trauma Lab</button>
      </>
    )
  }
  return (
    <Outcome tone={GREEN} ring={String(result.symptomYes)} title="Thanks for checking in"
      body="Your responses don’t point to a likely PTSD screen right now. That can change over time — you can retake this anytime, and the other Labs and resources are here whenever you need them."
      cta="Back to Labs" onCta={() => navigate('/labs')} />
  )
}

// ── small shared pieces ─────────────────────────────────────────────────────
function YesNo({ onYes, onNo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      <button className="btn btn-secondary btn-block" onClick={onYes} style={{ justifyContent: 'flex-start' }}>Yes</button>
      <button className="btn btn-secondary btn-block" onClick={onNo} style={{ justifyContent: 'flex-start' }}>No</button>
    </div>
  )
}

function SymBtn({ label, on, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, border: `1.5px solid ${on ? color : 'var(--hairline)'}`,
      background: on ? color : 'var(--surface-2)', color: on ? '#fff' : 'var(--ink-muted)',
      borderRadius: 9, padding: '8px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
      fontFamily: 'var(--font-body)',
    }}>{label}</button>
  )
}

function Outcome({ tone, ring, title, body, cta, onCta }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 8 }}>
      <div style={{ width: 90, height: 90, borderRadius: '50%', background: tone, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-editorial)', fontSize: 30, fontWeight: 600, margin: '0 auto 18px' }}>{ring}</div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 12 }}>{title}</div>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 22, textAlign: 'left' }}>{body}</p>
      <button className="btn btn-primary btn-block" onClick={onCta}>{cta}</button>
    </div>
  )
}
