import shrimp from '$assets/shrimp.png';
import magicHat from '$assets/magicHat.png';
import { useDispatch, useSelector } from 'react-redux';
import { StoreData } from '$store/types';
import { useEffect } from 'react';
import { clearAllPlayerControls, givePlayerControls, givePlayerGold, givePlayerItem } from '$store/slices/playerSlice';
import { usePeer } from '$hooks/usePeer';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
const items = [
  {
    name: 'shrimp',
    description: 'throw a shrimp at somebody (they will be very confused)',
    price: 10,
    image: shrimp,
    action: (target:string)=>{
      return {target}
    },
    cost: 10
  },
  {
    name: 'magic hat', 
    description: 'get a random item',
    price: 20,
    image: magicHat,
    action: (target:string)=>{
      return {target}
    },
  }
]



const Shop = ()=>{
  
  const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log(activePlayers);
    console.log(items)
    dispatch(givePlayerControls({playerId: activePlayers[0], controls: [{name:'none'},...items].map((item)=>({label: item.name, value: item.name, action: 'buy'}))}))
  }
  ,[activePlayers, dispatch ])

  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
    cb: (
      data: {
        type: string;
        payload: { action: string; value: string, peerId: string };
      },
      peerId: string
    ) => void,
    id:string
  ) => void;

  const player = useSelector((state:StoreData) => state.players.find((player)=>(player.id == activePlayers[0] || player.name == activePlayers[0])));
  const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void

  useEffect(()=>{
    onDataReceived &&
    onDataReceived(
      (data, peerId) => {
        console.log(data, peerId);
        if (data.type == "playerAction"){
          if(data.payload.action == "buy"){
            const item = items.find((item)=>(item.name == data.payload.value));
            console.log(player, item)
            if(data.payload.value == 'none'){
              dispatch(clearAllPlayerControls());
              setTimeout(()=>{
                dispatch(triggerNextQueuedAction());
              }, 2000)
              return;    
            }
            if(!player || !item) return;
            if(player.gold >= item.price){
              console.log('purchasing')
              dispatch(givePlayerItem({playerId: player.id, item: {name: item.name, image: item.image, description: item.description}}))
              dispatch(givePlayerGold({playerId: player.id, gold: -item.price}))
              setTimeout(()=>{
                dispatch(triggerNextQueuedAction());
              }, 2000)
            }
            // dispatch(givePlayerControls({playerId: peerId, controls: []}))
            // dispatch(givePlayerControls({playerId: peerId, controls: [{label: 'SHOP', value: 'shop', action: 'shop'}]}))
          }
        }
      },
      'shop'
    );
    return ()=>{removeOnDataReceivedListener('shop')}
  })
  return (<div className="w-full flex flex-col text-black">
    <h1 className="text-4xl text-center">
      SHOP
    </h1>
    <div className="grid grid-cols-2 gap-2">
    {items.map(item=>{
      return <div key={item.name} className="max-w-48 bg-white p-2 flex flex-col  border-2 border-black">
        <h2 className="text-xl">{item.name}</h2>
        <h3 className="text-md">{item.description}</h3>
        <h3 className="text-md">{`Price: ${item.price}`}</h3>
        <img width={100} height={100} className="mx-auto p-2 items flex-grow" src={item.image} />
        </div>
    })}
    </div>

  </div>)
}

export default Shop;