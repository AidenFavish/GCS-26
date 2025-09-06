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
          if (!prev) {
            return { ...msg, statusMessages: msg.status ? [msg.status] : [] }
          }
          return {
            ...prev,
            ...msg,
            statusMessages: [...(prev.statusMessages || []), msg.status].slice(-300),
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
