import React from 'react'
import { useNavigate } from 'react-router-dom'
import ModeButton from '../ModeButton'
import SixPack from '../SixPack/SixPack'
import StatDisplay from '../StatDisplay/StatDisplay'

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
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 3 }}>
        <button
          onClick={() => navigate('/checklist')}
          style={{
            background: 'var(--primary)',
            color: 'var(--button-text)',
            border: 0,
            padding: '8px 18px',
            borderRadius: 12,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 18
          }}
        >
          Flight Checklist
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, alignSelf: 'center', width: 'fit-content', flexWrap: 'wrap' }}>
        <ModeButton mode='BRAKE'/>
        <ModeButton mode='GUIDED'/>
        <ModeButton mode='RTL'/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, alignSelf: 'center', width: 'fit-content', flexWrap: 'wrap' }}>
        <StatDisplay />
      </div>
      <SixPack />
      <div style={{ height: 8 }} />
    </aside>
  )
}
