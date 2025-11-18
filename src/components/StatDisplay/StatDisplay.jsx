import React from 'react'
import { useData } from '../../context/DataContext'
import { useClimbRate } from './useClimbRate'
import AttitudeBox from './AttitudeBox'
import TapeGauge from './TapeGauge'
import CompassArc from './CompassArc'
import './statDisplay.css'

export default function StatDisplay() {
  const { roll = 0, pitch = 0, speed = 0, heading = 0, altitude = 0 } = useData()
  const climbRate = useClimbRate(altitude)

  return (
    <section className="statDisplay">
      <div className="statDisplay-top">
        <TapeGauge label="Airspeed" value={speed} unit="m/s" step={5} min={0} max={120} />
        <AttitudeBox roll={roll} pitch={pitch} />
        <TapeGauge label="Climb" value={climbRate} unit="m/s" step={1} min={-20} max={20} precision={1} showSign />
      </div>
      <CompassArc heading={heading} />
    </section>
  )
}
