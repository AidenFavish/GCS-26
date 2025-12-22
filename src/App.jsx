import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import { TileCacheProvider } from './context/TileCacheContext'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar/Sidebar'
import MapView from './components/MapView'
import Settings from './pages/Settings'
import PlanWaypoints from './pages/PlanWaypoints'
import BottomBar from './components/BottomBar'
import Checklist from './pages/Checklist'
import { PlannerProvider } from './components/Planner/PlannerSidebar'

function GcsHome() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="main-content">
          <MapView />
        </div>
        <BottomBar />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TileCacheProvider>
          <DataProvider>
            <PlannerProvider>
              <TopBar />
              <Routes>
                <Route path="/" element={<GcsHome />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/plan" element={<PlanWaypoints />} />
                <Route path="/checklist" element={<Checklist />} />
              </Routes>
            </PlannerProvider>
          </DataProvider>
        </TileCacheProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
