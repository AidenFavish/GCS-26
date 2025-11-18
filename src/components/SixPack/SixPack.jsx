import React from 'react'
import HeartPulse from './gauges/HeartPulse'
import ThrottleGauge from './gauges/ThrottleGauge'

export default function SixPack() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          width: '100%',
          maxWidth: 320,
        }}
      >
        <HeartPulse />
        <ThrottleGauge />
      </div>
    </div>
  )
}
