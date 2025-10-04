import React, { useEffect, useState } from 'react'
import { useData } from '../../../context/DataContext'
import { Heart } from 'lucide-react'

export default function HeartPulse() {
  const { heartbeat, hb_hz } = useData()
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
      <div style={{color: 'rgba(0,0,0,0)', minHeight: 35}}></div>
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
            transform: `scale(${scale * (pulsing ? 1.0 : 1)})`,
            //transform: `scale(${scale * (pulsing ? 1.12 : 1)})`,
            transformOrigin: 'center',
            transition: 'transform 150ms ease',
            filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.2))',
          }}
        >
          < Heart size={30} style={{transition: 'transform 250ms ease', transform: `scale(${(pulsing ? 1.2 : 1)})`}} fill='#ef4444'/>
        </div>
        <div
          style={{
            width: logicalSize+10,
            position: 'absolute',
            top: '45%',
            left: '52%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 700,
            fontSize: 16, // crisp text, not transformed
            textShadow: '0 1px 1px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {hb_hz}
        </div>
      </div>
      <div style={{color: 'rgba(0,0,0,0)', minHeight: 60}}></div>
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
