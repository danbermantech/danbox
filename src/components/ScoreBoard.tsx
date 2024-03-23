import { GAME_MODE, StoreData } from "$store/types";
import { useSelector } from "react-redux"
import PlayerCard from "./PlayerCard";
import { usePeer } from "$hooks/usePeer";
import QRShare from "./QRShare";
import {bg as bgImage} from '$assets/images.ts'
import MuteToggle from "./MuteToggle";
import { useEffect, useRef } from "react";

const ScoreBoard = () => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const players = useSelector((state:StoreData)=>state.players);
  const activePlayers = useSelector((state:StoreData)=>state.game.activePlayers);
  const gameMode = useSelector((state:StoreData)=>state.game.mode);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
    const x = setInterval(()=>{
    if(scrollRef.current){
      if(scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
        scrollRef.current.scrollTo({top:12, behavior:'smooth'})
      }else{
        scrollRef.current.scrollBy({top: 170, behavior:'smooth'})
      }
      // console.dir(scrollRef.current)
    }}, 4000);
    return ()=>clearInterval(x);
  },[scrollRef])


    return <div className="text-black gap-4 p-0 flex flex-col relative flex-grow p-2 h-full overflow-clip max-h-full rounded-xl bg-cover" style={{ height:'calc(100dvh - 32px)'}}>
      <div className="flex w-full bg-slate-200 left-0 rounded-xl top-0 justify-items-center justify-center  items-center mx-auto">
        <div className="w-32 flex items-center justify-center font-bold">
          <div className="w-24 h-24 aspect-square flex items-center justify-center text-2xl bg-white p-4 rounded-xl bg-opacity-50">
          {myShortId}
          </div>
        </div>
        <div className="flex-col w-min items-center justify-center place-ite">
        <QRShare className="w-24 h-24 left-0 overflow-clip flex-shrink border-none bg-white"/>
        </div>
      {/* </div> */}
      <div className="w-32 h-32 flex items-center justify-center">
        <div className="w-24 h-24 flex items-center justify-center p-4 bg-white bg-opacity-50 rounded-xl">

        <MuteToggle  />
        </div>
      </div>

      </div>
      <div 
        ref={scrollRef} 
        style={{
          background:`url(${bgImage})`, 
          backgroundPosition:'center',
        }} 
      className="scoreboardContainer min-h-full items-start py-4 rounded-xl place-items-center grid grid-cols-3 top-8 bg-transparent gap-1 max-h-full w-full justify-center overflow-auto">
        {[...players].sort((a,b)=>(b.points * 1000) + (b.gold * 0.0001 ) - (a.points * 1000) - (a.gold * 0.0001)).map((player)=>(
          <PlayerCard key={player.id} player={player} showGold={true} showPoints={true} showItems={true} className={`flex-shrink ${activePlayers.includes(player.id) && 'bg-green-400'} ${gameMode == GAME_MODE.MOVEMENT && (player.movesRemaining > 0 ? 'bg-blue-400': 'bg-green-400')} bg-[#88888888] border-black border-2 `} />
        ))}
      </div>
    </div>
}

export default ScoreBoard