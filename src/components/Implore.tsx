import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { useAppDispatch, useAppSelector } from "$store/hooks";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { clearAllPlayerControls, setPlayerControls, setPlayerInstructions } from "$store/slices/playerSlice";
import usePeerDataReceived from "$hooks/useDataReceived";
export default function Implore() {
  const dispatch = useAppDispatch();
  const activePlayerName = useAppSelector((state) => state.game.activePlayers[0]);
  const activePlayer = useAppSelector((state) => state.players.find((player)=>(player.name == activePlayerName || player.id == activePlayerName)));
  useEffect(()=>{
    if(!activePlayer) {
      dispatch(triggerNextQueuedAction());
      return;
    }
    dispatch((disp)=>{
      disp(setPlayerInstructions({playerId: activePlayer.id, instructions: 'Did you get what you wanted?'}))
      disp(setPlayerControls({playerId: activePlayer.id, controls: [{label:'Yes', value:'yes', classNames: 'bg-green-200', action:'implore',}, {label:'No', value:'no', action:'implore',}]}))
  })
  },[activePlayer, dispatch])

  const [result, setResult] = useState<string>();
  usePeerDataReceived<{value: string}>((data)=>{
    // if(data.payload.value === 'yes'){
      setResult(data.payload.value);
      dispatch(clearAllPlayerControls());
      setTimeout(()=>{
        dispatch(triggerNextQueuedAction());
      }, 3000);
  }, 'implore');
  
  if(!activePlayer) return null;

  if(result == 'yes'){
    return (
      <div className="text-xl text-black gap-2 flex flex-col items-center bg-gradient-radial from-fucsia-200 border-black border-4  p-8 rounded-2xl">
      <h1 className="text-8xl font-bold p-8">IMPLORE</h1>
        <PlayerCard player={activePlayer} className="bg-green-200"/>
        <div className="text-4xl">Congratulations! I'm so happy for you!</div>
      </div>
    );
  }

  if(result == 'no'){
    return (
      <div className="text-xl text-black gap-2 flex flex-col items-center bg-gradient-radial from-fucsia-200 border-black border-4  p-8 rounded-2xl">
      <h1 className="text-8xl font-bold p-8">IMPLORE</h1>
        <PlayerCard player={activePlayer} className="bg-green-200"/>
        <div className="text-4xl">Oof, what a bummer. Maybe try asking more politely next time?</div>
      </div>
    );
  }

  return (
    <div className="text-xl text-black gap-2 flex flex-col items-center bg-gradient-radial from-fucsia-200 border-black border-4  p-8 rounded-2xl">
    <h1 className="text-8xl font-bold p-8">IMPLORE</h1>
      <PlayerCard player={activePlayer} className="bg-green-200"/>
        <h2 className="text-4xl">Implore Dan to help you in the game</h2>
      <div className="flex flex-col bg-yellow-100 border-black border-4 gap-2 p-4 rounded-xl">
        <h2 className="text-2xl">Not sure what to ask for? Here's some suggestions</h2>
        <ul className="pl-4">
          <li className="list-disc list-inside">Ask for points, gold, or an item</li>
          <li className="list-disc list-inside">Ask to move somewhere</li>
          <li className="list-disc list-inside">Ask to punish someone</li>
        </ul>
        <div>Whatever you ask for, remember to ask nicely!</div>
      </div>
    </div>
  );
}