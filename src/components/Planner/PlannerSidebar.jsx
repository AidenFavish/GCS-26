import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GEOFENCES } from '../../utils/geofences'

function FieldRow({ idx, value, onChange }) {
  function update(key, val) {
    onChange(idx, { ...value, [key]: val })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      <input
        placeholder="lat"
        value={value.lat}
        onChange={(e) => update('lat', e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="lon"
        value={value.lon}
        onChange={(e) => update('lon', e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="alt"
        value={value.alt}
        onChange={(e) => update('alt', e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

export default function PlannerSidebar({ onSend, onSendGeofence, onClearPlan }) {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [fenceName, setFenceName] = useState('ARC Main Field West')
  const fenceNames = useMemo(() => Object.keys(GEOFENCES), [])

  function addRow() {
    setRows((r) => [...r, { lat: '', lon: '', alt: '' }])
  }
  function clearRows() {
    setRows([])
    if (onClearPlan) onClearPlan()
  }
  function updateRow(idx, next) {
    setRows((r) => r.map((x, i) => (i === idx ? next : x)))
  }
  function handleSend() {
    const parsed = rows
      .map((r) => ({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), alt: parseFloat(r.alt) }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon))
      .map((r) => ({ lat: r.lat, lon: r.lon, alt: Number.isFinite(r.alt) ? r.alt : 0 }))
    onSend(parsed)
    if (onSendGeofence) onSendGeofence(GEOFENCES[fenceName] || [])
  }

  return (
    <aside
      style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 12,
        borderRight: '1px solid var(--border)',
        background: 'var(--panel-muted)',
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/')} style={btnGhost}>← Back</button>
        <div style={{ flex: 1 }} />
        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Geofence</label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={fenceName}
            onChange={(e) => setFenceName(e.target.value)}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '8px 36px 8px 12px',
              background: 'var(--panel)',
              color: 'var(--text)',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.08)',
            }}
          >
            {fenceNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 10,
              pointerEvents: 'none',
              color: 'var(--muted)'
            }}
          >
            ▾
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={addRow} style={btnPrimary}>Add waypoint</button>
      </div>

      {rows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row, idx) => (
            <FieldRow key={idx} idx={idx} value={row} onChange={updateRow} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={clearRows} style={btnGhost}>Clear waypoints</button>
        <button onClick={handleSend} style={btnPrimary}>Send waypoints</button>
      </div>
    </aside>
  )
}

const inputStyle = {
  width: '100%',
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
