import { usePeer } from "$hooks/usePeer"
import { useEffect, useState } from "react";

const RaceControls = () => {
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: {type: 'RACE', payload: {playerId: string, action: string, value: {targetVelocity: number, angle: number}}},
  ) => void;

  const myPeerId = usePeer((cv) => cv.myPeerId) as string;

  const [targetVelocity, setTargetVelocity] = useState(0);
  const [angle, setAngle] = useState(0);
  
  useEffect(()=>{
    sendPeersMessage({type:'RACE'+myPeerId, payload: {playerId: myPeerId, action: 'RACE'+myPeerId, value: {targetVelocity, angle}}})
  },[targetVelocity, angle, sendPeersMessage, myPeerId])

  return(
    <div>
      <input type="range" min="0" max="10" value={targetVelocity} onChange={(e)=>setTargetVelocity(Number(e.target.value))} onPointerUp={()=>{setTargetVelocity(0)}} />
      <input type="range" min="-0.25" max="0.25" step={0.01} value={angle} onChange={(e)=>setAngle(Number(e.target.value))} onPointerUp={()=>{setAngle(0)}} />
    </div>
  )

}

export default RaceControls