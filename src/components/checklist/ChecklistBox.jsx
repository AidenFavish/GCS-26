import React, { useState } from 'react'
import { Square, CheckSquare } from 'lucide-react'

export default function ChecklistBox({height, titleText, selected, checked, content, setCheck}) {
  const GREEN = '#16a34a'

  return (
    <div style={{
    display: 'grid',
    gridTemplateColumns: '10px 1fr',
    alignItems: 'stretch',
    columnGap: 12,
    width: '100%',
    }}>
      {/* Left rail with dot and vertical line */}
      <div style={{position: 'relative'}}>
        <div style={{ ...dot, background: checked ? GREEN:'var(--mode-button)' }} />
        <div style={{ ...line, background: checked ? GREEN:'var(--mode-button)' }} />
      </div>

      {/* Right rounded rectangle panel */}
      <div style={{
        minHeight: height,
        background: selected? 'var(--panel-selected)':'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        }}>
          <button
            aria-label={checked ? 'Uncheck' : 'Check'}
            style={checkboxButton}
            onClick={setCheck}
            onKeyDown={setCheck}
          >
            {checked ? (
              <CheckSquare size={18} color={GREEN} />
            ) : (
              <Square size={18} color={selected ? 'var(--text)':'var(--mode-button)'} />
            )}
          </button>
          <h3 style={title}>{titleText}</h3>
          <div aria-hidden style={{ width: 18 }} />
        </div>
        <div style={{minHeight: 10}}></div>
        {content}
        <div style={{ flex: 1 }} />
      </div>
    </div>
  )
}

const dot = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 10,
  height: 10,
  borderRadius: '9999px',
}

const line = {
  position: 'absolute',
  top: 10, // continues just below the dot
  left: 4, // centers under the 10px dot
  width: 2,
  height: '100%',
  borderRadius: 1,
}

const title = {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  textAlign: 'center',
  justifySelf: 'center',
}

const checkboxButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '2px solid var(--border)',
  background: 'transparent',
  cursor: 'pointer',
}
