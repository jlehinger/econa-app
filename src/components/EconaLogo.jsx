// Real Econa brand mark. The app runs on dark navy, so the white wordmark is
// the default; pass variant="color" / "dark" for light backgrounds (e.g. PDFs,
// printable views). `mark` adds the three-faces torch above the wordmark.
const HEIGHTS = { sm: 18, md: 26, lg: 38, xl: 54 }

export default function EconaLogo({ size = 'md', variant = 'white', mark = false, align = 'center' }) {
  const h = HEIGHTS[size] || HEIGHTS.md
  const wordmark =
    variant === 'color' || variant === 'dark'
      ? '/brand/econa-wordmark-black.png'
      : '/brand/econa-wordmark-white.png'
  const torch =
    variant === 'color'
      ? '/brand/econa-torch-blackhandle.png'
      : variant === 'dark'
      ? '/brand/econa-torch-blackhandle.png'
      : '/brand/econa-torch-whitehandle.png'

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
