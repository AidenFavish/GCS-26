import React from 'react'
import PlannerSidebar from '../components/Planner/PlannerSidebar'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'

export default function PlanWaypoints({ savedWaypoints, geofence, onSend, onSetGeofence, onClearPlan }) {
  return (
    <div className="app-shell">
      <PlannerSidebar onSend={onSend} onSendGeofence={onSetGeofence} onClearPlan={onClearPlan} />
      <main className="app-main">
        <div className="main-content">
          <MapView waypoints={savedWaypoints} geofence={geofence} />
        </div>
        <BottomBar />
      </main>
    </div>
  )
}
