import { VolleyballIcon, MilkIcon } from 'lucide-react'
import { useData } from '../context/DataContext'
export default function Payloads({ }) {
  const data = useData()
  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        rowGap: 10,
        padding: '4px 6px',
        width: 100,
      }}>
        <VolleyballIcon size={25} style={{color: data.beaconDropped ? '#5f5f5fff' : '#e8b210ff'}}/>
        <MilkIcon size={25} style={{color: data.bottleDropped ? '#5f5f5fff' : '#3f63e9ff'}}/>
        
    </header>
  )
}