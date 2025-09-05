import React from 'react'

export default function WaypointList({ waypoints }) {
  return (
    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--panel)' }}>
      {waypoints.length === 0 ? (
        <div style={{ padding: 8, color: 'var(--muted)' }}>No waypoints yet</div>
      ) : (
        waypoints.map((wp, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderTop: idx === 0 ? 'none' : '1px solid var(--border)' , fontVariantNumeric: 'tabular-nums' }}>
            <div>#{idx + 1}</div>
            <div>
              {wp.lat.toFixed(5)}, {wp.lon.toFixed(5)}
              {Number.isFinite(wp.alt) ? ` @ ${Math.round(wp.alt)}m` : ''}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
