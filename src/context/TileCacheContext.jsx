import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const TileCacheContext = createContext(null)

function getInitialFlag(key, fallback = false) {
  try {
    const v = localStorage.getItem(key)
    if (v === 'true') return true
    if (v === 'false') return false
  } catch {}
  return fallback
}

function postToSW(msg) {
  if (!('serviceWorker' in navigator)) return
  const send = (sw) => {
    try { sw && sw.postMessage(msg) } catch {}
  }
  if (navigator.serviceWorker.controller) {
    send(navigator.serviceWorker.controller)
  } else {
    navigator.serviceWorker.ready.then((reg) => send(reg && reg.active))
  }
}

export function TileCacheProvider({ children }) {
  const [captureEnabled, setCaptureEnabled] = useState(() => getInitialFlag('tiles.capture', false))
  const [offlineOnly, setOfflineOnly] = useState(() => getInitialFlag('tiles.offline', false))

  // Keep SW in sync on mount and whenever flags change
  useEffect(() => {
    try { localStorage.setItem('tiles.capture', String(captureEnabled)) } catch {}
    postToSW({ type: 'SET_CAPTURE', payload: { captureEnabled } })
  }, [captureEnabled])

  useEffect(() => {
    try { localStorage.setItem('tiles.offline', String(offlineOnly)) } catch {}
    postToSW({ type: 'SET_OFFLINE_ONLY', payload: { offlineOnly } })
  }, [offlineOnly])

  // Also push initial flags once SW is ready (covers first load before effects fire)
  useEffect(() => {
    postToSW({ type: 'SET_CAPTURE', payload: { captureEnabled } })
    postToSW({ type: 'SET_OFFLINE_ONLY', payload: { offlineOnly } })
  }, [])

  const value = useMemo(() => ({
    captureEnabled,
    offlineOnly,
    toggleCapture: () => setCaptureEnabled((v) => !v),
    toggleOffline: () => setOfflineOnly((v) => !v),
    setCaptureEnabled,
    setOfflineOnly,
  }), [captureEnabled, offlineOnly])

  return <TileCacheContext.Provider value={value}>{children}</TileCacheContext.Provider>
}

export function useTileCache() {
  const ctx = useContext(TileCacheContext)
  if (!ctx) throw new Error('useTileCache must be used within <TileCacheProvider>')
  return ctx
}

