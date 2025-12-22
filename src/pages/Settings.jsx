import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTileCache } from '../context/TileCacheContext'

const UNIT_COOKIE = 'gcs-unit-system'
const UNIT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

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

function writeUnitCookie(unitSystem) {
  if (typeof document === 'undefined') return
  const value = unitSystem === 'imperial' ? 'imperial' : 'metric'
  document.cookie = `${UNIT_COOKIE}=${encodeURIComponent(value)}; Max-Age=${UNIT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}

export default function Settings() {
  const navigate = useNavigate()
  const swReady = 'serviceWorker' in navigator
  const { captureEnabled, offlineOnly, toggleCapture, toggleOffline } = useTileCache()
  const [unitSystem, setUnitSystem] = React.useState(() => readUnitCookie())

  React.useEffect(() => {
    writeUnitCookie(unitSystem)
  }, [unitSystem])

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/')} style={btnGhost}>← Back</button>
        <h2 style={{ margin: 0 }}>Settings</h2>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Units</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setUnitSystem('metric')}
            style={unitSystem === 'metric' ? btnToggleActive : btnToggle}
          >
            Metric
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            style={unitSystem === 'imperial' ? btnToggleActive : btnToggle}
          >
            Imperial
          </button>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          Current: {unitSystem === 'metric' ? 'Metric (m, m/s)' : 'Imperial (ft, mph)'}
        </div>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Offline Maps</h3>
        {!swReady && (
          <div style={{ color: 'var(--muted)' }}>Service worker not available in this environment.</div>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={toggleCapture} style={btnPrimary}>
            {captureEnabled ? 'Stop Downloading Tiles' : 'Start Downloading Tiles'}
          </button>
          <button onClick={toggleOffline} style={btnPrimary}>
            {offlineOnly ? 'Disable Offline Maps' : 'Enable Offline Maps'}
          </button>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          Status: capture {captureEnabled ? 'ON' : 'OFF'} · offline {offlineOnly ? 'ON' : 'OFF'}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          While downloading is ON, any tiles you view will be saved. Enable Offline Maps to serve tiles from cache only.
        </p>
      </div>
    </div>
  )
}

const btnPrimary = {
  background: 'var(--primary)',
  color: 'var(--button-text)',
  border: 0,
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
}

const btnGhost = {
  background: 'var(--panel)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
}

const btnToggle = {
  background: 'var(--panel)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  padding: '6px 12px',
  borderRadius: 8,
  cursor: 'pointer',
}

const btnToggleActive = {
  ...btnToggle,
  background: 'var(--primary)',
  color: 'var(--button-text)',
  border: '1px solid var(--primary)',
}

const card = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 12,
}
