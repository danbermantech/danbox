import { usePeer } from "$hooks/usePeer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shrimp } from "$assets/images";

const Shrimped = () => {
  const [clicks, setClicks] = useState(0);
  const dispatch = useDispatch();
  const myPeerId = usePeer((peer) => peer.myPeerId) as string;
  const sendPeersMessage = usePeer((peer) => peer.sendPeersMessage) as (value: {type: string, payload: {playerId: string, value: string}}) => void;
  useEffect(() => {
    if(clicks > 10){
      sendPeersMessage({type: 'removeEffect', payload: {playerId: myPeerId, value: 'SHRIMPED'}})
      // dispatch(removeEffect({playerId: myPeerId, effect: 'shrimped'}))
    }
  }, [clicks, dispatch, myPeerId, sendPeersMessage])
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center text-white">You are shrimped!</h1>
      <img
        style={{transform: `rotate(${Math.random()*360}deg)`}}
        onClick={()=>{setClicks((prev)=>prev+1)}}
        src={shrimp}
        alt="shrimp"
        className="w-full h-full"
      />
    </div>
  );
}

export default Shrimped;