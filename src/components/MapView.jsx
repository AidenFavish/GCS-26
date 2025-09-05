import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { useTileCache } from '../context/TileCacheContext'

function AutoCenter({ waypoints, fallback }) {
  const map = useMap()
  React.useEffect(() => {
    if (!map) return
    if (!waypoints || waypoints.length === 0) {
      map.setView(fallback, 5)
      return
    }
    if (waypoints.length === 1) {
      map.setView([waypoints[0].lat, waypoints[0].lon], 12)
      return
    }
    const bounds = waypoints.map((w) => [w.lat, w.lon])
    map.fitBounds(bounds, { padding: [30, 30] })
  }, [map, waypoints, fallback])
  return null
}

const WP_RADIUS_M = 75  // The waypoint radius in meters

export default function MapView({ waypoints, geofence = [] }) {
  const data = useData()
  const { captureEnabled, offlineOnly } = useTileCache()
  const center = useMemo(() => {
    return waypoints.length > 0 ? [waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lon] : [37.7749, -122.4194]
  }, [waypoints])

  const arrowIcon = useMemo(() => {
    const size = 28
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block; transform: rotate(${data.heading}deg);">
        <polygon points="12,2 20,22 12,17 4,22" fill="#ef4444" />
      </svg>
    `
    return L.divIcon({ html: svg, className: 'arrow-icon', iconSize: [size, size], iconAnchor: [size/2, size/2] })
  }, [data.heading])

  const tileUrl = offlineOnly
    ? '/offline-tiles/{z}/{x}/{y}.png'
    : (captureEnabled && import.meta.env.DEV
        ? '/tile-proxy/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer center={center} zoom={6} keyboard={false} style={{ height: '100%', width: '100%', outline: 'none' }}>
        <TileLayer url={tileUrl} attribution="&copy; OpenStreetMap contributors" />
        <AutoCenter waypoints={waypoints} fallback={center} />
        {waypoints.map((wp, idx) => (
          <React.Fragment key={idx}>
            <Circle center={[wp.lat, wp.lon]} radius={WP_RADIUS_M} pathOptions={{ color: '#2563eb', fillOpacity: 0.05 }} />
            <CircleMarker center={[wp.lat, wp.lon]} radius={4} pathOptions={{ color: '#2563eb' }} />
          </React.Fragment>
        ))}
        {waypoints.length > 1 && (
          <Polyline positions={waypoints.map((w) => [w.lat, w.lon])} pathOptions={{ color: '#2563eb' }} />
        )}
        {Array.isArray(geofence) && geofence.length > 1 && (
          <Polyline positions={geofence.map((p) => [p.lat, p.lon])} pathOptions={{ color: '#22c55e' }} />
        )}
        {data.positionTrack && data.positionTrack.length > 1 && (
          <Polyline positions={data.positionTrack.map((p) => [p.lat, p.lon])} pathOptions={{ color: '#ef4444' }} />
        )}
        {Number.isFinite(data.currentLat) && Number.isFinite(data.currentLon) && (
          <Marker position={[data.currentLat, data.currentLon]} icon={arrowIcon} />
        )}
      </MapContainer>
    </div>
  )
}
