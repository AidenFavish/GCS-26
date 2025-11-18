import React from 'react'

export default function CircularGauge({
  value = 0,
  min = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = '#3b82f6',
  label,
  unit,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(min, Math.min(max, value))
  const ratio = (clamped - min) / (max - min)
  const dash = circumference * ratio
  const gap = circumference - dash

  return (
    <div style={cardStyle}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ opacity: 0.6 }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 300ms ease' }}
        />
      </svg>
      <div style={{ position: 'relative', marginTop: -size, height: size, width: size, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
            {typeof value === 'number' ? Math.round(value) : value} {unit}
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '130px',
  height: '150px',
}
