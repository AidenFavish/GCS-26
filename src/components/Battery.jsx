import React from 'react'

function levelColor(pct) {
  if (pct >= 60) return '#12e42e' // green
  if (pct >= 35) return '#edbd10ff' // yellow
  if (pct >= 15) return '#f95216ff' // orange
  return '#ef4444' // red
}

export default function Battery({ soc = 100, width = 60, height = 24 }) {
  const pct = Math.max(0, Math.min(100, Math.round(soc)))
  const capWidth = Math.max(2, Math.round(width * 0.06))
  const bodyWidth = width - capWidth - 2
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        aria-label={`battery ${pct}%`}
        style={{
          position: 'relative',
          width,
          height,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: bodyWidth,
            height: height - 6,
            border: '2px solid var(--border-strong)',
            borderRight: 0,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'var(--panel-muted)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: levelColor(pct),
              transition: 'width 300ms ease',
            }}
          />
        </div>
        <div
          style={{
            width: capWidth,
            height: Math.round(height * 0.5),
            border: '2px solid var(--border-strong)',
            borderLeft: 0,
            borderRadius: '0 3px 3px 0',
            alignSelf: 'center',
            background: 'var(--border-strong)',
          }}
        />
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, fontWeight: 700 }}>{pct}%</span>
    </div>
  )
}
