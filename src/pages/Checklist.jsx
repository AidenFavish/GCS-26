import React from 'react'
import ChecklistSidebar from '../components/checklist/ChecklistSidebar'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'

export default function Checklist() {
  return (
    <div className="app-shell">
      <ChecklistSidebar />
      <main className="app-main">
        <div className="main-content">
          <MapView />
        </div>
        <BottomBar />
      </main>
    </div>
  )
}
