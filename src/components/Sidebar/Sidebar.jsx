import React from 'react'
import SixPack from '../SixPack/SixPack'
import { useNavigate } from 'react-router-dom'
import ModeButton from '../ModeButton'

export default function Sidebar({ waypoints }) {
  const navigate = useNavigate()
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
      <button
        onClick={() => navigate('/checklist')}
        style={{
          background: 'var(--primary)',
          color: 'var(--button-text)',
          border: 0,
          padding: '10px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: 20
        }}
      >
        Flight Checklist
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15, alignSelf: 'center', width: 'fit-content', flexWrap: 'wrap' }}>
        <ModeButton mode='BRAKE'/>
        <ModeButton mode='GUIDED'/>
        <ModeButton mode='RTL'/>
      </div>
      <SixPack />
      <div style={{ height: 8 }} />
    </aside>
  )
}
