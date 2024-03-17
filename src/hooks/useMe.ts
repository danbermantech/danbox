import { StoreData } from "$store/types";
import { useSelector } from "react-redux";
import { usePeer } from "./usePeer";
import {playerPlaceholder} from '$assets/images'
function useMe(){
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  console.log(myPeerId)
  const me = useSelector((state:StoreData)=>state.players.find((player)=>player.id == myPeerId));
  return me ?? {controls:[], items:[], image:playerPlaceholder,name:'', id: '', points: 0, gold: 0, teamId: '', history: [], spaceId: '', previousSpaceId: '', hasMoved: false, movesRemaining: 0, movesPerRound:0, instructions: ''};
}

export default useMe