import React from 'react'
import { useData } from '../../../context/DataContext'

// Simple artificial horizon: rotate for roll, translate for pitch
export default function AttitudeIndicator() {
  const { roll, pitch } = useData()
  const size = 120
  const pitchPx = pitch * 1.5 // pixels per degree

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Attitude</div>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid var(--border-strong)',
          background: 'var(--panel)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -size, // bigger to keep edges filled while rotating
            background: 'linear-gradient(#2563eb 50%, #8b5e3c 50%)',
            transform: `translateY(${pitchPx}px) rotate(${roll}deg)`,
            transition: 'transform 300ms ease',
          }}
        />
        {/* reference lines */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: 2,
            background: 'var(--horizon-line)',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            background: 'var(--horizon-line)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div style={{ marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
        R {Math.round(roll)}° / P {Math.round(pitch)}°
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
}
