import { useDispatch, useSelector } from 'react-redux';
import { AssetDefinition, Player, StoreData } from '$store/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setPlayerControls, givePlayerGold, givePlayerPoints, setPlayerInstructions } from '$store/slices/playerSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import {gold, points} from '$assets/images.ts';
import useAudio from '$hooks/useAudio';
import usePeerDataReceived, { PeerDataCallbackPayload } from '$hooks/useDataReceived';
import {v4 as uuidv4} from 'uuid'
import PlayerCard from './PlayerCard';
import { endMinigame } from '$store/slices/gameProgressSlice';

const options:AssetDefinition[] = [
  {
    name: 'Get 5 gold',
    value: 5,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: 5})
    },
    weight:10
  },
  {
    name: 'Get 10 gold',
    value: 10,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: 10})
    },
    weight: 5
  },
  {
    name: 'Get 50 gold',
    value: 50,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: 50})
    },
    weight: 1
  },
  {
    name: 'Get 5 points',
    value: 5,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: 5})
    },
    weight:10
  },
  {
    name: 'Get 10 points',
    value: 10,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: 10})
    },
    weight:5
  },
  {
    name: 'Get 50 points',
    value: 50,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: 50})
    },
    weight:1
  },
]

function createOptions(options: AssetDefinition[], count: number = 3) {
  const weightedOptions = options
    .map((option) =>
      Array(option.weight).fill(0).map(() => ({ ...option, id: uuidv4() }))
    )
    .flat();

  return weightedOptions.sort(() => Math.random() - 0.5).slice(0, count);
}

const GetAssetScreen = ()=>{
  
  const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);
  const dispatch = useDispatch();
  const filteredOptions = useMemo(()=>(createOptions(options, 3)),[])
  const [actionId] = useState(()=>uuidv4())
  useEffect(()=>{
    console.log(activePlayers);
    dispatch(setPlayerInstructions({playerId: activePlayers[0], instructions: 'Select your prize'}));
    dispatch(setPlayerControls({playerId: activePlayers[0], controls: filteredOptions.map((item)=>({label: item.name, value: item.id, action: actionId}))}))
  }
  ,[activePlayers, dispatch, filteredOptions, actionId ])

  const [selectedOption, setSelectedOption] = useState<AssetDefinition>();

  const player = useSelector((state:StoreData) => state.players.find((player)=>(player.id == activePlayers[0] || player.name == activePlayers[0]))) as Player;

  const {triggerSoundEffect} = useAudio();

  useEffect(()=>{return triggerSoundEffect('glad')},[triggerSoundEffect])
  const peerDataCallback = useCallback((data:PeerDataCallbackPayload) => {
    if(data.payload.action){
      dispatch(setPlayerInstructions({playerId: activePlayers[0], instructions: 'Please wait...'}));
      dispatch(setPlayerControls({playerId: activePlayers[0], controls:[]}) )
      setSelectedOption(
        filteredOptions.find((option)=>(option.id == data.payload.value))
      );
      const option = filteredOptions.find((option)=>(option.id == data.payload.value));
      if(!player || !option) return;
      dispatch(option.action(player.id))
      triggerSoundEffect('victory')
      const timeout = setTimeout(()=>{
        dispatch(endMinigame());
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        }, 500)
      }, 2000)
      return ()=>{clearTimeout(timeout)}
    }
  },[dispatch, filteredOptions, player, activePlayers, triggerSoundEffect])

  usePeerDataReceived(peerDataCallback, actionId)

  return (<div className="w-full flex flex-col gap-8 text-black items-center ">
    <h1 className="animate-jump-in animate-ease-linear text-8xl text-center bg-gradient-radial from-white w-min p-8 rounded-full aspect-square flex items-center">
    😊
    </h1>
    <div className="animate-jump-in animate-ease-linear animate-delay-500 text-center text-6xl font-bold">
      Select your prize
    </div>    
    <div className='animate-jump-in animate-ease-linear animate-delay-1000 flex flex-row items-center justify-center  p-2'>
    <PlayerCard player={player} className='bg-gradient-radial from-green-200 to-green-400'/>
    </div>
    {selectedOption ? 
      <div className="grid grid-cols-1 justify-items-center gap-2 p-4">
        <div key={selectedOption.name} className="max-w-48 bg-green-200 rounded-xl border-green-400  p-2 flex flex-col border-2">
          <h2 className="text-xl font-bold uppercase">{selectedOption.name}</h2>
          <img width={100} height={100} className=" mx-auto p-2 items flex-grow" src={selectedOption.image} />
        </div>
      </div>
      :
      <div className="animate-jump-in animate-ease-linear animate-delay-1500 grid grid-cols-3 justify-items-center gap-2 p-2 pt-12">
      {filteredOptions.map((option, index)=>{
        console.log(filteredOptions)
        return <div key={option.id} data-index={index} className={"max-w-48 first:animate-delay-100 animate-delay-200 last:animate-delay-300 animate-fill-backwards animate-bounce bg-gradient-radial from-green-200 to-green-400 p-2 flex rounded-xl flex-col  border-2 border-black"}>
          <h2 className="text-xl font-bold uppercase">{option.name}</h2>
          <img width={100} height={100} className="animate-wiggle-more animate-duration-500 animate-infinite mx-auto p-2 items flex-grow" src={option.image} />
          </div>
      })}
      </div>
    }
  </div>)
}

export default GetAssetScreen;