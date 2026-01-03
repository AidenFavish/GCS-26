import { useEffect, useRef, useState } from 'react'
import { postMode } from './api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function useBackendTelemetry() {
  const [data, setData] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const url = (BACKEND_URL.replace(/\/$/, '')) + '/telemetry'
    const wsUrl = url.replace('http', 'ws')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        setData((prev) => {
          // Normalize status handling: don't append empty-string or falsy statuses
          const prevStatus = (prev && prev.statusMessages) || []
          const newStatus = msg.status
          const shouldAppend = typeof newStatus === 'string' ? newStatus.length > 0 : Boolean(newStatus)

          // jetson status messages
          const prevJetsonStatus = (prev && prev.jetsonMessages) || []
          const newJetsonStatus = msg.jetsonMsg
          const shouldAppendJetson = typeof newJetsonStatus === 'string' ? newJetsonStatus.length > 0 : Boolean(newJetsonStatus)

          // Build/extend position track from currentLat/currentLon in messages
          const prevTrack = (prev && prev.positionTrack) || []
          const hasLat = Number.isFinite(msg.currentLat)
          const hasLon = Number.isFinite(msg.currentLon)
          let nextTrack = prevTrack
          if (hasLat && hasLon) {
            const pt = { lat: msg.currentLat, lon: msg.currentLon }
            nextTrack = [...prevTrack, pt]
            if (nextTrack.length > 2000) nextTrack = nextTrack.slice(-2000)
          }

          if (!prev) {
            return {
              ...msg,
              statusMessages: shouldAppend ? [newStatus] : [],
              jetsonMessages: shouldAppendJetson ? [newJetsonStatus]: [],
              positionTrack: nextTrack,
            }
          }

          return {
            ...prev,
            ...msg,
            statusMessages: shouldAppend ? [...prevStatus, newStatus].slice(-300) : prevStatus, // keep last 300
            jetsonMessages: shouldAppendJetson ? [...prevJetsonStatus, newJetsonStatus].slice(-300) : prevJetsonStatus,
            positionTrack: nextTrack,
          }
        })
      } catch {}
    }
    ws.onerror = () => {}
    return () => {
      try { ws.close() } catch {}
    }
  }, [])

  function setMode(nextMode) {
    setData((prev) => (prev ? { ...prev, mode: String(nextMode || '').toUpperCase() } : prev))
    postMode(nextMode)
  }

  return { ...data, setMode }
}
