import React from 'react'
import { useData } from '../../../context/DataContext'
import CircularGauge from '../../common/CircularGauge'

export default function SpeedGauge() {
  const { speed } = useData()
  return <CircularGauge value={speed} min={0} max={50} label="Speed" unit="m/s" color="#f59e0b" />
}
