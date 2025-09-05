import React, { useEffect, useState } from 'react'
import { useData } from '../../../context/DataContext'

export default function HeartPulse() {
  const { heartbeat } = useData()
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    setPulsing(true)
    const id = setTimeout(() => setPulsing(false), 300)
    return () => clearTimeout(id)
  }, [heartbeat])

  const logicalSize = 50
  const displaySize = 200
  const scale = displaySize / logicalSize

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Heartbeat</div>
      <div style={{color: 'rgba(0,0,0,0)'}}>Spacer</div>
      <div style={{ position: 'relative', width: logicalSize, height: logicalSize, overflow: 'visible' }}>
        <div
          aria-label="heartbeat"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            fontSize: logicalSize, // heart fills the logical box
            lineHeight: 1,
            transform: `scale(${scale * (pulsing ? 1.12 : 1)})`,
            transformOrigin: 'center',
            transition: 'transform 150ms ease',
            filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.2))',
          }}
        >
          ❤
        </div>
        <div
          style={{
            width: logicalSize+5,
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 700,
            fontSize: 16, // crisp text, not transformed
            textShadow: '0 1px 1px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {heartbeat + ' hz'}
        </div>
      </div>
      <div style={{color: 'rgba(0,0,0,0)'}}>Spacer</div>
      <div style={{color: 'rgba(0,0,0,0)'}}>Spacer</div>
    </div>
  )
}

const cardStyle = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}
