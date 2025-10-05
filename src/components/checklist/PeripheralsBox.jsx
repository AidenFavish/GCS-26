import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, XIcon, CheckIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useState, useEffect } from "react";
import FancyButton from './FancyButton'

export default function PeripheralsBox({ }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        rowGap: 10,
        padding: '8px 12px',
      }}>
        <FancyButton label='Test Camera' />
        <CheckIcon size={20} strokeWidth={4} style={{color: '#16a34a'}}/>
        <FancyButton label='Test Payload' />
        <CheckIcon size={20} strokeWidth={4} style={{color: '#16a34a'}}/>
        <FancyButton label='Test PDB' />
        <CheckIcon size={20} strokeWidth={4} style={{color: '#16a34a'}}/>
    </header>
  )
}