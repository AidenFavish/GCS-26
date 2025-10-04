import React from 'react'
import { useNavigate } from 'react-router-dom'
import Battery from './Battery'
import ArmedStatus from './ArmedStatus'
import EStopStatus from './EStopStatus'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useTileCache } from '../context/TileCacheContext'
import { CircleArrowDown } from 'lucide-react'

function fmtTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString()
}

export default function TopBar() {
  const data = useData()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const { captureEnabled, offlineOnly } = useTileCache()
  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
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
        <strong style={{ color: 'var(--text)', minWidth: 180 }}>Ground Control Station</strong>
        <span style={{ color: 'var(--muted)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 175 }}>
          Last refresh: {fmtTime(data.timestamp)}
        </span>
        <ArmedStatus armed={data.armed} />
        <EStopStatus estopOn={data.estopOn} armed={data.armed} />
        {captureEnabled && !offlineOnly && (
          <div
            className='download-pulse'
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '6px 10px',
              borderRadius: 6,
              fontWeight: 500,
              letterSpacing: 0.5,
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)',
              fontSize: 12,
            }}
            title="Downloading tiles"
          >
            <CircleArrowDown size={18} style={{transform: "translate(0px, 2px)"}} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 25, justifySelf: 'end', flexWrap: 'wrap' }}>
        <Battery soc={data.batterySoc} />
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
