import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import { useAssessmentStore } from '../store/assessmentStore.js'

// Question text is verbatim from Dr. Freeman's "FounderScreen assessment bundle"
// (FS Learning lab additional evaluation instruments, updated April 28, 2026), pp. 3–4.

const GENDER_OPTIONS = ['M', 'F', 'Non-binary/gender non-conforming', 'Prefer not to say']

const IMMIGRANT_OPTIONS = [
  'I am an immigrant',
  'One or both of my parents is/was an immigrant',
  'One or more of my grandparents is/was an immigrant',
  'All of my grandparents were born in the country where I reside',
]

const RACE_OPTIONS = [
  'Black/African',
  'White/European',
  'Asian',
  'South Asian',
  'Native Hawaiian or Other Pacific Islander',
  'Middle Eastern or North African',
  'Multi-racial/mixed',
  'Other',
  'Prefer not to say',
]

const PARTNERSHIP_OPTIONS = [
  'Married or in a committed long-term relationship',
  'Widowed',
  'Separated or divorced',
  'Single, never married',
]

// ISO 3166-1 alpha-2 codes rendered to country names via Intl.DisplayNames.
const COUNTRY_CODES = ['AF','AL','DZ','AD','AO','AG','AR','AM','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','BN','BG','BF','BI','CV','KH','CM','CA','CF','TD','CL','CN','CO','KM','CG','CD','CR','CI','HR','CU','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FJ','FI','FR','GA','GM','GE','DE','GH','GR','GD','GT','GN','GW','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MG','MW','MY','MV','ML','MT','MH','MR','MU','MX','FM','MD','MC','MN','ME','MA','MZ','MM','NA','NR','NP','NL','NZ','NI','NE','NG','MK','NO','OM','PK','PW','PA','PG','PY','PE','PH','PL','PT','QA','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','SS','ES','LK','SD','SR','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TO','TT','TN','TR','TM','TV','UG','UA','AE','GB','US','UY','UZ','VU','VE','VN','YE','ZM','ZW']
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const COUNTRIES = COUNTRY_CODES
  .map(code => regionNames.of(code))
  .sort((a, b) => a.localeCompare(b))

const INITIAL_RESPONSES = {
  age: 40,
  gender: '',
  education: '',
  residency: '',
  immigrant: '',
  language_native: '',
  language_fluent: '',
  race: '',
  ethnicity: '',
  partnership: '',
  children: '',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: '16px 18px',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 10,
  fontFamily: 'var(--font-body)',
  lineHeight: 1.5,
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 14,
  color: '#fff',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
  cursor: 'pointer',
}

const focusOn = e => { e.currentTarget.style.borderColor = 'var(--flame)' }
const focusOff = e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }

function Card({ label, children }) {
  return (
    <div style={cardStyle}>
      <label style={labelStyle}>{label}</label>
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
      <option value="" style={{ background: '#111' }}>{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt} style={{ background: '#111' }}>{opt}</option>
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
              background: isSelected ? 'rgba(212,160,60,0.1)' : 'rgba(255,255,255,0.04)',
              border: isSelected ? '2px solid var(--flame)' : '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? '#fff' : 'rgba(255,255,255,0.65)',
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

export default function Demographics() {
  const navigate = useNavigate()
  const { setDemographics } = useAssessmentStore()
  const [r, setR] = useState(INITIAL_RESPONSES)

  const set = (key, value) => setR(prev => ({ ...prev, [key]: value }))

  const handleContinue = () => {
    setDemographics(r)
    navigate('/econometrics')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
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
          onClick={() => navigate('/verify')}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.55)',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            padding: '5px 12px',
            borderRadius: 100,
            letterSpacing: '0.05em',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          ← Verify
        </button>
        <EconaLogo size="sm" />
      </div>

      {/* Screen heading */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
        FounderScreen
      </div>
      <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 36, color: '#fff', marginBottom: 8, fontWeight: 300, lineHeight: 1.15 }}>
        About You
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
        10 questions · ~2 min
      </div>

      {/* Questions — verbatim from Dr. Freeman's April 28 assessment bundle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>

        {/* 1. Age — slider per spec */}
        <Card label="How old are you?">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input
              type="range"
              min={18}
              max={100}
              value={r.age}
              onChange={e => set('age', Number(e.target.value))}
              aria-label="How old are you?"
              aria-valuemin={18}
              aria-valuemax={100}
              aria-valuenow={r.age}
              style={{ flex: 1, accentColor: 'var(--flame)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--flame)', fontFamily: 'var(--font-display)', minWidth: 36, textAlign: 'right' }}>
              {r.age}
            </span>
          </div>
        </Card>

        {/* 2. Gender */}
        <Card label="What is your gender?">
          <Select value={r.gender} onChange={v => set('gender', v)} options={GENDER_OPTIONS} ariaLabel="What is your gender?" />
        </Card>

        {/* 3. Education */}
        <Card label="How many years of schooling have you completed?">
          <input
            type="number"
            min={0}
            max={30}
            value={r.education}
            onChange={e => set('education', e.target.value)}
            placeholder="Enter number"
            aria-label="How many years of schooling have you completed?"
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
          />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 8, lineHeight: 1.5 }}>
            For example: 12 = high school · 16 = college · 18 = Master's degree/trade school/apprenticeship · 21 = Ph.D., M.D., J.D., other doctoral degree
          </div>
        </Card>

        {/* 4. Residency */}
        <Card label="In what country do you reside?">
          <Select value={r.residency} onChange={v => set('residency', v)} options={COUNTRIES} placeholder="Select a country…" ariaLabel="In what country do you reside?" />
        </Card>

        {/* 5. Immigrant or child of immigrant status */}
        <Card label="Which describes you?">
          <Select value={r.immigrant} onChange={v => set('immigrant', v)} options={IMMIGRANT_OPTIONS} ariaLabel="Immigrant or child of immigrant status: which describes you?" />
        </Card>

        {/* 6. Language — conditional fluency follow-up per spec */}
        <Card label="Is English your native language?">
          <YesNo value={r.language_native} onChange={v => set('language_native', v === r.language_native ? '' : v)} ariaLabel="Is English your native language?" />
          {r.language_native === 'No' && (
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>Are you fluent in English?</label>
              <YesNo value={r.language_fluent} onChange={v => set('language_fluent', v)} ariaLabel="Are you fluent in English?" />
            </div>
          )}
        </Card>

        {/* 7. Racial heritage */}
        <Card label="What is your racial heritage?">
          <Select value={r.race} onChange={v => set('race', v)} options={RACE_OPTIONS} ariaLabel="What is your racial heritage?" />
        </Card>

        {/* 8. Ethnicity */}
        <Card label="Are you Hispanic or Latino/a/x?">
          <YesNo value={r.ethnicity} onChange={v => set('ethnicity', v)} ariaLabel="Are you Hispanic or Latino/a/x?" />
        </Card>

        {/* 9. Partnership status */}
        <Card label="What is your relationship status?">
          <Select value={r.partnership} onChange={v => set('partnership', v)} options={PARTNERSHIP_OPTIONS} ariaLabel="What is your relationship status?" />
        </Card>

        {/* 10. Children */}
        <Card label="How many children do you have?">
          <input
            type="number"
            min={0}
            max={30}
            value={r.children}
            onChange={e => set('children', e.target.value)}
            placeholder="Enter number"
            aria-label="How many children do you have?"
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        </Card>
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        style={{
          background: 'linear-gradient(135deg, var(--ember) 0%, var(--flame) 60%, var(--spark) 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          padding: '20px 32px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-body)',
          width: '100%',
          boxShadow: '0 4px 24px rgba(212,160,60,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(212,160,60,0.45)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,160,60,0.35)' }}
      >
        Continue →
      </button>
    </div>
  )
}
