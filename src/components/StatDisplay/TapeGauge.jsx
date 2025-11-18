import React, { useMemo } from 'react'

const ITEM_HEIGHT = 28
const VISIBLE_COUNT = 7
const WINDOW_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT
const TOTAL_COUNT = 25

function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

function buildTape(value, step, min, max) {
  const safeStep = Math.max(step, 0.001)
  const clamped = clamp(value, min, max)
  const centerSpan = Math.floor(TOTAL_COUNT / 2) * safeStep
  const top = Math.ceil(clamped / safeStep) * safeStep + centerSpan
  const values = []
  for (let i = 0; i < TOTAL_COUNT; i += 1) {
    const tickValue = Number((top - i * safeStep).toFixed(2))
    values.push(tickValue)
  }
  const index = (top - clamped) / safeStep
  const translateY = WINDOW_HEIGHT / 2 - (index * ITEM_HEIGHT + ITEM_HEIGHT / 2)
  return { values, translateY }
}

export default function TapeGauge({
  label,
  value = 0,
  unit,
  step = 5,
  min = 0,
  max = 200,
  precision = 0,
  showSign = false,
}) {
  const { values, translateY } = useMemo(() => buildTape(value, step, min, max), [value, step, min, max])
  const majorSpacing = Math.max(Math.round(Math.max(step, 1)), 1) * 2
  const formattedValue = useMemo(() => {
    if (!Number.isFinite(value)) return '--'
    const fixed = precision > 0 ? value.toFixed(precision) : Math.round(value).toString()
    if (showSign && Number(value) > 0) {
      return `+${fixed}`
    }
    return fixed
  }, [value, precision, showSign])

  return (
    <div className="tapeGauge">
      <div className="tapeTitle">{label}</div>
      <div className="tapeReadout">
        <span>{formattedValue}</span>
        {unit && <small>{unit}</small>}
      </div>
      <div className="tapeWindow" style={{ height: WINDOW_HEIGHT }}>
        <div className="tapeGradient tapeGradient-top" />
        <div className="tapeGradient tapeGradient-bottom" />
        <div className="tapeList" style={{ transform: `translateY(${translateY}px)` }}>
          {values.map((tickValue, idx) => {
            const inRange = tickValue >= min && tickValue <= max
            const isMajor = Math.abs(Math.round(tickValue)) % majorSpacing === 0
            const display = inRange ? (Number.isInteger(tickValue) ? tickValue : tickValue.toFixed(1)) : ''
            return (
              <div key={`${label}-tick-${idx}`} className={`tapeTick ${isMajor ? 'tapeTick-major' : ''}`}>
                {display}
              </div>
            )
          })}
        </div>
        <div className="tapeCenterLine" />
      </div>
    </div>
  )
}
