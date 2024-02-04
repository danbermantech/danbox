import { usePeer } from "$hooks/usePeer";
import RemoteControl from "$components/RemoteControl";
import type { Player, StoreData } from "$store/types";
import useMe from "$hooks/useMe";
import { useSelector } from "react-redux";
import FrenzyControls from "$components/FrenzyControls";
import Shrimped from "$components/Shrimped";

function PlayerControls(): JSX.Element {
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: unknown,
  ) => void;
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  const {controls, instructions, effects} = useMe() as Player;
  console.log(effects)
  const modalContent = useSelector((state:StoreData) => state.game.modalContent);
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
        modalContent == 'FRENZY' ? <FrenzyControls />:
        controls.map((opt) => {
          console.log(opt)
          return (
            
            <RemoteControl
            key={opt.value}
            onClick={() => {
              console.log("sending message", opt.action, opt.value)
              sendPeersMessage({
                type: opt.action,
                payload: { playerId: myPeerId, action: opt.action, value: opt.value },
              });
            }}
            value={opt.action}
            label={opt.label}
            />
            )
          })
        }
          </div>
    </div>
  );
}

export default PlayerControls;
