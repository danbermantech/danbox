import { usePeer } from "$hooks/usePeer"
import { useEffect, useState } from "react";
import Fader from "./Fader";

const FrenzyControls = () => {
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: {type: string, payload: {playerId: string, action: string, value: {targetVelocity: number, angle: number}}},
  ) => void;

  const myPeerId = usePeer((cv) => cv.myPeerId) as string;

  const [targetVelocity, setTargetVelocity] = useState(0);
  const [angle, setAngle] = useState(0);
  
  useEffect(()=>{
    sendPeersMessage({type:'FRENZY'+myPeerId, payload: {playerId: myPeerId, action: 'FRENZY'+myPeerId, value: {targetVelocity, angle}}})
  },[targetVelocity, angle, sendPeersMessage, myPeerId])

  return(
    <div className="h-full w-full flex justify-center place-items-center justify-items-center">
      <div className="w-1/3 h-full">
      <Fader min={0} max={0.02} value={targetVelocity} onChange={setTargetVelocity} faderDirection="up" faderOffBehavior="snapMin" />
      </div>
      <div className="w-2/3 h-1/2 p-2 flex items-center">
      <Fader min={-0.25} max={0.25} value={angle} onChange={setAngle} faderDirection="horizontalCenter" faderOffBehavior="snapCenter"/>
      </div>
    </div>
  )

}

export default FrenzyControls