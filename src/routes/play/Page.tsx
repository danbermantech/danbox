// import { useEffect } from 'react'
// import OptionMachine from '../../components/OptionMachine'
import { usePeer } from '../../hooks/usePeer'
import RemoteControl from '../../components/RemoteControl'
import ClientStateManager from '../../components/CliuentStateManager'
import {useSelector} from 'react-redux'
import { PlayerAction } from '../../store/slices/gameProgressSlice'
// const actions = ['give', 'take', 'swap']
// const assets = ['points', 'teams', 'items']
// const targets = ['bank', 'player1', 'player2', 'player3', 'player4']

// type RemoteOption = {label:string, action:string, value:string}



function Page(): JSX.Element {
  // const [state, setState] = useState<Record<string, string>>({})
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (value: unknown) => void
  // const onDataReceived = usePeer((cv) => cv.onDataReceived) as (cb:(value: {type:string, action:string, payload:{value:RemoteOption[]}}) => void)=>void
  const currentPlayerActions = useSelector((state)=>state.game.currentPlayerActions ?? []) as PlayerAction[]
  // console.log(state)

  // const [options, setOptions] = useState<RemoteOption[]>([])

  // useEffect(()=>{
  //   // onDataReceived && onDataReceived((data:{type:string, payload:{value:RemoteOption[]}})=>{console.log(data); if(data.type == 'state') setOptions(data.payload.gameProgress.currentlayerActions ?? [])})
  // },[onDataReceived])

  return (
    <div className="container" style={{width:'100%'}}>
      <ClientStateManager />
      {/* <h1>This is what the player will see</h1> */}
      <div style={{ display: 'grid', gridAutoFlow:'row', width:'100%', gap: '8px',   }}>
        {currentPlayerActions.map((opt)=>(<RemoteControl key={opt.label} onClick={()=>{sendPeersMessage({payload:{action:opt.action, value:opt.value}})}} value={opt.action} label={opt.label}/>))}
      </div>
    </div>
  )
}

export default Page
