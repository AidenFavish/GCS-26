import React from 'react'

// Props:
// - estopOn: boolean (true means E-STOP circuit engaged/OK)
// - armed: boolean (from system state)
// Behavior:
// - estopOn === true  -> green (safe)
// - estopOn === false && armed === true -> solid red (critical)
// - estopOn === false && armed === false -> flashing red (attention)
export default function EStopStatus({ estopOn, armed }) {
  const isSafe = !!estopOn
  const isCritical = !estopOn && !!armed
  const shouldFlash = !!(estopOn == armed)

  const bg = isSafe ? 'var(--good-green)' : 'var(--bad-red)'
  const text = isSafe ? 'E-STOP ON' : 'E-STOP OFF'

  return (
    <div
      className={shouldFlash ? 'estop-flash' : undefined}
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
      title={isSafe ? 'E-STOP circuit OK' : isCritical ? 'E-STOP OFF while ARMED' : 'E-STOP OFF while DISARMED'}
    >
      {text}
    </div>
  )
}
