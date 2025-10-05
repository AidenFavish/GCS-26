import React, { useEffect, useRef } from 'react'
import { useData } from '../context/DataContext'

export default function BottomBar() {
  const { statusMessages } = useData()
  const listRef = useRef(null)
  const listRef2 = useRef(null)

  // Auto-scroll to bottom when new items arrive if user is near bottom
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    if (nearBottom) {
      el.scrollTop = el.scrollHeight
    }
  }, [statusMessages])

  useEffect(() => {
    const el = listRef2.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    if (nearBottom) {
      el.scrollTop = el.scrollHeight
    }
  }, [statusMessages])

  return (
    <footer
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        rowGap: 10,
        position: 'sticky',
        bottom: 0,
        background: 'var(--panel)',
        borderTop: '1px solid var(--border)',
        zIndex: 900,
      }}
    >
      <div style={{border: '0.5px solid var(--border)'}}>
        <div style={{ padding: '6px 10px', fontSize: 12, color: 'var(--muted)' }}>Telemetry</div>
        <div
          ref={listRef}
          style={{
            maxHeight: 120,
            overflowY: 'auto',
            padding: '0 10px 8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: 'var(--panel)',
          }}
        >
          {statusMessages.map((msg, idx) => (
            <div key={idx} style={{ color: 'var(--text)', fontSize: 13 }}>
              {msg}
            </div>
          ))}
          {statusMessages.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No status yet…</div>
          )}
        </div>
      </div>

      <div style={{border: '0.5px solid var(--border)'}}>
        <div style={{ padding: '6px 10px', fontSize: 12, color: 'var(--muted)' }}>Jetson</div>
        <div
          ref={listRef2}
          style={{
            maxHeight: 120,
            overflowY: 'auto',
            padding: '0 10px 8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: 'var(--panel)',
          }}
        >
          {statusMessages.map((msg, idx) => (
            <div key={idx} style={{ color: 'var(--text)', fontSize: 13 }}>
              {msg}
            </div>
          ))}
          {statusMessages.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No status yet…</div>
          )}
        </div>
      </div>
      
    </footer>
  )
}

