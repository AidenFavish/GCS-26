import { VolleyballIcon } from 'lucide-react'
export default function Payloads({ }) {

  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        rowGap: 10,
        padding: '4px 6px',
        width: 100,
        color: 'orange'
      }}>
        <VolleyballIcon size={25} />
        <VolleyballIcon size={25} />
        <VolleyballIcon size={25} />
        
    </header>
  )
}