import { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import useMe from "$hooks/useMe"
import { usePeer } from "$hooks/usePeer";
import { useMemo, useState } from "react";
import itemPlaceholder from '$assets/sprites/itemPlaceholder.png'
import { Item } from "$store/types";
import { Modal } from "@mui/material";
import { useAppSelector } from "$store/hooks";
import PlayerCard from "./PlayerCard";

const ItemControl = ({item}:{item:Item})=>{
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (message:PeerDataCallbackPayload<{playerId:string, target:string, action:string, value:string}>)=>void;
  const me = useMe();
  const players = useAppSelector((state) => state.players);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button 
      disabled={item.name.length == 0} 
      className="text-xl font-bold text-black border-black border-2 bg-white rounded-xl p-4 flex flex-col items-center justify-center place-content-stretch"
      onClick={()=>{
        setModalOpen(true);
      }} >
        <img 
        src={item.image} 
        height={48} 
        width={48} 
        />
        
        {item.name}
      </button>
      <Modal open={modalOpen} className=" flex w-full h-full min-w-full min-h-full" onClose={()=>setModalOpen(false)}>
          <div className="mx-auto min-w-max max-w-full my-auto p-4 bg-white w-min flex flex-col">
          <h1 className="text-3xl p-2 text-center text-black">Select your target</h1>
          <div className="flex flex-row flex-wrap gap-2 p-4">
          {
            players.map(player=>(
              <button key={player.id} onClick={()=>{
                sendPeersMessage({
                  type: 'activateItem', 
                  payload: {
                    playerId: me.id,
                    target: player.id, 
                    action: 'activateItem', 
                    value: item.name
                  }
                })
                setModalOpen(false);
              }}>
              <PlayerCard player={player} className=""/>
              </button>
            ))
          }
          </div>
        </div>
      </Modal>
    </>
  )
}

const PlayerItemControls = ()=>{
  const me = useMe();
  const items = useMemo(()=>{
    if(!me?.items) return Array(3).fill({name: '', image: itemPlaceholder})
    const temp = [...me.items];
    while(temp.length < 3){
      temp.push({name: '', image: itemPlaceholder, id: `empty-${temp.length}`, description: '', price:0, action:()=>({type: 'empty', payload: {value: 'empty', target:'', user:'', action: 'empty'}}), weight:1})
    }
    return temp
  },[me?.items])
  return (<div className="flex-shrink bottom-0 w-full bg-blue-600 h-32 flex items-center place-content-center gap-4">
      {items.map(item=>{
        return (
        <ItemControl item={item} />
      )})}
      </div>)
}

export default PlayerItemControls