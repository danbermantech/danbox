import { StoreData } from "$store/types";
import { useSelector } from "react-redux";
import { usePeer } from "./usePeer";
import playerPlaceholder from '$assets/sprites/playerPlaceholder.png';
function useMe(){
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  console.log(myPeerId)
  const me = useSelector((state:StoreData)=>state.players.find((player)=>player.id == myPeerId));
  return me ?? {controls:[], items:[], image:playerPlaceholder,name:''};
}

export default useMe