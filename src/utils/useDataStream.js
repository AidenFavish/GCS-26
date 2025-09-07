// Simulated 1 Hz data stream for the GCS UI
// Exports a React hook that provides the latest telemetry-like values

import { useEffect, useRef, useState } from 'react'

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

function wrap360(v) {
  let n = v % 360
  if (n < 0) n += 360
  return n
}

function smoothRand(step = 1) {
  return (Math.random() * 2 - 1) * step
}

export function useDataStream() {
  const [data, setData] = useState(() => ({
    timestamp: Date.now(),
    batterySoc: 92,
    armed: false,
    estopOn: true,
    mode: 'GUIDED',
    statusMessages: [],
    currentLat: 37.7749,
    currentLon: -122.4194,
    positionTrack: [],
    heading: 45,
    altitude: 10,
    throttle: 30,
    speed: 12,
    roll: 5,
    pitch: -2,
    heartbeat: 0,
    hb_hz: '1.00 hz'
  }))

  const t = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      t.current += 1
      setData((prev) => {
        // Create gentle changes with some periodic behavior + noise
        const newHeading = wrap360(prev.heading + 2 + smoothRand(0.8))
        const newAlt = clamp(prev.altitude + Math.sin(t.current / 10) * 2 + smoothRand(0.8), 0, 5000)
        const newThr = clamp(prev.throttle + smoothRand(3), 0, 100)
        const newSpd = clamp(prev.speed + Math.sin(t.current / 8) * 0.4 + smoothRand(0.5), 0, 60)
        const newRoll = clamp(prev.roll + Math.sin(t.current / 12) * 1.2 + smoothRand(0.6), -45, 45)
        const newPitch = clamp(prev.pitch + Math.cos(t.current / 14) * 0.6 + smoothRand(0.4), -20, 20)
        let newSoc = prev.batterySoc - 0.02 + smoothRand(0.05)
        newSoc = clamp(newSoc, 0, 100)
        const flipArmed = Math.random() < 0.1 ? !prev.armed : prev.armed
        // Occasionally toggle estop to simulate events; mostly stays ON
        const flipEstop = Math.random() < 0.05 ? !prev.estopOn : prev.estopOn
        const nextMsg = `Status #${prev.heartbeat + 1}`
        const msgs = [...prev.statusMessages, nextMsg]
        if (msgs.length > 300) msgs.shift()
        // Integrate position using speed and heading
        const rad = (Math.PI / 180) * newHeading
        const meters = newSpd // per second
        const dNorth = meters * Math.cos(rad)
        const dEast = meters * Math.sin(rad)
        const metersPerDegLat = 111320
        const latRad = (Math.PI / 180) * prev.currentLat
        const metersPerDegLon = Math.max(1, Math.cos(latRad) * 111320)
        const dLat = dNorth / metersPerDegLat
        const dLon = dEast / metersPerDegLon
        const newLat = clamp(prev.currentLat + dLat, -90, 90)
        const newLon = prev.currentLon + dLon
        const newTrack = [...prev.positionTrack, { lat: newLat, lon: newLon }]
        if (newTrack.length > 2000) newTrack.shift()
        return {
          timestamp: Date.now(),
          batterySoc: newSoc,
          armed: flipArmed,
          estopOn: flipEstop,
          mode: prev.mode,
          statusMessages: msgs,
          currentLat: newLat,
          currentLon: newLon,
          positionTrack: newTrack,
          heading: newHeading,
          altitude: newAlt,
          throttle: newThr,
          speed: newSpd,
          roll: newRoll,
          pitch: newPitch,
          heartbeat: prev.heartbeat + 1,
          hb_hz: '1.00 hz'
        }
      })
    }, 1000)

    return () => clearInterval(id)
  }, [])

  function setMode(nextMode) {
    setData((prev) => ({ ...prev, mode: String(nextMode || '').toUpperCase() }))
  }

  return { ...data, setMode }
}
