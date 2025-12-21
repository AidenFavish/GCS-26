import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { useTileCache } from '../context/TileCacheContext'

const MAP_VIEW_COOKIE = 'gcs-map-view'
const MAP_VIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function readMapViewCookie() {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${MAP_VIEW_COOKIE}=`))
  if (!cookie) return null
  const rawValue = cookie.split('=').slice(1).join('=')
  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue))
    if (!parsed || !Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lng) || !Number.isFinite(parsed.zoom)) {
      return null
    }
    return { lat: parsed.lat, lng: parsed.lng, zoom: parsed.zoom }
  } catch {
    return null
  }
}

function writeMapViewCookie({ lat, lng, zoom }) {
  if (typeof document === 'undefined') return
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(zoom)) return
  const payload = encodeURIComponent(JSON.stringify({ lat, lng, zoom }))
  document.cookie = `${MAP_VIEW_COOKIE}=${payload}; Max-Age=${MAP_VIEW_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}

function AutoCenter({ waypoints, fallback, enabled = true }) {
  const map = useMap()
  React.useEffect(() => {
    if (!enabled) return
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
  }, [map, waypoints, fallback, enabled])
  return null
}

function PersistMapView() {
  const map = useMap()
  React.useEffect(() => {
    if (!map) return
    const saveView = () => {
      const center = map.getCenter()
      writeMapViewCookie({ lat: center.lat, lng: center.lng, zoom: map.getZoom() })
    }
    map.on('moveend', saveView)
    map.on('zoomend', saveView)
    map.whenReady(saveView)
    return () => {
      map.off('moveend', saveView)
      map.off('zoomend', saveView)
    }
  }, [map])
  return null
}

function SpacebarFocus({ target, zoom }) {
  const map = useMap()
  const targetRef = React.useRef(null)
  const zoomRef = React.useRef(zoom)

  React.useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  React.useEffect(() => {
    const hasTarget = Array.isArray(target) && target.length === 2 && Number.isFinite(target[0]) && Number.isFinite(target[1])
    targetRef.current = hasTarget ? target : null
  }, [target])

  React.useEffect(() => {
    if (!map) return

    function isTypingInInput(element) {
      if (!element) return false
      if (element.isContentEditable) return true
      const tag = element.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
    }

    function handleKeyDown(event) {
      if (event.defaultPrevented) return
      if (event.code !== 'Space' && event.key !== ' ') return
      if (isTypingInInput(document.activeElement)) return
      const targetPosition = targetRef.current
      if (!targetPosition) return
      event.preventDefault()
      map.setView(targetPosition, zoomRef.current, { animate: true })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [map])
  return null
}

const WP_RADIUS_M = 75  // The waypoint radius in meters
const TARGET_FOCUS_ZOOM = 14

export default function MapView({ waypoints, geofence = [] }) {
  const data = useData()
  const { captureEnabled, offlineOnly } = useTileCache()
  const savedView = useMemo(() => readMapViewCookie(), [])
  const center = useMemo(() => {
    return waypoints.length > 0 ? [waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lon] : [37.7749, -122.4194]
  }, [waypoints])
  const initialCenter = savedView ? [savedView.lat, savedView.lng] : center
  const initialZoom = savedView ? savedView.zoom : 6

  const targetPosition = useMemo(() => {
    if (waypoints.length > 0) {
      const wp = waypoints[waypoints.length - 1]
      return [wp.lat, wp.lon]
    }
    if (Number.isFinite(data.currentLat) && Number.isFinite(data.currentLon)) {
      return [data.currentLat, data.currentLon]
    }
    return null
  }, [waypoints, data.currentLat, data.currentLon])

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

  const mapHeight = 'calc(100vh - var(--top-bar-height) - var(--bottom-bar-height))'

  return (
    <div style={{ width: '100%', flex: 1, minHeight: 0, height: mapHeight }}>
      <MapContainer center={initialCenter} zoom={initialZoom} keyboard={false} style={{ height: '100%', width: '100%', outline: 'none' }}>
        <TileLayer url={tileUrl} attribution="&copy; OpenStreetMap contributors" />
        <PersistMapView />
        <AutoCenter waypoints={waypoints} fallback={center} enabled={!savedView} />
        <SpacebarFocus target={targetPosition} zoom={TARGET_FOCUS_ZOOM} />
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
