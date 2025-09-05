import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTileCache } from '../context/TileCacheContext'

export default function Settings() {
  const navigate = useNavigate()
  const swReady = 'serviceWorker' in navigator
  const { captureEnabled, offlineOnly, toggleCapture, toggleOffline } = useTileCache()

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/')} style={btnGhost}>← Back</button>
        <h2 style={{ margin: 0 }}>Settings</h2>
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

const card = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 12,
}
