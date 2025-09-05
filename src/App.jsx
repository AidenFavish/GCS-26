import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar/Sidebar'
import MapView from './components/MapView'
import Settings from './pages/Settings'
import PlanWaypoints from './pages/PlanWaypoints'
import BottomBar from './components/BottomBar'

function GcsHome({ waypoints, geofence }) {
  return (
    <div className="app-shell">
      <Sidebar waypoints={waypoints} />
      <main className="app-main">
        <div className="main-content">
          <MapView waypoints={waypoints} geofence={geofence} />
        </div>
        <BottomBar />
      </main>
    </div>
  )
}

export default function App() {
  const [waypoints, setWaypoints] = useState([])
  const [geofence, setGeofence] = useState([])
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <TopBar />
          <Routes>
            <Route path="/" element={<GcsHome waypoints={waypoints} geofence={geofence} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/plan" element={<PlanWaypoints savedWaypoints={waypoints} geofence={geofence} onSend={setWaypoints} onSetGeofence={setGeofence} onClearPlan={() => setWaypoints([])} />} />
          </Routes>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
