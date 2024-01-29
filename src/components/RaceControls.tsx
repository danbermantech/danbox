import { usePeer } from "$hooks/usePeer"
import { useEffect, useState } from "react";
import Fader from "./Fader";

const RaceControls = () => {
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: {type: string, payload: {playerId: string, action: string, value: {targetVelocity: number, angle: number}}},
  ) => void;

  const myPeerId = usePeer((cv) => cv.myPeerId) as string;

  const [targetVelocity, setTargetVelocity] = useState(0);
  const [angle, setAngle] = useState(0);
  
  useEffect(()=>{
    sendPeersMessage({type:'RACE'+myPeerId, payload: {playerId: myPeerId, action: 'RACE'+myPeerId, value: {targetVelocity, angle}}})
  },[targetVelocity, angle, sendPeersMessage, myPeerId])

  return(
    <div className="h-full grid grid-cols-2">
      <Fader min={0} max={10} value={targetVelocity} onChange={setTargetVelocity} faderDirection="up" faderOffBehavior="snapMin" />
      <Fader min={-0.25} max={0.25} value={angle} onChange={setAngle} faderDirection="horizontalCenter" faderOffBehavior="snapCenter"/>
    </div>
  )

}

export default RaceControls