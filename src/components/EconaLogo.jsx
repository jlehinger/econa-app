export default function EconaLogo({ size = 'md', color = '#E8981D' }) {
  const sizes = { sm: 14, md: 20, lg: 28 }
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: sizes[size],
      letterSpacing: '0.18em',
      color,
      fontWeight: 600,
      textTransform: 'uppercase',
    }}>
      ECONA
    </div>
  )
}
