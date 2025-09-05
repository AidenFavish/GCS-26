import React from 'react'
import { useData } from '../../../context/DataContext'
import CircularGauge from '../../common/CircularGauge'

export default function ThrottleGauge() {
  const { throttle } = useData();
  return <CircularGauge value={throttle} min={0} max={100} label="Throttle" unit="%" color="#3b82f6" />
}
