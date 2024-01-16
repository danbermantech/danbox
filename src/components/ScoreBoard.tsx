import { StoreData } from "$store/types";
import { useSelector } from "react-redux"
import PlayerCard from "./PlayerCard";
import { CopyAllRounded } from "@mui/icons-material";
import { usePeer } from "$hooks/usePeer";
import QRShare from "./QRShare";
import bgImage from '$assets/bg.png'

const ScoreBoard = () => {
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  const players = useSelector((state:StoreData)=>state.players);
    return <div className="text-black flex-grow p-2 h-full overflow-clip max-h-full rounded-xl bg-cover" style={{background:`url(${bgImage})`, backgroundPosition:'center'}}>
      <div className="text-lg py-0 active:animate-pulse bg-[#ffffff88] w-max p-2  rounded-xl" 
      onClick={()=>{
        console.log(myPeerId)
        navigator.clipboard.writeText(myPeerId);
      }}>
        {myPeerId}
      <CopyAllRounded />
      </div>
        <QRShare className="w-32 h-32 left-0 overflow-clip"/>
      <div className="flex flex-wrap  bg-transparent pt-4 gap-2 max-h-full w-full justify-center">
        {players.map((player)=>(
          <PlayerCard player={player} className="flex-shrink bg-[#88888888] border-black border-2 " />
          ))}
      </div>
    </div>
}

export default ScoreBoard