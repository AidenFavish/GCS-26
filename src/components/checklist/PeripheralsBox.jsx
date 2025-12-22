import React from 'react'
import { CheckIcon, Loader2, XIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { postChecklistAction } from '../../utils/api'
import FancyButton from './FancyButton'

export default function PeripheralsBox({ }) {
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
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        rowGap: 10,
        padding: '8px 12px',
      }}>
        <FancyButton
          label='Test Camera'
          onClick={() => postChecklistAction('peripherals', 'cameraTest')}
        />
        {statusIcon(data.cameraTest)}
        <FancyButton
          label='Test Payload'
          onClick={() => postChecklistAction('peripherals', 'payloadTest')}
        />
        {statusIcon(data.payloadTest)}
        <FancyButton
          label='Test PDB'
          onClick={() => postChecklistAction('peripherals', 'pdbTest')}
        />
        {statusIcon(data.pdbTest)}
    </header>
  )
}
