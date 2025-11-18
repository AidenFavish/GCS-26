import React, { useMemo } from 'react'

const PITCH_PX_PER_DEG = 3.5
const MARKS = [-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30]

function formatAngle(value) {
  if (!Number.isFinite(value)) return '--'
  return `${value.toFixed(1)}°`
}

export default function AttitudeBox({ roll = 0, pitch = 0 }) {
  const translation = -pitch * PITCH_PX_PER_DEG
  const marks = useMemo(() => MARKS, [])

  return (
    <div className="attitudeModule">
      <div className="attitudeViewport">
        <div className="attitudeInner" style={{ transform: `rotate(${roll}deg)` }}>
          <div className="attitudeSky" style={{ transform: `translateY(${translation}px)` }}>
            <div className="attitudeHorizon" />
            <div className="attitudePitchMarks">
              {marks.map((mark) => {
                const isMajor = Math.abs(mark) % 10 === 0
                return (
                  <div
                    key={mark}
                    className={`pitchMark ${isMajor ? 'pitchMark-major' : 'pitchMark-minor'} ${mark === 0 ? 'pitchMark-zero' : ''}`}
                    style={{ top: `calc(50% - ${mark * PITCH_PX_PER_DEG}px)` }}
                  >
                    {isMajor && mark !== 0 && (
                      <>
                        <span className="pitchLabel pitchLabel-left">{Math.abs(mark)}</span>
                        <span className="pitchLabel pitchLabel-right">{Math.abs(mark)}</span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="attitudeReference">
          <div className="reference-wing reference-wing-left" />
          <div className="reference-center" />
          <div className="reference-wing reference-wing-right" />
        </div>
      </div>
      <div className="attitudeReadout">
        <div>Pitch {formatAngle(pitch)}</div>
        <div>Roll {formatAngle(roll)}</div>
      </div>
    </div>
  )
}
