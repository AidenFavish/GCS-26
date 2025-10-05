import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useState, useEffect } from "react";
import FancyButton from './FancyButton'

export default function StandbyBox({ }) {
  const navigate = useNavigate();
  const [missionStarted, setMissionStarted] = useState(false)

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
          <FancyButton label={missionStarted ? 'Disarm Script':'Arm Script'} onClick={toggleStarted} />
          {missionStarted ? <CheckIcon size={20} strokeWidth={4} style={{color: '#16a34a'}}/>:<XIcon size={20} strokeWidth={4} style={{color:'#b91c1c'}} />}
      </header>
      <div style={{height: 5}}></div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 12 }}>
        {missionStarted ? <label>Standby for Takeoff</label>: <div></div>}
      </div>
  </div>
  )
}