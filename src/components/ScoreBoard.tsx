import { StoreData } from "$store/types";
import { useSelector } from "react-redux"
import PlayerCard from "./PlayerCard";
import { CopyAllRounded } from "@mui/icons-material";
import { usePeer } from "$hooks/usePeer";
import QRShare from "./QRShare";
import bgImage from '$assets/bg.png'
import useAudio from "$hooks/useAudio";
import { VolumeUp } from "@mui/icons-material";

const ScoreBoard = () => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const {initializeAudio} = useAudio();
  const players = useSelector((state:StoreData)=>state.players);
    return <div className="text-black flex-grow p-2 h-full overflow-clip max-h-full rounded-xl bg-cover" style={{background:`url(${bgImage})`, backgroundPosition:'center'}}>
      <div className="flex w-full justify-items-stretch items justify-between">
      <div className="text-lg py-0 active:animate-pulse bg-[#ffffff88] w-max p-2  rounded-xl" 
      onClick={()=>{
        console.log(myShortId)
        navigator.clipboard.writeText(myShortId);
      }}>
        {myShortId}
      <CopyAllRounded />
      </div>
      <button className="flex-shrink" onClick={initializeAudio}><VolumeUp /></button>
      </div>
        <QRShare className="w-32 h-32 left-0 overflow-clip"/>
      <div className="flex flex-wrap  bg-transparent pt-4 gap-2 max-h-full w-full justify-center">
        {players.map((player)=>(
          <PlayerCard player={player} showGold={true} showPoints={true} showItems={true} className="flex-shrink bg-[#88888888] border-black border-2 " />
          ))}
      </div>
    </div>
}

export default ScoreBoard