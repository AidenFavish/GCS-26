import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useState, useEffect } from "react";
import FancyButton from './FancyButton'

export default function StartMissionBox({ }) {
  const navigate = useNavigate();
  const [missionStarted, setMissionStarted] = useState(false)
  const data = useData()

  const toggleStarted = () => setMissionStarted(!missionStarted)

  return (
    <div style={{height: 10}}>
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          alignItems: 'center',
          justifyItems: 'center',
          rowGap: 10,
          padding: '8px 12px',
        }}>
          {data.estopOn ? <span style={lapBadge}>ESTOP ON</span>:<span style={lapBadge}>ESTOP OFF</span>}
          {!data.estopOn ? <CheckIcon size={20} strokeWidth={4} style={{color: '#16a34a'}}/>:<XIcon size={20} strokeWidth={4} style={{color:'#b91c1c'}} />}
      </header>
      <div style={{height: 5}}></div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 12 }}>
        {!data.estopOn ? <label>Arm for Takeoff</label>: <div></div>}
      </div>
  </div>
  )
}

const lapBadge = {
display: 'inline-flex',
alignItems: 'center',
padding: '4px 10px',
background: 'var(--panel-selected)',
border: '1px solid var(--border)',
borderRadius: 8,
color: 'var(--text)',
fontWeight: 600,
boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}
