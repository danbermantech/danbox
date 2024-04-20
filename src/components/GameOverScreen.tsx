import { StoreData } from "$store/types";
import { useDispatch, useSelector } from "react-redux";
import PlayerCard from "./PlayerCard";
import { useMemo } from "react";
import clsx from "clsx";
import restart from "$store/actions/restart";
const GameOverScreen = ()=>{

  const players = useSelector((state:StoreData) => state.players);

  // console.log(players);
  const sortedPlayers = useMemo(()=>([...players].sort((a,b)=>{
    if(a.points == b.points){
      if(a.gold == b.gold){
        return a.name > b.name ? 1 : -1
      }
      return a.gold - b.gold
    }
    return b.points - a.points
  })),[players])
  const dispatch = useDispatch();
  // console.log(sortedPlayers)
  return (
    <div className="flex flex-col justify-items-center place-items-center gap-16">
      <h1 className="text-8xl font-bold uppercase text-black text-center">Game Over</h1>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        {sortedPlayers.map((player, index)=>(
          <div key={player.id} className="flex flex-col items-center gap-4 justify-center">
            <div className="text-8xl font-extrabold text-black text-center">{index+1}</div>
            <PlayerCard player={player} showGold={true} showPoints={true} className={clsx("flex-shrink", index == 0 ? "bg-green-200 border-green-400" : "bg-slate-200 border-slate-400",)} />
          </div>
        ))}
      </div>
      <button onClick={()=>{
        dispatch(restart())
      }} className=" bg-gray-200 rounded-2xl w-min p-4 text-4xl text-black font-bold bg-gradient-radial from-gray-200 to-gray-400">Restart</button>
    </div>
  )
}

export default GameOverScreen