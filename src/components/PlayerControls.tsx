import { usePeer } from "$hooks/usePeer";
import RemoteControl from "$components/RemoteControl";
import type { Player, PlayerActions, StoreData } from "$store/types";
import useMe from "$hooks/useMe";
import { useSelector } from "react-redux";
import FrenzyControls from "$components/FrenzyControls";
import Shrimped from "$components/Shrimped";

function CustomControls({controls}:{controls:PlayerActions}){
  
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: unknown,
  ) => void;
  const {id} = useMe()
  // const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  if(! Array.isArray(controls)) return null  
  return (<>
  {controls.map((opt) => {
    console.log(opt)
    return (
      
      <RemoteControl
      key={opt.value}
      onClick={() => {
        console.log("sending message", opt.action, opt.value)
        sendPeersMessage({
          type: opt.action,
          payload: { playerId: id, action: opt.action, value: opt.value },
        });
      }}
      value={opt.action}
      label={opt.label}
      />
      )
    }
    )}
  </>)
}


function PlayerControls(): JSX.Element {
  const {controls, instructions, effects} = useMe() as Player;
  const mode = useSelector((state:StoreData) => state.game.mode);
  return (
    <div className=" p-4 w-full h-[calc(100dvh - 64px)] flex-grow flex ">
      
      <div
      className="flex flex-col min-h-72 gap-2 h-full flex-grow "
      >
        <h1 className="text-4xl text-center text-white">
          {instructions}
        </h1>
        {
        effects && effects.findIndex((effect)=>effect == 'SHRIMPED') > -1 ? 
        <Shrimped />:
        mode == 'FRENZY' ? <FrenzyControls />:
        <CustomControls controls={controls} />
        }
          </div>
    </div>
  );
}

export default PlayerControls;
