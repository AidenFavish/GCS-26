import React from 'react'
import { useData } from '../../context/DataContext'
import AttitudeBox from './AttitudeBox'
import TapeGauge from './TapeGauge'
import CompassArc from './CompassArc'
import './statDisplay.css'

export default function StatDisplay() {
  const { roll = 0, pitch = 0, speed = 0, heading = 0, altitude = 0, groundspeed = 0, climbspeed = 0 } = useData()

  return (
    <section className="statDisplay">
      <div className="statDisplay-top">
        <TapeGauge label="Altitude" value={altitude} unit="m" step={5} min={0} max={250} />
        <AttitudeBox roll={roll} pitch={pitch} />
        <TapeGauge label="Climb Rate" value={climbspeed} unit="m/s" step={1} min={-60} max={60} precision={1} showSign />
      </div>
      <CompassArc heading={heading} airspeed={speed} groundSpeed={groundspeed} />
    </section>
  )
}
