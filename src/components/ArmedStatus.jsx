import React from 'react'

export default function ArmedStatus({ armed }) {
  const bg = armed ? 'var(--good-green)' : 'var(--bad-red)'
  const text = armed ? 'ARMED' : 'DISARMED'
  return (
    <div
      style={{
        background: bg,
        color: 'white',
        padding: '4px 6px 2px',
        borderRadius: 25,
        fontWeight: 700,
        letterSpacing: 1,
        minWidth: 120,
        textAlign: 'center',
        fontFamily: 'Helvetica'
      }}
    >
      {text}
    </div>
  )
}

