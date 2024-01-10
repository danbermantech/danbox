import { useState, useEffect, useRef } from 'react'
import OptionMachine from '../../components/OptionMachine'
import { usePeer } from '../../hooks/usePeer'
import HostStateManager from '../../components/HostStateManager'

const actions = ['give', 'take', 'swap']
const assets = ['points', 'teams', 'items']
const targets = ['bank', 'player1', 'player2', 'player3', 'player4']

type OnDataReceivedPayload =  {payload:{action:string, value:string}}

function Page(): JSX.Element {

  const [state, setState] = useState<Record<string, string>>({});
  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (cb:(value:OnDataReceivedPayload) => void)=>void
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    onDataReceived && onDataReceived(({payload, ...rest}:{ payload: {action:string, value:string}})=>{console.log(payload, rest); if(payload.action == 'event' && payload.value == 'stop') ref.current?.click();})
  },[onDataReceived])

  
  return (
    <div className="container">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <OptionMachine
          ref={ref}
          options={[
            { label: 'action', options: actions },
            {
              label: 'asset',
              options:
                state.action == 'swap'
                  ? assets
                  : ['all points', '1 point', '5 points', '10 points', '20 points']
            },
            { label: 'target', options: targets }
          ]}
          onComplete={(value) => {
            console.log(value)
            setState(value.obj)
          }}
          onChange={(key, value) => {
            setState((prev) => ({ ...prev, [key]: value }))
          }}
          
        />
        <HostStateManager />
      </div>
    </div>
  )
}

export default Page
