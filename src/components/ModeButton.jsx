import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { postMode } from '../utils/api'

// Usage: <ModeButton mode="GUIDED" />
export default function ModeButton({ mode = 'GUIDED' }) {
  const data = useData()
  const current = (data.mode || '').toUpperCase()
  const target = String(mode || '').toUpperCase()
  const active = current === target
  const [hover, setHover] = useState(false)

  async function handleClick() {
    if (active) return
    // Optimistically update UI
    if (typeof data.setMode === 'function') data.setMode(target)
    // Fire-and-forget POST
    postMode(target)
  }

  const bg = active ? 'var(--good-green)' : 'var(--mode-button)'
  const baseShadow = hover && !active ? 'inset 0 -3px 0 rgba(0,0,0,0.25)' : 'inset 0 -1px 0 rgba(0,0,0,0.2)'

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={active}
      style={{
        background: bg,
        color: 'var(--text)',
        border: 0,
        padding: '8px 14px',
        borderRadius: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: active ? 'default' : 'pointer',
        boxShadow: `${baseShadow}`,
        transition: 'box-shadow 150ms ease, transform 120ms ease',
        transform: hover && !active ? 'translateY(-1px)' : 'none',
        userSelect: 'none',
        fontFamily: 'Helvetica'
      }}
      title={active ? `Mode is already ${target}` : `Switch to ${target}`}
    >
      {target}
    </button>
  )
}

