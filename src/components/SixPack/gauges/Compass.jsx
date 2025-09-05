import React from 'react'
import { useData } from '../../../context/DataContext'

export default function Compass() {
  const { heading } = useData()
  const size = 120
  const needleLen = 45
  const rotation = heading

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Compass</div>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid var(--border-strong)',
            background:
              'conic-gradient(from 0deg, #e5e7eb 0 2deg, transparent 2deg 88deg, #e5e7eb 88deg 92deg, transparent 92deg 178deg, #e5e7eb 178deg 182deg, transparent 182deg 268deg, #e5e7eb 268deg 272deg, transparent 272deg 358deg, #e5e7eb 358deg 360deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2,
            height: needleLen,
            background: '#ef4444',
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--border-strong)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div style={{ marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{Math.round(heading)}°</div>
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
}
