import { useEffect, useRef, useState } from 'react'

export function useClimbRate(altitude = 0) {
  const [rate, setRate] = useState(0)
  const prev = useRef({ altitude, timestamp: Date.now() })

  useEffect(() => {
    const now = Date.now()
    const dt = (now - prev.current.timestamp) / 1000
    if (dt > 0) {
      const deltaAlt = altitude - prev.current.altitude
      const nextRate = deltaAlt / dt
      setRate(nextRate)
    }
    prev.current = { altitude, timestamp: now }
  }, [altitude])

  return rate
}
