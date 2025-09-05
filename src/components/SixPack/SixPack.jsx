import React from 'react'
import Compass from './gauges/Compass'
import HeartPulse from './gauges/HeartPulse'
import AltitudeGauge from './gauges/AltitudeGauge'
import ThrottleGauge from './gauges/ThrottleGauge'
import SpeedGauge from './gauges/SpeedGauge'
import AttitudeIndicator from './gauges/AttitudeIndicator'

export default function SixPack() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}
    >
      <Compass />
      <HeartPulse />
      <AltitudeGauge />
      <ThrottleGauge />
      <SpeedGauge />
      <AttitudeIndicator />
    </div>
  )
}
