export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ padding: '16px 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 11, color: 'var(--flame)', letterSpacing: '0.05em' }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}
