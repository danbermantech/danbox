import { useEffect } from 'react';
import { useSelector} from 'react-redux'
import { usePeer } from '../hooks/usePeer';


const HostStateManager = () =>{
  const state = useSelector((state)=>state);
  const sendPeersMessage = usePeer((cv)=>cv.sendPeersMessage) as (sendPeersMessage:typeof state)=>void;
  const setOnConnectSendValue = usePeer((cv)=>cv.setOnConnectSendValue) as (value: unknown)=>void;
  const peerReady = usePeer((cv)=>cv.peerReady) as boolean;
  useEffect(()=>{
    if(!peerReady) return;
    console.log('sending state', state)
    // console.log(state);
    setOnConnectSendValue && setOnConnectSendValue(state)
    sendPeersMessage && sendPeersMessage({type: 'state', paylaod:{value:state}});
  },[state, sendPeersMessage, setOnConnectSendValue, peerReady])

  return (
    <div>
      <h1>HostStateManager</h1>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )

}

export default HostStateManager;