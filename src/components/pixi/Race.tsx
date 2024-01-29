import { Stage, Sprite, } from '@pixi/react';
import { useDispatch, useSelector } from 'react-redux';
import {  Player, StoreData } from '$store/types';
import React, { useCallback, useEffect, useState } from 'react';
import bg from '$assets/bg.png';
import { ReactReduxContext } from 'react-redux';
import RaceCar from './RaceCar';
import { PeerContext } from '$contexts/PeerContext';
import {v4 as uuidv4 } from 'uuid';
import goldImg from '$assets/sprites/gold.png';
import pointImg from '$assets/sprites/points.png';
import { givePlayerGold, givePlayerPoints } from '$store/slices/playerSlice';
import { closeModal } from '$store/slices/gameProgressSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import PlayerCard from '$components/PlayerCard';

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();

type ContextBridgeProps = {
  children:React.ReactNode,
  Context: (typeof ReactReduxContext | typeof PeerContext),
  render:(children:React.ReactNode)=>React.ReactNode
}

const ContextBridge = ({ children, Context, render }:ContextBridgeProps) => {
  return (
    <Context.Consumer>
      {(value) =>{
        //@ts-expect-error Value is weirdly typed
        return render(<Context.Provider value={value}>{children}</Context.Provider>);
      }}
    </Context.Consumer>
  );
};


export const WrappedStage = ({ children, ...props }:{children:React.ReactNode}) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children) => 
      <ContextBridge
        Context={PeerContext}
        render={(children) => <>
        <Stage {...props}>{children}</Stage>
        </>}
        >
          {children}
      </ContextBridge>
    }
    >
      {children}
    </ContextBridge>
  );
};

function seedAssets(count:number):{x:number, y:number, id:string, collected:boolean|string}[]{
  return Array(count).fill(0).map(()=>({
    x:Math.random()*boardWidth*0.8, 
    y:Math.random()*boardHeight*0.8, 
    id: uuidv4(),
    collected:false
  }))
}

export const Race = () =>
{
  const players = useSelector((state:StoreData) => state.players);
  const [points, setPoints] = useState(seedAssets(5));
  const [gold, setGold] = useState(seedAssets(5));
  const dispatch = useDispatch();
  const handlePointCollected = useCallback((playerId:string, assetId:string)=>{
    setPoints((prev)=>{
      const next = [...prev]
      next[next.findIndex((point)=>point.id == assetId)].collected = playerId
      return next;
    });
    dispatch(givePlayerPoints({playerId, points: 1}))
  },[dispatch, setPoints,]);
  const handleGoldCollected = useCallback((playerId:string, assetId:string)=>{
    setGold((prev)=>{
      const next = [...prev]
      next[next.findIndex((point)=>point.id == assetId)].collected = playerId
      return next;
    });
    dispatch(givePlayerGold({playerId, gold: 1}))
  },[dispatch, setGold,]);

  const [results, setResults] = useState<Player[]>([]);

  useEffect(()=>{
    if(gold.filter(g=>!g.collected).length + points.filter(g=>!g.collected).length == 0){
      setResults(()=>{
        return players.map((player)=>{
          return {
            ...player,
            points: points.filter((point)=>point.collected == player.id).length,
            gold: gold.filter((point)=>point.collected == player.id).length,
          }
        }).sort((a,b)=>{
          if(a.points !== b.points){
            return b.points - a.points;
          }
          if(a.gold !== b.gold){
            return b.gold - a.gold;
          }
          return 0;
        })
      });
      setTimeout(()=>{
        dispatch(closeModal());
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        },500);
      }, 5000)
    }
  },[gold, points, dispatch, players])

  if(results.length){
    return <div className="flex gap-36">
      <h1 className="text-black text-center text-8xl font-extrabold">RESULTS</h1>
      <div className="flex flex-row place-items-center justify-center gap-">
        {
          results.map((result)=>{
            return <PlayerCard player={result} showGold={true} showPoints={true} className='bg-green-200 border-green-400'/>
          })
        }
        </div>
    </div>
  }
  const displayPoints = points.filter((point)=>!point.collected);
  const displayGold = gold.filter((point)=>!point.collected);
  return (
      <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth-32} height={boardHeight-32} options={{ backgroundColor: 0x222222, antialias: true }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
    {
      displayPoints.map((point)=>{
        return <Sprite key={point.id} x={point.x} y={point.y} width={40} height={40} image={pointImg} />
      })
    }
    {
      displayGold.map((point)=>{
        return <Sprite key={point.id} x={point.x} y={point.y} width={40} height={40} image={goldImg} />
      })
    }
    {
      players.map((player)=>{
        return <RaceCar 
        points={displayPoints} 
        gold={displayGold} 
        onGoldCollected={handleGoldCollected} 
        onPointCollected={handlePointCollected} 
        key={player.id} 
        player={player} 
        boundaries={{
          minX:25, 
          minY:25, 
          maxX:boardWidth - 50, 
          maxY: boardHeight- 50
        }} 
        />
      })
    }
    </WrappedStage>
    );
};

export default Race