import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import ChecklistBox from './ChecklistBox'

export default function ChecklistSidebar({ }) {
  const navigate = useNavigate();

  const data = useData();

  let telementryIcon, jetsonIcon;
  telementryIcon = data.telemConnected ? <CheckIcon size={20} style={{transform:'translate(0px,4px)'}} /> : <XIcon size={20} style={{transform:'translate(0px,4px)'}} />;
  jetsonIcon = data.jetsonConnected ? <Wifi size={20} style={{transform:'translate(0px,4px)'}} /> : <WifiOff size={20} style={{transform:'translate(0px,4px)'}} />;

  return (
    <aside
      style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 12,
        borderRight: '1px solid var(--border)',
        background: 'var(--panel-muted)',
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
      }}
    >
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
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/')} style={btnGhost}>← Back</button>
      </div>
      <strong style={{ color: 'var(--text)', fontSize: 20, justifySelf: 'center', alignSelf: 'center'}}>Checklist</strong>
    </header>

    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        rowGap: 6,
        padding: '8px 12px',
      }}
    >
      <div style={{ color: data.telemConnected ? '#16a34a' : '#b91c1c', justifySelf: 'center', alignSelf: 'center'}}>
        {telementryIcon}
        <label style={{paddingLeft: '5px', fontWeight: 500}}>Telemetry</label>
      </div>

      <div style={{ color: data.jetsonConnected ? '#16a34a' : '#b91c1c', justifySelf: 'center', alignSelf: 'center'}}>
        {jetsonIcon}
        <label style={{paddingLeft: '5px', fontWeight: 500}}>Jetson</label>
      </div>

    </header>

      <ChecklistBox />
      <ChecklistBox />

      <div style={{ height: 8 }} />
    </aside>
  )
}

const btnGhost = {
  background: 'var(--panel)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  padding: '8px 10px',
  borderRadius: 6,
  cursor: 'pointer',
}
