import React from 'react'
import { useNavigate } from 'react-router-dom'
import Battery from './Battery'
import ArmedStatus from './ArmedStatus'
import EStopStatus from './EStopStatus'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

function fmtTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString()
}

export default function TopBar() {
  const data = useData()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        columnGap: 8,
        rowGap: 6,
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--panel)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 25, minWidth: 0, flex: 1 }}>
        <strong style={{ color: 'var(--text)' }}>Ground Control Station</strong>
        <span style={{ color: 'var(--muted)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Last refresh: {fmtTime(data.timestamp)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, justifySelf: 'center', flexWrap: 'wrap' }}>
        <ArmedStatus armed={data.armed} />
        <EStopStatus estopOn={data.estopOn} armed={data.armed} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: 'end', flexWrap: 'wrap' }}>
        <Battery soc={data.batterySoc} />
        <div style={{color: 'rgba(0,0,0,0)'}}>Spacer</div>
        <button
          onClick={toggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            background: 'var(--panel-muted)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button
          onClick={() => navigate('/settings')}
          style={{
            background: 'var(--primary)',
            color: 'var(--button-text)',
            border: 0,
            padding: '8px 12px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Settings
        </button>
      </div>
    </header>
  )
}
