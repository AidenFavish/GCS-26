import React, { useState } from 'react'

export default function WaypointForm({ onAdd, onClear, waypoints }) {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [alt, setAlt] = useState('')

  function handleAdd() {
    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)
    const altNum = parseFloat(alt)
    if (Number.isFinite(latNum) && Number.isFinite(lonNum)) {
      onAdd({ lat: latNum, lon: lonNum, alt: Number.isFinite(altNum) ? altNum : 0 })
      setLat('')
      setLon('')
      setAlt('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="lon"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnPrimary} onClick={handleAdd}>Add waypoint</button>
        <button style={btnGhost} onClick={onClear}>Clear waypoints</button>
      </div>
      <div>
        <strong>Waypoints ({waypoints.length})</strong>
      </div>
    </div>
  )
}

const inputStyle = {
  flex: 1,
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '6px 8px',
  background: 'var(--panel)',
  color: 'var(--text)'
}

const btnPrimary = {
  background: 'var(--primary)',
  color: 'var(--button-text)',
  border: 0,
  padding: '8px 10px',
  borderRadius: 6,
  cursor: 'pointer',
}

const btnGhost = {
  background: 'var(--panel)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  padding: '8px 10px',
  borderRadius: 6,
  cursor: 'pointer',
}
