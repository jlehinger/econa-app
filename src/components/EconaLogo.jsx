// Real Econa brand mark. The app runs on dark navy, so the white wordmark is
// the default; pass variant="color" / "dark" for light backgrounds (e.g. PDFs,
// printable views). `mark` adds the three-faces torch above the wordmark.
const HEIGHTS = { sm: 18, md: 26, lg: 38, xl: 54 }

export default function EconaLogo({ size = 'md', variant = 'white', mark = false, align = 'center' }) {
  const h = HEIGHTS[size] || HEIGHTS.md
  // Brand colors: navy wordmark + navy-handle / gold-flame torch on light
  // surfaces; white reverse for the rare dark surface.
  const wordmark =
    variant === 'white'
      ? '/brand/econa-wordmark-white.png'
      : '/brand/econa-wordmark-navy.png'
  const torch =
    variant === 'white'
      ? '/brand/econa-torch-whitehandle.png'
      : '/brand/econa-torch-navygold.png'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center',
        gap: mark ? h * 0.4 : 0,
        lineHeight: 0,
      }}
    >
      {mark && (
        <img
          src={torch}
          alt=""
          aria-hidden="true"
          style={{ height: h * 1.9, width: 'auto', display: 'block' }}
        />
      )}
      <img
        src={wordmark}
        alt="Econa"
        style={{ height: h, width: 'auto', display: 'block' }}
      />
    </div>
  )
}
