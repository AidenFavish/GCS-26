import { createContext, useContext } from 'react'
import { useDataStream } from '../utils/useDataStream'
import { useBackendTelemetry } from '../utils/useBackendTelemetry'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const useBackend = true;  // Go to useBackendTelemetry to change port
  const data = useBackend ? useBackendTelemetry() : useDataStream()
  if (useBackend && (data == null || data.timestamp == null)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
        Connecting to telemetry…
      </div>
    )
  }
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}
