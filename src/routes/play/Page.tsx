// import { useEffect } from 'react'
// import OptionMachine from '../../components/OptionMachine'
import { usePeer } from "../../hooks/usePeer";
import RemoteControl from "../../components/RemoteControl";
import ClientStateManager from "../../components/ClientStateManager";
import { useSelector } from "react-redux";
import type { PlayerAction, StoreData } from "../../store/types";

function Page(): JSX.Element {
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: unknown,
  ) => void;
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  const currentPlayerActions = useSelector(
    (state: StoreData) => {
      const me = state.players.find((player)=>(player.id == myPeerId))
      if(me) return me.controls;
      return []
    },
  ) as PlayerAction[];
  
  return (
    <div className=" p-4 w-full h-[calc(100dvh - 64px)] flex-grow flex ">
      <ClientStateManager />
      <div
      className="flex flex-col min-h-72 gap-2 h-full flex-grow "
      >
        {currentPlayerActions.map((opt) => {
          console.log(opt)
          return (

            <RemoteControl
            key={opt.label}
            onClick={() => {
              console.log("sending message", opt.action, opt.value)
              sendPeersMessage({
                type: "playerAction",
                payload: { playerId: myPeerId, action: opt.action, value: opt.value },
              });
            }}
            value={opt.action}
            label={opt.label}
            />
            )
          })}
          </div>
    </div>
  );
}

export default Page;
