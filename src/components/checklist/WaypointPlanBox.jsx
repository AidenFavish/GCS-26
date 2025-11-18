import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useState, useEffect } from "react";
import FancyButton from './FancyButton'

export default function WaypointPlanBox({ }) {
  const navigate = useNavigate();

  const planner = () => navigate('/plan')

  return (
    <div>
        <div style={{height: 5}}></div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 12 }}>
          <FancyButton label='Plan Waypoints' onClick={planner}/>
        </div>
        <div style={{height: 5}}></div>
        <header
        style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr)',
            alignItems: 'center',
            justifyItems: 'center',
            rowGap: 12,
            padding: '0px 0px',
        }}>
            <span style={lapBadge}>Laps: 3</span>
            <span style={lapBadge}>Lap Dist: 150 m</span>
            <span style={lapBadge}>Total: 450 m</span>
            <span style={lapBadge}>Waypoints: 5</span>
        </header>
        <div style={{height: 10}}></div>
        <div style={{gap: 10, display: 'flex', justifyContent: 'center', width: '92%', color: '#16a34a'}}>
            <span>Geofence Enabled</span>
            <CheckIcon size={20} />
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
