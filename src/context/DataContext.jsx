import { createContext, useContext } from 'react'
import { useDataStream } from '../utils/useDataStream'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const data = useDataStream()
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}

