import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GEOFENCES } from '../../utils/geofences'
import { postPlan } from '../../utils/api'

const PlannerContext = createContext(null)

export function PlannerProvider({ children }) {
  const [waypoints, setWaypoints] = useState([])
  const [geofence, setGeofence] = useState([])
  const [geofenceName, setGeofenceName] = useState('ARC Main Field West')

  const value = useMemo(() => ({
    waypoints,
    setWaypoints,
    geofence,
    setGeofence,
    geofenceName,
    setGeofenceName,
  }), [waypoints, geofence, geofenceName])

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlannerPlan() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlannerPlan must be used within <PlannerProvider>')
  return ctx
}

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

export default function PlannerSidebar() {
  const navigate = useNavigate()
  const {
    waypoints,
    setWaypoints,
    setGeofence,
    geofenceName,
    setGeofenceName,
  } = usePlannerPlan()
  const [rows, setRows] = useState([])
  const fenceNames = useMemo(() => Object.keys(GEOFENCES), [])
  const availableHeight = 'calc(100vh - var(--top-bar-height))'

  useEffect(() => {
    if (rows.length > 0) return
    if (!Array.isArray(waypoints) || waypoints.length === 0) return
    setRows(
      waypoints.map((wp) => ({
        lat: Number.isFinite(wp.lat) ? String(wp.lat) : '',
        lon: Number.isFinite(wp.lon) ? String(wp.lon) : '',
        alt: Number.isFinite(wp.alt) ? String(wp.alt) : '',
      }))
    )
  }, [rows.length, waypoints])

  function addRow() {
    setRows((r) => [...r, { lat: '', lon: '', alt: '' }])
  }
  function clearRows() {
    setRows([])
    setWaypoints([])
  }
  function updateRow(idx, next) {
    setRows((r) => r.map((x, i) => (i === idx ? next : x)))
  }
  function handleSend() {
    const parsedWaypoints = rows
      .map((r) => ({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), alt: parseFloat(r.alt) }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon))
      .map((r) => ({ lat: r.lat, lon: r.lon, alt: Number.isFinite(r.alt) ? r.alt : 0 }))
    const fencePoints = GEOFENCES[geofenceName] || []
    const payload = {
      waypoints: parsedWaypoints.map((wp) => ({
        latitude: wp.lat,
        longitude: wp.lon,
        altitude: wp.alt,
      })),
      geofence: {
        name: geofenceName,
        points: fencePoints.map((pt) => ({ lat: pt.lat, lon: pt.lon })),
      },
    }

    setWaypoints(parsedWaypoints)
    setGeofence(fencePoints)
    postPlan(payload)
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
        height: availableHeight,
        maxHeight: availableHeight,
        minHeight: 0,
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/checklist')} style={btnGhost}>← Back</button>
        <div style={{ flex: 1 }} />
        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Geofence</label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={geofenceName}
            onChange={(e) => setGeofenceName(e.target.value)}
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
