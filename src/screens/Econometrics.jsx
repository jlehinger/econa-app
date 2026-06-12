import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

// Question text is verbatim from Dr. Freeman's "FounderScreen assessment bundle"
// (FS Learning lab additional evaluation instruments, updated April 28, 2026), pp. 4–9.
// Items group into his three time frames: lifetime (1–4), current time (5–13), last year (14–17).

const COUNT_OPTIONS = ['0', '1', '2', '3', '4 or more']
const FAILURE_COUNT_OPTIONS = ['1', '2', '3', '4', '5 or more']

const IP_OPTIONS = ['None', 'Copyright', 'Trademark', 'Patent (granted)', 'Patent (provisional)']

const FAILURE_OPTIONS = [
  'Insolvency of a magnitude that your firm could no longer attract new debt or equity funding.',
  'Chose to stop being involved with your business because it did not meet your minimum threshold for economic viability.',
  'Involuntary exit from self-employment into unemployment or holding a job.',
  'Bankruptcy',
  'No, I have not experienced any of these business outcomes.',
]
const NO_FAILURE = FAILURE_OPTIONS[4]

const STAGE_OPTIONS = [
  'Ideation; exploring the possibility of building',
  'Pre-revenue; building but not yet earning revenue',
  'Early revenue; first customers, proving the model',
  'Growth; scaling an established business',
]

const ROLE_OPTIONS = [
  'Chief Executive Officer',
  'C-level operating role (other than CEO)',
  'Board member with operating responsibilities',
  'Board member with no operating responsibilities',
  'Other',
]

// Verbatim 23-category industry list from the bundle (item 11, "Programmer:" note)
const SECTOR_OPTIONS = [
  'Agriculture, Forestry, Fishing and Hunting',
  'Mining',
  'Utilities',
  'Construction',
  'Manufacturing',
  'Wholesale Trade',
  'Retail Trade',
  'Transportation and Warehousing',
  'Information, Information Technology, Computing and Artificial Intelligence',
  'Finance and Insurance',
  'Real Estate and Rental and Leasing',
  'Professional, Scientific, and Technical Services',
  'Management of Companies and Enterprises',
  'Administrative and Support and Waste Management and Remediation Services',
  'Educational Services',
  'Health Care and Social Assistance',
  'Arts, Entertainment, and Recreation',
  'Accommodation and Food Services',
  'Other Services (except Public Administration)',
  'Public Administration',
  'Leisure and hospitality',
  'Internet Publishing and Broadcasting',
  'Data Processing, Hosting and Related Services',
]

const MARKET_OPTIONS = ['Local', 'Regional', 'National', 'International']

const INITIAL_STATE = {
  serial_entrepreneurship: '',
  lifetime_investment: 0,
  intellectual_property: [],
  business_failures: [],
  business_failure_count: '',
  current_eship: '',
  business_stage: '',
  roles: [],
  role_other: '',
  workforce_size: 1,
  annual_revenue: 0,
  stability: '',
  sector: '',
  markets_served: [],
  firm_start_year: '',
  profitability_last_year: 0,
  growth_revenue: 0,
  growth_customers: 0,
  growth_employees: 0,
  innovation: '',
  invested_last_year: '',
  invest_pct_debt: 0,
  invest_pct_equity: 0,
  invest_pct_self: 0,
  invest_pct_friends_family: 0,
}

const cardStyle = {
  background: 'var(--surface-2)',
  border: '1px solid var(--hairline)',
  borderRadius: 12,
  padding: '16px 18px',
  boxShadow: '0 2px 12px rgba(15,43,76,0.06)',
}

const labelStyle = {
  display: 'block',
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'var(--ink-soft)',
  marginBottom: 10,
  fontFamily: 'var(--font-body)',
  lineHeight: 1.5,
}

const inputStyle = {
  width: '100%',
  background: 'var(--surface-2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 17,
  color: 'var(--ink)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(15,43,76,0.5)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
  cursor: 'pointer',
}

const focusOn = e => { e.currentTarget.style.borderColor = 'var(--flame)' }
const focusOff = e => { e.currentTarget.style.borderColor = 'var(--hairline)' }

const fmtMoney = v => {
  if (v >= 100_000_000) return '$100MM+'
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}MM`
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`
  return `$${v}`
}

// Money sliders step coarsely on a quasi-log curve so $0–$100MM+ is usable on one track
const MONEY_STEPS = (() => {
  const steps = [0]
  for (let v = 10_000; v < 100_000; v += 10_000) steps.push(v)
  for (let v = 100_000; v < 1_000_000; v += 100_000) steps.push(v)
  for (let v = 1_000_000; v < 10_000_000; v += 500_000) steps.push(v)
  for (let v = 10_000_000; v <= 100_000_000; v += 5_000_000) steps.push(v)
  return steps
})()

function Card({ label, children }) {
  return (
    <div style={cardStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      {children}
    </div>
  )
}

function Select({ value, onChange, options, placeholder = 'Select…', ariaLabel }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={selectStyle}
      aria-label={ariaLabel}
      onFocus={focusOn}
      onBlur={focusOff}
    >
      <option value="" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt} style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>{opt}</option>
      ))}
    </select>
  )
}

function YesNo({ value, onChange, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{ display: 'flex', gap: 10 }}>
      {['Yes', 'No'].map(opt => {
        const isSelected = value === opt
        return (
          <button
            key={opt}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt)}
            style={{
              flex: 1,
              background: 'var(--surface-2)',
              border: isSelected ? '2px solid var(--flame)' : '1px solid var(--hairline)',
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function CheckGroup({ values, onToggle, options, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const isSelected = values.includes(opt)
        return (
          <button
            key={opt}
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onToggle(opt)}
            style={{
              background: 'var(--surface-2)',
              border: isSelected ? '2px solid var(--flame)' : '1px solid var(--hairline)',
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
              textAlign: 'left',
              lineHeight: 1.45,
              transition: 'all 0.15s',
            }}
          >
            <span aria-hidden="true">{isSelected ? '☑ ' : '☐ '}</span>{opt}
          </button>
        )
      })}
    </div>
  )
}

function StepSlider({ steps, value, onChange, format, ariaLabel }) {
  const index = Math.max(0, steps.indexOf(value))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        value={index}
        onChange={e => onChange(steps[Number(e.target.value)])}
        aria-label={ariaLabel}
        aria-valuetext={format(value)}
        style={{ flex: 1, accentColor: 'var(--flame)', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--flame-bright)', fontFamily: 'var(--font-display)', minWidth: 72, textAlign: 'right' }}>
        {format(value)}
      </span>
    </div>
  )
}

function PercentSlider({ value, onChange, min = -200, max = 200, suffix = '%', ariaLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-valuetext={`${value > 0 ? '+' : ''}${value}${suffix}`}
        style={{ flex: 1, accentColor: 'var(--flame)', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--flame-bright)', fontFamily: 'var(--font-display)', minWidth: 64, textAlign: 'right' }}>
        {value > 0 ? '+' : ''}{value}{suffix}
      </span>
    </div>
  )
}

function SectionBanner({ children }) {
  return (
    <div style={{
      background: 'rgba(93,173,226,0.08)',
      border: '1px solid rgba(93,173,226,0.2)',
      borderLeft: '3px solid var(--teal, #5DADE2)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--ink)',
      fontFamily: 'var(--font-body)',
      lineHeight: 1.5,
      marginTop: 8,
    }}>
      {children}
    </div>
  )
}

export default function Econometrics() {
  const navigate = useNavigate()
  const { setEconometrics } = useAssessmentStore()
  const [d, setD] = useState(INITIAL_STATE)

  const set = (key, value) => setD(prev => ({ ...prev, [key]: value }))
  const toggle = (key, opt) => setD(prev => ({
    ...prev,
    [key]: prev[key].includes(opt) ? prev[key].filter(v => v !== opt) : [...prev[key], opt],
  }))
  // "No failures" is mutually exclusive with the four failure outcomes
  const toggleFailure = opt => setD(prev => {
    const has = prev.business_failures.includes(opt)
    let next
    if (has) next = prev.business_failures.filter(v => v !== opt)
    else if (opt === NO_FAILURE) next = [NO_FAILURE]
    else next = [...prev.business_failures.filter(v => v !== NO_FAILURE), opt]
    return { ...prev, business_failures: next }
  })

  const hadFailures = d.business_failures.some(v => v !== NO_FAILURE)

  const handleContinue = () => {
    setEconometrics(d)
    navigate('/ewc/perceived-need')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '20px 28px 56px',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/demographics')}
        >
          ← About You
        </button>
        <EconaLogo size="md" mark variant="color" />
      </div>

      {/* Screen heading */}
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
        FounderScreen
      </div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, color: 'var(--ink)', marginBottom: 8, fontWeight: 400, lineHeight: 1.15 }}>
        Your Business
      </div>
      <div style={{ fontSize: 16, color: 'var(--ink-muted)', marginBottom: 40 }}>
        17 questions · ~4 min
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>

        <SectionBanner>
          Please answer these questions while thinking about the course of your lifetime.
        </SectionBanner>

        {/* 1. Serial entrepreneurship */}
        <Card label="Over the course of your lifetime… How many businesses have you founded or co-founded, regardless of if they are still in operation?">
          <Select value={d.serial_entrepreneurship} onChange={v => set('serial_entrepreneurship', v)} options={COUNT_OPTIONS} ariaLabel="How many businesses have you founded or co-founded?" />
        </Card>

        {/* 2. Lifetime investment received */}
        <Card label="Over the course of your lifetime… How much investor financing have you raised?">
          <StepSlider steps={MONEY_STEPS} value={d.lifetime_investment} onChange={v => set('lifetime_investment', v)} format={fmtMoney} ariaLabel="How much investor financing have you raised over your lifetime?" />
        </Card>

        {/* 3. Intellectual property */}
        <Card label="Over the course of your lifetime… Has your work or the work of your company led to awards of any patents, provisional patents, copyrights, or trademarks? (Select all that apply)">
          <CheckGroup values={d.intellectual_property} onToggle={opt => toggle('intellectual_property', opt)} options={IP_OPTIONS} ariaLabel="Intellectual property awards, select all that apply" />
        </Card>

        {/* 4. Business failure */}
        <Card label="Over the course of your lifetime, have you experienced any of the following business outcomes? (Check all that apply)">
          <CheckGroup values={d.business_failures} onToggle={toggleFailure} options={FAILURE_OPTIONS} ariaLabel="Business outcomes experienced, check all that apply" />
          {hadFailures && (
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>If yes, how many times altogether have you experienced any of these outcomes?</label>
              <Select value={d.business_failure_count} onChange={v => set('business_failure_count', v)} options={FAILURE_COUNT_OPTIONS} ariaLabel="How many times have you experienced these outcomes?" />
            </div>
          )}
        </Card>

        <SectionBanner>
          Please answer these questions while thinking about the current time.
        </SectionBanner>

        {/* 5. Current entrepreneurship experience */}
        <Card label="How many businesses do you currently operate?">
          <Select value={d.current_eship} onChange={v => set('current_eship', v)} options={COUNT_OPTIONS} ariaLabel="How many businesses do you currently operate?" />
        </Card>

        {/* 6. Business stage */}
        <Card label="What stage best describes your business?">
          <Select value={d.business_stage} onChange={v => set('business_stage', v)} options={STAGE_OPTIONS} ariaLabel="What stage best describes your business?" />
        </Card>

        {/* 7. Role */}
        <Card label="What is your role in your company? If you participate in leading more than one company, answer with respect to the company at which you are most actively involved. Select all that apply.">
          <CheckGroup values={d.roles} onToggle={opt => toggle('roles', opt)} options={ROLE_OPTIONS} ariaLabel="Your role in your company, select all that apply" />
          {d.roles.includes('Other') && (
            <input
              type="text"
              value={d.role_other}
              onChange={e => set('role_other', e.target.value)}
              placeholder="Describe your role"
              aria-label="Other role, fill in"
              style={{ ...inputStyle, marginTop: 10 }}
              onFocus={focusOn}
              onBlur={focusOff}
            />
          )}
        </Card>

        {/* 8. Workforce size */}
        <Card label="How many full-time equivalent employees and contractors work for your company?">
          <StepSlider
            steps={[1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 2000, 3500, 5000]}
            value={d.workforce_size}
            onChange={v => set('workforce_size', v)}
            format={v => (v >= 5000 ? '5000+' : String(v))}
            ariaLabel="How many full-time equivalent employees and contractors work for your company?"
          />
        </Card>

        {/* 9. Annual revenue */}
        <Card label="What is the top-line annual revenue of your company?">
          <StepSlider steps={MONEY_STEPS} value={d.annual_revenue} onChange={v => set('annual_revenue', v)} format={fmtMoney} ariaLabel="What is the top-line annual revenue of your company?" />
        </Card>

        {/* 10. Stability */}
        <Card label="Does one customer account for 25% or more of your company's sales?">
          <YesNo value={d.stability} onChange={v => set('stability', v)} ariaLabel="Does one customer account for 25 percent or more of your company's sales?" />
        </Card>

        {/* 11. Sector — verbatim 23-category list */}
        <Card label="Please select the industry that best represents your business.">
          <Select value={d.sector} onChange={v => set('sector', v)} options={SECTOR_OPTIONS} placeholder="Select an industry…" ariaLabel="Select the industry that best represents your business" />
        </Card>

        {/* 12. Markets served */}
        <Card label="Where are your customers? What geographic markets does your company serve? Select all that apply.">
          <CheckGroup values={d.markets_served} onToggle={opt => toggle('markets_served', opt)} options={MARKET_OPTIONS} ariaLabel="Geographic markets served, select all that apply" />
        </Card>

        {/* 13. Firm survival */}
        <Card label="In what year did you start your current company?">
          <input
            type="number"
            min={1950}
            max={2026}
            value={d.firm_start_year}
            onChange={e => set('firm_start_year', e.target.value)}
            placeholder="Four-digit year"
            aria-label="In what year did you start your current company?"
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        </Card>

        <SectionBanner>
          Please answer these questions while thinking about the last year.
        </SectionBanner>

        {/* 14. Profitability last year */}
        <Card label="During the last year… What was your company's profit or loss margin in the last year?">
          <PercentSlider value={d.profitability_last_year} onChange={v => set('profitability_last_year', v)} ariaLabel="Profit or loss margin in the last year, from minus 200 percent or more loss to plus 200 percent or more profit" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-muted)', marginTop: 6 }}>
            <span>200%+ loss</span><span>0</span><span>200%+ profit</span>
          </div>
        </Card>

        {/* 15. Growth or contraction last year — three sliders per spec */}
        <Card label="During the last year… Did your company grow or contract?">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['growth_revenue', 'Did your company grow or contract in revenue in the last year?'],
              ['growth_customers', 'Did your company grow or contract in customers in the last year?'],
              ['growth_employees', 'Did your company grow or contract in employees in the last year?'],
            ].map(([key, label]) => (
              <div key={key}>
                <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 8, lineHeight: 1.5 }}>{label}</div>
                <PercentSlider value={d[key]} onChange={v => set(key, v)} ariaLabel={label} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-muted)', marginTop: 10 }}>
            <span>−200% or more (contraction)</span><span>+200% or more (growth)</span>
          </div>
        </Card>

        {/* 16. Innovation last year */}
        <Card label="In the last year, did your firm develop new products, services, or processes?">
          <YesNo value={d.innovation} onChange={v => set('innovation', v)} ariaLabel="In the last year, did your firm develop new products, services, or processes?" />
        </Card>

        {/* 17. Source of investment last year */}
        <Card label="Was money invested in your company in the last year?">
          <YesNo value={d.invested_last_year} onChange={v => set('invested_last_year', v)} ariaLabel="Was money invested in your company in the last year?" />
          {d.invested_last_year === 'Yes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {[
                ['invest_pct_debt', 'What percentage of those funds came from debt?'],
                ['invest_pct_equity', 'What percentage of those funds came from external shareholder equity?'],
                ['invest_pct_self', 'What percentage of the investment was self-funded?'],
                ['invest_pct_friends_family', 'What percentage of those funds came from friends and family?'],
              ].map(([key, label]) => (
                <div key={key}>
                  <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 8, lineHeight: 1.5 }}>{label}</div>
                  <PercentSlider value={d[key]} onChange={v => set(key, v)} min={0} max={100} ariaLabel={label} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Continue button */}
      <button
        className="btn btn-primary btn-block"
        onClick={handleContinue}
      >
        Continue →
      </button>
    </div>
  )
}
