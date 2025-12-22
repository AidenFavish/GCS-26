import React from 'react'
import PlannerSidebar from '../components/Planner/PlannerSidebar'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'

export default function PlanWaypoints() {
  return (
    <div className="app-shell">
      <PlannerSidebar />
      <main className="app-main">
        <div className="main-content">
          <MapView />
        </div>
        <BottomBar />
      </main>
    </div>
  )
}
