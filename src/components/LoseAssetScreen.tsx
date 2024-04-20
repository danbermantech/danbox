import { useDispatch, useSelector } from 'react-redux';
import { AssetDefinition, Player, StoreData } from '$store/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setPlayerControls, givePlayerGold, givePlayerPoints } from '$store/slices/playerSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import {gold, points} from '$assets/images.ts';
import usePeerDataReceived, { PeerDataCallbackPayload } from '$hooks/useDataReceived';
import useAudio from '$hooks/useAudio';
import {v4 as uuidv4} from 'uuid'
import { endMinigame } from '$store/slices/gameProgressSlice';
import PlayerCard from './PlayerCard';

const options:AssetDefinition[] = [
  {
    name: 'Lose 5 gold',
    value: 5,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: -5})
    },
    weight: 1
  },
  {
    name: 'Lose 10 gold',
    value: 10,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: -10})
    },
    weight: 5
  },
  {
    name: 'Lose 50 gold',
    value: 50,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{
      return givePlayerGold({playerId: target, gold: -50})
    },
    weight: 10
  },
  {
    name: 'Lose 5 points',
    value: 5,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: -5})
    },
    weight:1
  },
  {
    name: 'Lose 10 points',
    value: 10,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: -10})
    },
    weight:5
  },
  {
    name: 'Lose 50 points',
    value: 50,
    asset: 'points',
    image: points,
    action: (target:string)=>{
      return givePlayerPoints({playerId: target, points: -50})
    },
    weight: 5
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

const LoseAssetScreen = ()=>{
  
  const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);
  const dispatch = useDispatch();
  
  const [actionId] = useState(()=>uuidv4())

  const filteredOptions = useMemo(()=>createOptions(options, 3),[])
  useEffect(()=>{
    dispatch(setPlayerControls({playerId: activePlayers[0], controls: [...filteredOptions].map((item)=>({label: item.name, value: item.name, action: actionId}))}))
  }
  ,[activePlayers, dispatch, filteredOptions, actionId ])
  const [selectedOption, setSelectedOption] = useState<AssetDefinition>();

  const player = useSelector((state:StoreData) => state.players.find((player)=>(player.id == activePlayers[0] || player.name == activePlayers[0])));

  const {triggerSoundEffect} = useAudio();

  useEffect(()=>{
    return triggerSoundEffect('sad');
  }, [triggerSoundEffect])

  const peerDataCallback = useCallback(
    (data:PeerDataCallbackPayload, ) => {
      // console.log(data, peerId);
      dispatch(setPlayerControls({playerId: activePlayers[0], controls:[]}) )
      setSelectedOption(
        filteredOptions.find((option)=>(option.name == data.payload.value))
      );
      const option = filteredOptions.find((option)=>(option.name == data.payload.value));
      if(!player || !option) return;
      dispatch(option.action(player.id));
      triggerSoundEffect('loss')
      setTimeout(()=>{
        dispatch(endMinigame());
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        },1000)
      }, 2000)
    },
    [
      dispatch,
      filteredOptions,
      player,
      triggerSoundEffect,
      activePlayers,
    ]);

  usePeerDataReceived(
    peerDataCallback,
    actionId
  )
  return (<div className="w-full flex flex-col items-center gap-24 text-black">
    <h1 className="animate-jump-in animate-ease-linear text-8xl text-center bg-gradient-radial from-black w-min p-8 rounded-full aspect-square flex items-center">
    🙁
    </h1>
    <div className="animate-jump-in font-titan uppercase animate-ease-linear animate-delay-500 text-center text-4xl">
      Select your sacrifice
    </div>    
    <div className='animate-jump-in animate-ease-linear animate-delay-500 flex flex-row items-center justify-center  p-2'>
    <PlayerCard player={player as Player} showGold showPoints className='bg-orange-400'/>
    </div>
    {selectedOption ? 
      <div className="grid grid-cols-1 gap-2 p-4">
        <div key={selectedOption.name} className="max-w-48 bg-red-200 rounded-xl border-red-400  p-2 flex flex-col border-2">
          <h2 className="text-xl font-bold uppercase">{selectedOption.name}</h2>
          <img width={100} height={100} className=" mx-auto p-2 items flex-grow" src={selectedOption.image} />
        </div>
      </div>
      :
      <div className="grid grid-cols-3 justify-items-center gap-2 p-4">
      {filteredOptions.sort(()=>Math.random() - 0.5).map(option=>{
        return <div key={option.id} className="animate-wiggle first:animate-delay-100 animate-delay-200 last:animate-delay-300 animate-fill-backwards animate-infinite max-w-48 bg-gradient-radial from-red-400 to-red-600 p-2 flex rounded-xl flex-col  border-2 border-black">
          <h2 className="animate-wiggle  animate-reverse animate-infinite text-xl font-bold uppercase">{option.name}</h2>
          <img width={100} height={100} className="mx-auto p-2 items flex-grow" src={option.image} />
          </div>
      })}
      </div>
    }
  </div>)
}

export default LoseAssetScreen;