import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useState, useEffect } from "react";
import FancyButton from './FancyButton'
import { postArmScriptAction } from '../../utils/api'
import { CheckIcon, Loader2, XIcon } from 'lucide-react'

export default function StandbyBox({ }) {
  const navigate = useNavigate();
  const [missionStarted, setMissionStarted] = useState(false)
  const data = useData()


  const statusIcon = (value) => {
    if (value === 2) {
      return <CheckIcon size={20} strokeWidth={4} style={{ color: 'var(--good-green)' }} />
    }
    if (value === 1) {
      return (
        <Loader2
          size={20}
          strokeWidth={3}
          className="status-spinner"
          style={{ color: '#f59e0b' }}
        />
      )
    }
    return <XIcon size={20} strokeWidth={4} style={{ color: 'var(--bad-red)' }} />
  }

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
          <FancyButton label={data.armScript === 0 ? 'Arm Script': data.armScript === 1 ? 'loading...': 'Disarm Script'} onClick={() => postArmScriptAction(Date.now().toString())} />
          {statusIcon(data.armScript)}
      </header>
      <div style={{height: 5}}></div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 12 }}>
        {data.armScript === 2 ? <label>Standby for Takeoff</label>: <div></div>}
      </div>
  </div>
  )
}