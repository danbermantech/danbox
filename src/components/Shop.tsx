import shrimp from '$assets/shrimp.png';
import magicHat from '$assets/magicHat.png';
import { useDispatch, useSelector } from 'react-redux';
import type { StoreData, Item, ItemDefinition } from '$store/types';
import { useCallback, useEffect, useState } from 'react';
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerItem } from '$store/slices/playerSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import useAudio from '$hooks/useAudio';
import usePeerDataReceived, { PeerDataCallbackPayload } from '$hooks/useDataReceived';
import {v4 as uuidv4} from 'uuid'
import activateItem from '$store/actions/activateItem';
import itemPlaceholder from '$assets/sprites/itemPlaceholder.png';
import gold from "$assets/sprites/gold.png";
import { endMinigame } from '$store/slices/gameProgressSlice';


const items:ItemDefinition[] = [
  {
    name: 'shrimp',
    description: 'throw a shrimp at somebody (they will be very confused)',
    price: 10,
    image: shrimp,
    action: ({user, target}:{user:string, target:string, value?:unknown}) => {
      return activateItem({ user, target, item: 'shrimp' });
    },
    cost: 10,
    weight: 5,
  },
  {
    name: 'magic hat', 
    description: 'Swap places with somebody',
    price: 20,
    image: magicHat,
    action: ({user, target}:{user:string, target:string, value?:unknown}) => {
      return activateItem({ user, target, item: 'magic hat'});
    },
    weight: 1,
  }
]

function createOptions(options: ItemDefinition[], count: number = 3) {
  const weightedOptions = options
    .map((option) =>
      Array(option.weight).fill(0).map(() => ({ ...option, id: uuidv4() }))
    )
    .flat();

  return weightedOptions.sort(() => Math.random() - 0.5).slice(0, count);
}

const Shop = ()=>{
  
  const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);
  const dispatch = useDispatch();
  const {triggerSoundEffect} = useAudio();
  const [actionId] = useState(()=>uuidv4());

  const [options] = useState<Item[]>(createOptions(items, 3));

  useEffect(()=>{
    console.log(activePlayers);
    console.log(items)
    dispatch(setPlayerControls({playerId: activePlayers[0], controls: [{name:'none', id: 'none'},...options].map((item)=>({label: item.name, value: item.id, action: actionId}))}))
  }
  ,[activePlayers, dispatch, actionId, options])

  const player = useSelector((state:StoreData) => state.players.find((player)=>(player.id == activePlayers[0] || player.name == activePlayers[0])));

  const [selectedOption, setSelectedOption] = useState<Item>();


  const dataReceivedCallback = useCallback((data: PeerDataCallbackPayload, peerId:string) => {
    console.log(data, peerId);
    const item = options.find((item)=>(item.id == data.payload.value));
    console.log(player, item)
    if(data.payload.value == 'none'){
      setSelectedOption({name: 'Nothing', id:'nothing', description: 'You bought nothing. Maybe next time', price: 0, image: itemPlaceholder, weight: 1, action: ()=>{return{type:'null', payload:{target:'', user: '', value: ''}};}})
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
      setSelectedOption(item);
      triggerSoundEffect('victory4')
      setTimeout(()=>{
        dispatch(endMinigame());
      }, 2000)
      setTimeout(()=>{
        dispatch(triggerNextQueuedAction());
      }, 3000)
    }
  }, [dispatch, player, triggerSoundEffect, options])

  usePeerDataReceived(dataReceivedCallback,actionId);

  return (<div className="w-full flex flex-col text-black gap-36">
    <h1 className="text-8xl font-bold text-center">
      SHOP
    </h1>
    {selectedOption ? 
      <div key={selectedOption.name} className="max-w-48 mx-auto font-bold rounded-xl bg-green-200 p-2 flex flex-col border-2 border-green-400">
        <h2 className="text-4xl uppercase text-center">{selectedOption.name}</h2>
        <h3 className="text-md">{selectedOption.description}</h3>
        <h3 className="text-md">{`Price: ${selectedOption.price}`}</h3>
        <img width={100} height={100} className="mx-auto p-2 items flex-grow" src={selectedOption.image} />
      </div> 
    : 
    <div className="grid grid-cols-3 gap-2 place-items-center">
    {options.map(item=>{
      return <div key={item.id} className="aspect-square max-w-64 gap-2 font-bold bg-white p-2 flex flex-col  border-2 border-black rounded-xl bg-gradient-radial from-sky-200 to-sky-400">
        <h2 className="text-4xl uppercase text-center">{item.name}</h2>
        <h3 className="text-xl flex place-items-center justify-center"><img width="32" height="32" src={gold} />{item.price}</h3>
        <h3 className="text-xl">{item.description}</h3>
        <img width={100} height={100} className="mx-auto p-2 items flex-grow" src={item.image} />
        </div>
    })}
    </div>
    }
  </div>)
}

export default Shop;