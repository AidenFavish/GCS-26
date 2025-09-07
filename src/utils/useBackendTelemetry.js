import { useEffect, useRef, useState } from 'react'
import { postMode } from './api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function useBackendTelemetry() {
  const [data, setData] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const url = (BACKEND_URL.replace(/\/$/, '')) + '/ws/telemetry'
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

          if (!prev) {
            return { ...msg, statusMessages: shouldAppend ? [newStatus] : [] }
          }

          return {
            ...prev,
            ...msg,
            statusMessages: shouldAppend ? [...prevStatus, newStatus].slice(-300) : prevStatus, // keep last 300
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
