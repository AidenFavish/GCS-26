import React from 'react'

export default function Settings() {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Settings</h2>
      <p style={{ color: '#4b5563' }}>
        This is a placeholder settings page. Add your configuration controls here.
      </p>
      <ul style={{ marginTop: 12 }}>
        <li>Update map tile URL</li>
        <li>Change units (metric/imperial)</li>
        <li>Configure update rates and alerts</li>
      </ul>
    </div>
  )
}

