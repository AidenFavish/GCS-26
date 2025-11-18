import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Battery from './Battery'
import ArmedStatus from './ArmedStatus'
import EStopStatus from './EStopStatus'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useTileCache } from '../context/TileCacheContext'
import { CircleArrowDown } from 'lucide-react'
import ThemeTogglePill from './ThemeToggle'
import { Cog } from 'lucide-react'
import Payloads from './Payloads'
import forgeLogo from '../assets/forge_print_yellow.png'
import FancyButton from './checklist/FancyButton'
import { useElementHeightVar } from '../hooks/useElementHeightVar'

function fmtTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString()
}

export default function TopBar() {
  const data = useData()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const { captureEnabled, offlineOnly } = useTileCache()
  const headerRef = useRef(null)
  useElementHeightVar(headerRef, '--top-bar-height')
  return (
    <header
      ref={headerRef}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 25, minWidth: 0, flex: 1, height: 25 }}>
        <img
          src={forgeLogo}
          alt="Forge Ground Control Station"
          style={{ height: 50, objectFit: 'scale-down', minWidth: 180 }}
        />
        <FancyButton label='Flight Checklist' onClick={() => navigate('/checklist')}/>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 25, justifySelf: 'center', flexWrap: 'wrap'}}>
        <ArmedStatus armed={data.armed} />
        <EStopStatus estopOn={data.estopOn} armed={data.armed} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 25, justifySelf: 'end', flexWrap: 'wrap' }}>
        <Payloads />
        <Battery soc={data.batterySoc} />
        <ThemeTogglePill />
        <button
          onClick={() => navigate('/settings')}
          style={{
            background: 'var(--mode-button)',
            color: 'var(--primary)',
            border: 0,
            padding: '1px 4px',
            borderRadius: 20,
            cursor: 'pointer',
          }}
        >
          <Cog size={25} strokeWidth={2.5} style={{transform: 'translate(0px, 3px'}}/>
        </button>
      </div>
    </header>
  )
}
