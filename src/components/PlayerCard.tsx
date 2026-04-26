import { Player } from "$store/types"
import clsx from "clsx"
import {gold, points} from '$assets/images.ts'
const PlayerCard = (
  { 
    player, 
    className, 
    showGold=false, 
    showPoints=false, 
    showItems=false,
    overrideGold,
    overridePoints,
    showExtra 
  }: {
    player:Player, 
    className: string,
    showGold?: boolean, 
    showPoints?: boolean, 
    showItems?: boolean,
    overrideGold?:string,
    overridePoints?:string, 
    showExtra?:string
  }) => {
    if(!player) return null;
    return <div 
      className={clsx("p-2 rounded-2xl flex justify-items-center w-32 min-w-32 max-w-32 justify-center content-center items-center border-black border-4", 'text-4xl text-black w-max text-center flex items-center flex-col font-bold', className)}>
        <h2 className="text-center text-sm whitespace-nowrap text-ellipsis overflow-hidden max-w-32" >
          {player.name.toLocaleUpperCase()}
        </h2>
      <img src={player.image} width="200" height="200" className="w-24 h-24 min-w-24 rounded-full" />
      <div className="flex flex-row gap-3 mt-1">
        {showPoints && <div className="flex items-center gap-1"><img src={points} width="16" height="16" className="w-4 h-4" /><span className="text-sm font-bold">{overridePoints ?? player.points}</span></div>}
        {showGold && <div className="flex items-center gap-1"><img src={gold} width="16" height="16" className="w-4 h-4" /><span className="text-sm font-bold">{overrideGold ?? player.gold}</span></div>}
      </div>
      {showItems && 
        <div className="flex flex-row gap-2 pt-2 items-center">
          {player.items.map((item, index)=>{
            return <img src={item.image} height={36} width={36} key={item.name + index} className="w-8 min-w-8 aspect-square h-8 min-h-8 max-h-8 max-w-8"/>
          })}
        </div>
      }
      {showExtra && <div className="text-sm bg-[#ffffff88] rounded-full">{showExtra}</div>}
      </div>
}

export default PlayerCard