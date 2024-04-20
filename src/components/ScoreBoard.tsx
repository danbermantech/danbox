import { GAME_MODE } from "$store/types";
import PlayerCard from "./PlayerCard";
import { usePeer } from "$hooks/usePeer";
import QRShare from "./QRShare";
import {bg as bgImage} from '$assets/images.ts'
import MuteToggle from "./MuteToggle";
import { useEffect, useRef } from "react";
import { useAppSelector } from "$store/hooks";

const ScoreBoard = () => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const players = useAppSelector((state)=>state.players);
  const activePlayers = useAppSelector((state)=>state.game.activePlayers);
  const gameMode = useAppSelector((state)=>state.game.mode);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRound = useAppSelector((state)=>state.game.currentRound);
  const maxRounds = useAppSelector((state)=>state.game.maxRounds);
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


    return <div className="text-black gap-4 p-0 flex flex-col relative flex-grow h-full overflow-clip max-h-full rounded-xl bg-cover" style={{ height:'calc(100dvh - 32px)'}}>
      <div className="flex w-full bg-slate-200 left-0 rounded-xl top-0 justify-items-center justify-center  items-center mx-auto">
        <div className="w-32 flex items-center justify-center font-titan text-center text-2xl flex-col">
          <div className="w-24 h-24 shadow aspect-square flex items-center justify-center text-2xl bg-white p-4 rounded-xl bg-opacity-50">
          Round <br/>
          {currentRound}/{maxRounds}
          </div>
        </div>
        <div className="w-32 flex items-center justify-center font-bold">
          <div className="w-24 shadow h-24 font-mono flex-col text-4xl aspect-square flex items-center justify-center bg-white p-4 rounded-xl bg-opacity-50">
          <div className="text-sm font-titan ">
            Host ID
          </div>
          <div className="text-xl font-titan font-thin">
          {myShortId}
          </div>
          </div>
        </div>
        <div className="flex-col w-min items-center justify-center">
        <QRShare className="w-24 h-24 shadow left-0 overflow-clip flex-shrink border-none bg-white"/>
        </div>
      {/* </div> */}
      <div className="w-32 h-32 flex items-center justify-center">
        <div className="w-24 h-24 shadow flex items-center justify-center p-4 bg-white bg-opacity-50 rounded-xl">

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