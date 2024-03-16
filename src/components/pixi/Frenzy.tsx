import { useCallback, useEffect, useState, lazy } from 'react';
import {  Sprite, } from '@pixi/react';
import { useAppDispatch, useAppSelector } from '$store/hooks';
import type {  Player, } from '$store/types';
// import { ReactReduxContext } from 'react-redux';
// import { PeerContext } from '$contexts/PeerContext';
import {v4 as uuidv4 } from 'uuid';
import goldImg from '$assets/sprites/gold.png';
import pointImg from '$assets/sprites/points.png';
import { givePlayerGold, givePlayerPoints, setPlayerControls } from '$store/slices/playerSlice';
import { endMinigame } from '$store/slices/gameProgressSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import useBoardDimensions from '$hooks/useBoardDimensions';
// import WrappedStage  from './WrappedStage';
import ShiftingLavaBackground from './ShiftingLavaBackground';
import FrenzyCar from './FrenzyCar';
// import PlayerCard from '$components/PlayerCard';

const PlayerCard = lazy(async()=>await import('$components/PlayerCard'));
// const ShiftingLavaBackground = lazy(async()=>await import('./ShiftingLavaBackground'));
// const FrenzyCar = lazy(async()=>await import( './FrenzyCar'));
const WrappedStage = lazy(async()=>await import('./WrappedStage'));


function seedAssets(count:number):{x:number, y:number, id:string, collected:boolean|string}[]{
  return Array(count).fill(0).map(()=>({
    x:Math.min(Math.max(0.05,Math.random()), 0.95),
    y:Math.min(Math.max(0.05,Math.random()), 0.95),
    id: uuidv4(),
    collected:false
  }))
}

export const Frenzy = () =>
{
  const {boardWidth, boardHeight } = useBoardDimensions();
  const players = useAppSelector((state) => state.players);
  const [points, setPoints] = useState(seedAssets(Math.floor(Math.random() *45 + 5)));
  const [gold, setGold] = useState(seedAssets(Math.floor(Math.random() *45 + 5)));
  const dispatch = useAppDispatch();

  const [playerPoints, setPlayerPoints] = useState<{[key:string]:number}>({});
  const [playerGold, setPlayerGold] = useState<{[key:string]:number}>({});
  const _givePlayerGold = useCallback((playerId:string, gold:number)=>{
    setPlayerGold((prev)=>{
      return {
        ...prev,
        [playerId]: (prev[playerId] || 0) + gold
      }
    })
  }
  ,[setPlayerGold]);

  const _givePlayerPoints = useCallback((playerId:string, points:number)=>{
    setPlayerPoints((prev)=>{
      return {
        ...prev,
        [playerId]: (prev[playerId] || 0) + points
      }
    })
  }
  ,[setPlayerPoints]);
  const handlePointCollected = useCallback((playerId:string, assetId:string)=>{
    setPoints((prev)=>{
      const next = [...prev]
      next[next.findIndex((point)=>point.id == assetId)].collected = playerId
      return next;
    });
    _givePlayerPoints(playerId, 1);
    // dispatch(givePlayerPoints({playerId, points: 1}))
  },[_givePlayerPoints]);
  const handleGoldCollected = useCallback((playerId:string, assetId:string)=>{
    setGold((prev)=>{
      const next = [...prev]
      next[next.findIndex((point)=>point.id == assetId)].collected = playerId
      return next;
    });
    _givePlayerGold(playerId, 1);
    // dispatch(givePlayerGold({playerId, gold: 1}))
  },[_givePlayerGold]);
  


  useEffect(()=>{
    players.forEach((player)=>{
    dispatch(setPlayerControls({playerId: player.id, controls: 'FRENZY'}))
    })
  })

  const [results, setResults] = useState<Player[]>([]);

  useEffect(()=>{
    if(gold.filter(g=>!g.collected).length + points.filter(g=>!g.collected).length == 0 && results.length == 0){
      dispatch(setPlayerControls({playerId: players[0].id, controls: []}))
      
      setResults(()=>{
        return players.sort((a,b)=>{
          if(playerPoints[a.id] !== playerPoints[b.id]){
            return playerPoints[a.id] - playerPoints[b.id] 
          }
          if(playerGold[a.id] !== playerGold[b.id]){
            return playerGold[a.id] - playerGold[b.id] 
          }
          return 0;
        })
      });
      //   .map((player)=>{
      //     return {
      //       ...player,
      //       points: points.filter((point)=>point.collected == player.id).length,
      //       gold: gold.filter((point)=>point.collected == player.id).length,
      //     }
      //   }).sort((a,b)=>{
      //     if(a.points !== b.points){
      //       return b.points - a.points;
      //     }
      //     if(a.gold !== b.gold){
      //       return b.gold - a.gold;
      //     }
      //     return 0;
      //   })
      // });
      setTimeout(()=>{
       dispatch((dispatch)=>{
        Object.entries(playerPoints).forEach(([playerId, points])=>{
          dispatch(givePlayerPoints({playerId, points}))
        });
        Object.entries(playerGold).forEach(([playerId, gold])=>{
          dispatch(givePlayerGold({playerId, gold}))
        });
       })
      },1000)
      setTimeout(()=>{
        dispatch(endMinigame());
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        },500);
      }, 5000)
    }
  },[gold, points, dispatch, players, playerGold, playerPoints])

  if(results.length){
    return <div className="flex gap-36 flex-col">
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
    //@ts-expect-error I need to figure out the className thing
      <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth-32} height={boardHeight-32} options={{ backgroundColor: 0x222222, antialias: true }}>
      {/* <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} /> */}
      <ShiftingLavaBackground />
    {
      displayPoints.map((point)=>{
        return <Sprite key={point.id} x={point.x * boardWidth} y={point.y * boardHeight} width={40} height={40} image={pointImg} />
      })
    }
    {
      displayGold.map((point)=>{
        return <Sprite key={point.id} x={point.x * boardWidth} y={point.y * boardHeight} width={40} height={40} image={goldImg} />
      })
    }
    {
      players.map((player)=>{
        return <FrenzyCar 
        points={displayPoints} 
        gold={displayGold} 
        onGoldCollected={handleGoldCollected} 
        onPointCollected={handlePointCollected} 
        key={player.id} 
        player={player} 
        boundaries={{
          minX: 0.025, 
          minY: 0.025, 
          maxX: 0.975, 
          maxY: 0.975,
        }} 
        />
      })
    }
    </WrappedStage>
    );
};

export default Frenzy