import React from 'react'

// Simple hex color util helpers
function clamp(v, min = 0, max = 255) { return Math.max(min, Math.min(max, v)) }
function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return { r, g, b }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return { r, g, b }
  }
  return { r: 0, g: 0, b: 0 }
}
function rgbToHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, '0')
  return `#${h(clamp(r))}${h(clamp(g))}${h(clamp(b))}`
}
function lighten(hex, amt = 20) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex({ r: r + amt, g: g + amt, b: b + amt })
}
function darken(hex, amt = 20) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex({ r: r - amt, g: g - amt, b: b - amt })
}
function getContrastText(hex) {
  const { r, g, b } = hexToRgb(hex)
  // Perceived luminance
  const luma = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255)
  return luma > 0.6 ? '#111827' : '#ffffff'
}

export default function FancyButton({ label = 'Button', color = '#2563eb', minWidth=140, onClick, disabled = false, style }) {
  const [hovered, setHovered] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)

  const bg = color
  const bgHover = lighten(color, 14)
  const bgActive = darken(color, 14)
  const textColor = getContrastText(color)

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '5px 8px',
    minWidth: minWidth,
    borderRadius: 8,
    border: `1px solid ${darken(color, 40)}`,
    color: textColor,
    background: hovered ? (pressed ? bgActive : bgHover) : bg,
    boxShadow: pressed
      ? `inset 0 2px 6px rgba(0,0,0,0.25)`
      : `0 2px 6px rgba(0,0,0,0.12)`,
    transform: pressed ? 'translateY(0px)' : hovered ? 'translateY(-1px)' : 'translateY(0px)',
    transition: 'background 120ms ease, transform 120ms ease, box-shadow 120ms ease, filter 120ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    ...style,
  }

  function handleKeyDown(e) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (typeof onClick === 'function') onClick(e)
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={baseStyle}
    >
      {/* Optional shine overlay on hover */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          pointerEvents: 'none',
          background: hovered
            ? 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0))'
            : 'transparent',
          transition: 'background 120ms ease',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, fontWeight: 600 }}>{label}</span>
    </button>
  )
}

