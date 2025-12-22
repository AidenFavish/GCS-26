import React from 'react'
import { useData } from '../../context/DataContext'
import AttitudeBox from './AttitudeBox'
import TapeGauge from './TapeGauge'
import CompassArc from './CompassArc'
import './statDisplay.css'

const UNIT_COOKIE = 'gcs-unit-system'
const METERS_TO_FEET = 3.28084
const MPS_TO_MPH = 2.236936

function readUnitCookie() {
  if (typeof document === 'undefined') return 'metric'
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${UNIT_COOKIE}=`))
  if (!cookie) return 'metric'
  const rawValue = cookie.split('=').slice(1).join('=')
  const value = decodeURIComponent(rawValue)
  return value === 'imperial' ? 'imperial' : 'metric'
}

export default function StatDisplay() {
  const { roll = 0, pitch = 0, speed = 0, heading = 0, altitude = 0, groundspeed = 0, climbspeed = 0 } = useData()
  const unitSystem = React.useMemo(() => readUnitCookie(), [])
  const isImperial = unitSystem === 'imperial'
  const altitudeUnit = isImperial ? 'ft' : 'm'
  const speedUnit = isImperial ? 'mph' : 'm/s'
  const climbUnit = isImperial ? 'ft/s' : 'm/s'
  const altitudeValue = isImperial ? altitude * METERS_TO_FEET : altitude
  const altitudeStep = isImperial ? Math.round(5 * METERS_TO_FEET) : 5
  const altitudeMax = isImperial ? Math.round(250 * METERS_TO_FEET) : 250
  const climbScale = isImperial ? Math.round(METERS_TO_FEET) : 1
  const climbValue = climbspeed * climbScale
  const climbStep = isImperial ? Math.round(1 * METERS_TO_FEET) : 1
  const climbMin = isImperial ? Math.round(-60 * METERS_TO_FEET) : -60
  const climbMax = isImperial ? Math.round(60 * METERS_TO_FEET) : 60
  const airspeedValue = isImperial ? speed * MPS_TO_MPH : speed
  const groundSpeedValue = isImperial ? groundspeed * MPS_TO_MPH : groundspeed

  return (
    <section className="statDisplay">
      <div className="statDisplay-top">
        <TapeGauge label="Altitude" value={altitudeValue} unit={altitudeUnit} step={altitudeStep} min={0} max={altitudeMax} />
        <AttitudeBox roll={roll} pitch={pitch} />
        <TapeGauge
          label="Climb Rate"
          value={climbValue}
          unit={climbUnit}
          step={climbStep}
          min={climbMin}
          max={climbMax}
          precision={1}
          showSign
        />
      </div>
      <CompassArc heading={heading} airspeed={airspeedValue} groundSpeed={groundSpeedValue} speedUnit={speedUnit} />
    </section>
  )
}
