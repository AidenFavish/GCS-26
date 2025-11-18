import { VolleyballIcon, MilkIcon } from 'lucide-react'
export default function Payloads({ }) {

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
        <VolleyballIcon size={25} style={{color: 'orange'}}/>
        <MilkIcon size={25} style={{color: '#387effff'}}/>
        
    </header>
  )
}