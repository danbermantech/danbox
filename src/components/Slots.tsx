import OptionMachine from "./OptionMachine";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Player, StoreData } from "$store/types";
import { handleTransfer } from "$store/slices/playerSlice";
import { endMinigame } from "$store/slices/gameProgressSlice";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import {stormy, rhiannon} from '$assets/images.ts'
import useAudio from "$hooks/useAudio";

const Slots = () => {
  const [state, setState] = useState<Record<string, string>>({});

  const players = useSelector((state:StoreData) => state.players);
  console.log(players);

  console.log(state);
const dispatch = useDispatch();
const activePlayerName = useSelector((state:StoreData) => state.game.activePlayers[0]);
const activePlayer = useSelector((state:StoreData) => state.players.find((player)=>(player.name == activePlayerName || player.id == activePlayerName))) as Player;
const {triggerSoundEffect} = useAudio();

const [complete, setComplete] = useState(false);

useEffect(()=>{
  if(complete) return triggerSoundEffect(`chaching`);
  return triggerSoundEffect('gamble');
},[triggerSoundEffect, complete])

return (
  <div className="w-full h-full flex flex-col items-center justify-items-center justify-center" style={{backgroundImage: `url(${activePlayer.spaceId == 'rhiannon' ? rhiannon : stormy})`, backgroundSize:'cover', backgroundPosition:'center'}}>
    
    <h1 className="text-black text-center text-8xl font-extrabold">GAMBLE</h1>
    <div className="text-4xl text-black w-full text-center flex items-center flex-col font-bold mb-4">
      <div className="bg-white p-4 rounded-2xl border-black border-4">
      <h2>
        {activePlayer.name.toLocaleUpperCase()}
      </h2>
      <img src={activePlayer.image} width="400" height="400" className="w-32 h-32 rounded-full" />
      </div>
    </div>
    <div className="flex flex-row gap-4" >
    <OptionMachine
      options={[
        { label: "type", options: ['give', 'take', 'swap'] },
        {
          label: "asset",
          options:
            state.type == "swap"
              ? ["points", "teams", "items"]
              : [
                  "all points",
                  "1 point",
                  "5 points",
                  "10 points",
                  "20 points",
                  "all gold",
                  "1 gold",
                  "5 gold",
                  "10 gold",
                  "20 gold",
                  "1 item",
                  "all items"
                ],
        },
        { label: "target", options: players.filter((player)=>player.id !== activePlayerName && player.name !== activePlayerName).map((player) => player.name) },
      ]}
      onComplete={(value) => {
        setComplete(true);
        console.log(value);
        setState(value.obj);
        console.log({from: activePlayerName, ...value.obj})
        setTimeout(()=>{
          dispatch(endMinigame());
          dispatch(handleTransfer({from: activePlayerName, ...value.obj}))
          setTimeout(()=>{
            dispatch(triggerNextQueuedAction());
          }, 1000)
          // onComplete(value);
        }, 2000)
      }}
      onChange={(key, value) => {
        triggerSoundEffect(`dink`);
        setState((prev) => ({ ...prev, [key]: value }));
      }}
      forPlayer={activePlayerName}
    />
    </div>
  </div>)
}

export default Slots