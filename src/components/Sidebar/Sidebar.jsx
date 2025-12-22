import React from 'react'
import { useNavigate } from 'react-router-dom'
import ModeButton from '../ModeButton'
import SixPack from '../SixPack/SixPack'
import StatDisplay from '../StatDisplay/StatDisplay'

export default function Sidebar() {
  const navigate = useNavigate()
  const availableHeight = 'calc(100vh - var(--top-bar-height))'
  return (
    <div
      className="sidebarShell"
      style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '12px 0px 0px 0px',
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap', justifyContent: 'center' }}>
          <ModeButton mode='BRAKE' />
          <ModeButton mode='GUIDED' />
          <ModeButton mode='RTL' />
        </div>
        <div style={{width: 320}}>
          <StatDisplay />
        </div>
        <SixPack />
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
