export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ padding: '16px 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 14, color: 'var(--flame-bright)', letterSpacing: '0.05em', fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: 'var(--hairline)', borderRadius: 2 }}>
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
