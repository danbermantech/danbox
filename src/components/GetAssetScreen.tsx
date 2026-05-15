import { useDispatch, useSelector } from 'react-redux';
import { AssetDefinition, Player, StoreData } from '$store/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setPlayerControls, givePlayerGold, givePlayerPoints, givePlayerItem, setPlayerInstructions } from '$store/slices/playerSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import {gold, points, shrimp, magicHat, teleport, cheat, souperSoup, soup, magicHand, wrecking_ball, men_at_work, add_space} from '$assets/images.ts';
import useAudio from '$hooks/useAudio';
import usePeerDataReceived, { PeerDataCallbackPayload } from '$hooks/useDataReceived';
import {v4 as uuidv4} from 'uuid'
import PlayerCard from './PlayerCard';
import { endMinigame } from '$store/slices/gameProgressSlice';
import itemDefs from '$constants/items';

type TieredAssetDefinition = AssetDefinition & {
  rewardTier: number,
}

type SelectableTieredAsset = TieredAssetDefinition & {
  id: string,
}

const options:TieredAssetDefinition[] = [
  {
    name: 'Get 5 gold',
    value: 5,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{ return givePlayerGold({playerId: target, gold: 5}) },
    weight: 20,
    rewardTier: 1,
  },
  {
    name: 'Get 10 gold',
    value: 10,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{ return givePlayerGold({playerId: target, gold: 10}) },
    weight: 12,
    rewardTier: 2,
  },
  {
    name: 'Get 50 gold',
    value: 50,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{ return givePlayerGold({playerId: target, gold: 50}) },
    weight: 5,
    rewardTier: 3,
  },
  {
    name: 'Get 250 gold',
    value: 250,
    asset: 'gold',
    image: gold,
    action: (target:string)=>{ return givePlayerGold({playerId: target, gold: 250}) },
    weight: 3,
    rewardTier: 5,
  },
  {
    name: 'Get 1 point',
    value: 1,
    asset: 'points',
    image: points,
    action: (target:string)=>{ return givePlayerPoints({playerId: target, points: 1}) },
    weight: 10,
    rewardTier: 1,
  },
  {
    name: 'Get 5 points',
    value: 5,
    asset: 'points',
    image: points,
    action: (target:string)=>{ return givePlayerPoints({playerId: target, points: 5}) },
    weight: 20,
    rewardTier: 1,
  },
  {
    name: 'Get 10 points',
    value: 10,
    asset: 'points',
    image: points,
    action: (target:string)=>{ return givePlayerPoints({playerId: target, points: 10}) },
    weight: 12,
    rewardTier: 2,
  },
  {
    name: 'Get 50 points',
    value: 50,
    asset: 'points',
    image: points,
    action: (target:string)=>{ return givePlayerPoints({playerId: target, points: 50}) },
    weight: 1,
    rewardTier: 4,
  },
  {
    name: 'Get Shrimp',
    value: 0,
    asset: 'item',
    image: shrimp,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='shrimp')!}) },
    weight: 8,
    rewardTier: 1,
  },
  {
    name: 'Get Soup',
    value: 0,
    asset: 'item',
    image: soup,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='soup')!}) },
    weight: 8,
    rewardTier: 1,
  },
  {
    name: 'Get Magic Hat',
    value: 0,
    asset: 'item',
    image: magicHat,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='magic hat')!}) },
    weight: 4,
    rewardTier: 2,
  },
  {
    name: 'Get Teleport',
    value: 0,
    asset: 'item',
    image: teleport,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='teleport')!}) },
    weight: 4,
    rewardTier: 2,
  },
  {
    name: 'Get Cheat',
    value: 0,
    asset: 'item',
    image: cheat,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='cheat')!}) },
    weight: 4,
    rewardTier: 2,
  },
  {
    name: 'Get Traffic Engineer',
    value: 0,
    asset: 'item',
    image: men_at_work,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='traffic engineer')!}) },
    weight: 3,
    rewardTier: 3,
  },
  {
    name: 'Get Demo Crew',
    value: 0,
    asset: 'item',
    image: wrecking_ball,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='demo crew')!}) },
    weight: 3,
    rewardTier: 3,
  },
  {
    name: 'Get Construct Crew',
    value: 0,
    asset: 'item',
    image: add_space,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='construct crew')!}) },
    weight: 3,
    rewardTier: 3,
  },
  {
    name: 'Get Souper Soup',
    value: 0,
    asset: 'item',
    image: souperSoup,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='souper soup')!}) },
    weight: 2,
    rewardTier: 4,
  },
  {
    name: 'Get Magic Hand',
    value: 0,
    asset: 'item',
    image: magicHand,
    action: (target:string)=>{ return givePlayerItem({playerId: target, item: itemDefs.find(i=>i.name==='magic hand')!}) },
    weight: 1,
    rewardTier: 5,
  },
]

function getTieredOptionsForSpaceTier(spaceTier: number): TieredAssetDefinition[] {
  return options
    .filter((option) => option.rewardTier <= spaceTier)
    .map((option) => {
      if (option.rewardTier >= spaceTier) {
        return option;
      }

      const tierGap = spaceTier - option.rewardTier;
      const multiplier = Math.max(0.15, 1 - tierGap * 0.2);
      return {
        ...option,
        weight: Math.max(1, Math.round(option.weight * multiplier)),
      };
    });
}

function createOptions(options: TieredAssetDefinition[], count: number = 3): SelectableTieredAsset[] {
  const weightedOptions = options
    .map((option) =>
      Array(option.weight).fill(0).map(() => ({ ...option, id: uuidv4() }))
    )
    .flat();

  return weightedOptions.sort(() => Math.random() - 0.5).slice(0, count);
}

const GetAssetScreen = ()=>{
  
  const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);
  const board = useSelector((state:StoreData) => state.board);
  const dispatch = useDispatch();
  const player = useSelector((state:StoreData) => state.players.find((player)=>(player.id == activePlayers[0] || player.name == activePlayers[0]))) as Player;
  const spaceTier = useMemo(() => {
    const tier = player?.spaceId ? board[player.spaceId]?.tier : undefined;
    return Math.min(5, Math.max(1, tier ?? 3));
  }, [board, player?.spaceId]);
  const filteredOptions = useMemo(()=>(createOptions(getTieredOptionsForSpaceTier(spaceTier), 3)),[spaceTier])
  const [actionId] = useState(()=>uuidv4())
  useEffect(()=>{
    // console.log(activePlayers);
    dispatch(setPlayerInstructions({playerId: activePlayers[0], instructions: 'Select your prize'}));
    dispatch(setPlayerControls({playerId: activePlayers[0], controls: filteredOptions.map((item)=>({label: item.name, value: item.id, action: actionId}))}))
  }
  ,[activePlayers, dispatch, filteredOptions, actionId ])

  const [selectedOption, setSelectedOption] = useState<AssetDefinition>();

  const {triggerSoundEffect} = useAudio();

  useEffect(()=>{return triggerSoundEffect('glad')},[triggerSoundEffect])

  const handledRef = useRef(false);
  const peerDataCallback = useCallback((data:PeerDataCallbackPayload) => {
    if(data.payload.action){
      if(handledRef.current) return;
      handledRef.current = true;
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
    <div className="animate-jump-in font-titan uppercase animate-ease-linear animate-delay-500 text-center text-6xl font-bold">
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
        // console.log(filteredOptions)
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