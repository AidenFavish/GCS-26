import React, { useMemo } from 'react'

const VIEW_WIDTH = 320
const VIEW_HEIGHT = 170
const CENTER_X = VIEW_WIDTH / 2
const CENTER_Y = VIEW_HEIGHT - 8
const RADIUS = 150
const TICK_STEP = 10
const WINDOW = 95
const CARDINALS = [
  { deg: 0, label: 'North' },
  { deg: 90, label: 'East' },
  { deg: 180, label: 'South' },
  { deg: 270, label: 'West' },
]

function normalizeHeading(value) {
  let heading = value % 360
  if (heading < 0) heading += 360
  return heading
}

function relativeAngle(target, heading) {
  let diff = target - heading
  while (diff <= -180) diff += 360
  while (diff > 180) diff -= 360
  return diff
}

function pointFromAngle(relative, radius) {
  const rad = (relative * Math.PI) / 180
  return {
    x: CENTER_X + Math.sin(rad) * radius,
    y: CENTER_Y - Math.cos(rad) * radius,
  }
}

function buildTicks(heading) {
  const ticks = []
  for (let deg = 0; deg < 360; deg += TICK_STEP) {
    const rel = relativeAngle(deg, heading)
    if (rel < -WINDOW || rel > WINDOW) continue
    const isCardinal = deg % 90 === 0
    const isMajor = deg % 30 === 0
    const length = isCardinal ? 26 : isMajor ? 18 : 12
    const outer = pointFromAngle(rel, RADIUS)
    const inner = pointFromAngle(rel, RADIUS - length)
    ticks.push({ deg, outer, inner, isCardinal })
  }
  return ticks
}

function buildLabels(heading) {
  return CARDINALS.map((cardinal) => {
    const rel = relativeAngle(cardinal.deg, heading)
    if (rel < -WINDOW || rel > WINDOW) return null
    const pos = pointFromAngle(rel, RADIUS - 45)
    return { ...cardinal, rel, pos }
  }).filter(Boolean)
}

const arcPath = (() => {
  const startX = CENTER_X - RADIUS
  const endX = CENTER_X + RADIUS
  const y = CENTER_Y
  return `M ${startX} ${y} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${y} L ${endX} ${y + 4} L ${startX} ${y + 4} Z`
})()

const arcBorder = (() => {
  const startX = CENTER_X - RADIUS
  const endX = CENTER_X + RADIUS
  const y = CENTER_Y
  return `M ${startX} ${y} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${y}`
})()

function formatMetric(value, unit) {
  if (!Number.isFinite(value)) return '--'
  const rounded = Math.round(value)
  return `${rounded}${unit}`
}

export default function CompassArc({ heading = 0, airspeed = 0, groundSpeed = 0 }) {
  const normalized = normalizeHeading(heading)
  const ticks = useMemo(() => buildTicks(normalized), [normalized])
  const labels = useMemo(() => buildLabels(normalized), [normalized])
  const formattedHeading = Math.round(normalized).toString()
  const airspeedLabel = formatMetric(airspeed, ' m/s')
  const speedLabel = formatMetric(groundSpeed, ' m/s')

  return (
    <div className="compassArc">
      <div className="compassHeading">{formattedHeading}°</div>
      <div className="compassDial">
        <div className="compassCorner compassCorner-left">
          <span className="compassCorner-label">Airspeed</span>
          <span className="compassCorner-value">{airspeedLabel}</span>
        </div>
        <div className="compassCorner compassCorner-right">
          <span className="compassCorner-label">Groundspeed</span>
          <span className="compassCorner-value">{speedLabel}</span>
        </div>
        <svg className="compassSvg" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-label="Heading compass">
          <path d={arcPath} className="compassBackground" />
          <path d={arcBorder} className="compassBorder" />
          {ticks.map((tick) => (
            <line
              key={`tick-${tick.deg}`}
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              className={`compassTick ${tick.isCardinal ? 'compassTick-cardinal' : ''}`}
            />
          ))}
          {labels.map((label) => (
            <text key={label.deg} x={label.pos.x} y={label.pos.y} className="compassLabel" textAnchor="middle">
              {label.label}
            </text>
          ))}
        </svg>
        <div className="compassPointer" />
      </div>
    </div>
  )
}
