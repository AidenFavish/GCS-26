import React from 'react'
import { useData } from '../../../context/DataContext'
import CircularGauge from '../../common/CircularGauge'

export default function AltitudeGauge() {
  const { altitude } = useData()
  return (
    <CircularGauge value={altitude} min={0} max={200} label="Altitude" unit="m" color={altitude < 20.0 ? "#ff0000ff": "#4df956ff"} />
  )
}
