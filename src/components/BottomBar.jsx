import React, { useEffect, useRef } from 'react'
import { useData } from '../context/DataContext'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'

export default function BottomBar() {
  const { statusMessages } = useData()
  const data = useData()
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

  // On page load, auto scroll to bottom
  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight;
    listRef2.current.scrollTop = listRef2.current.scrollHeight;
  }, [])

  let telementryIcon, jetsonIcon;
  telementryIcon = data.telemConnected ? <CheckIcon size={20} style={{transform:'translate(0px,4px)'}} /> : <XIcon size={20} style={{transform:'translate(0px,4px)'}} />;
  jetsonIcon = data.jetsonConnected ? <Wifi size={20} style={{transform:'translate(0px,4px)'}} /> : <WifiOff size={20} style={{transform:'translate(0px,4px)'}} />;

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
        <div style={{ padding: '6px 10px', fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ color: data.telemConnected ? '#16a34a' : '#b91c1c', justifySelf: 'center', alignSelf: 'center'}}>
            {telementryIcon}
            <label style={{paddingLeft: '5px', fontWeight: 500}}>Telemetry</label>
          </div>
        </div>
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
        <div style={{ padding: '6px 10px', fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ color: data.jetsonConnected ? '#16a34a' : '#b91c1c', justifySelf: 'center', alignSelf: 'center'}}>
            {jetsonIcon}
            <label style={{paddingLeft: '5px', fontWeight: 500}}>Jetson</label>
          </div>
        </div>
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

