import { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import useMe from "$hooks/useMe"
import { usePeer } from "$hooks/usePeer";

const PlayerItemControls = ()=>{
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (message:PeerDataCallbackPayload<{playerId:string, action:string, value:string }>)=>void;
  const me = useMe();
  return (<div className="flex-shrink bottom-0 w-full bg-blue-600 h-32 flex items-center place-content-center gap-4">
      {me?.items.map(item=>{
        return (
        <div className="text-xl font-bold text-black border-black border-2 bg-white rounded-xl p-4 flex flex-col items-center justify-center place-content-stretch"
        onClick={()=>{
          sendPeersMessage({
            type: 'activateItem', 
            payload: {
              playerId: me.id, 
              action:'activateItem', 
              value: item.name
            }
          })
        }} >
          <img 
          src={item.image} 
          height={48} 
          width={48} 
          />
          {item.name}
        </div>
      )})}
      </div>)
}

export default PlayerItemControls