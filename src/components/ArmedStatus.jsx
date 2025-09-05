import React from 'react'

export default function ArmedStatus({ armed }) {
  const bg = armed ? '#16a34a' : '#b91c1c'
  const text = armed ? 'ARMED' : 'DISARMED'
  return (
    <div
      style={{
        background: bg,
        color: 'white',
        padding: '6px 10px',
        borderRadius: 25,
        fontWeight: 700,
        letterSpacing: 1,
        minWidth: 100,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}

