import { useCallback, useEffect, useState, lazy } from 'react';
import {  Sprite, } from '@pixi/react';
import { useAppDispatch, useAppSelector } from '$store/hooks';
import type {  Player, } from '$store/types';
import {v4 as uuidv4 } from 'uuid';
import {gold as goldImg, points as pointImg} from '$assets/images.ts';
import { givePlayerGold, givePlayerPoints, setPlayerControls } from '$store/slices/playerSlice';
import { endMinigame } from '$store/slices/gameProgressSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import useBoardDimensions from '$hooks/useBoardDimensions';
import ShiftingLavaBackground from './ShiftingLavaBackground';
import FrenzyCar from './FrenzyCar';
import useAudio from '$hooks/useAudio';
import LeaderboardItem from '$components/LeaderboardItem';

const WrappedStage = lazy(async()=>await import('./WrappedStage'));

const MIN_GOLD = 1;
const MAX_GOLD = 1;
const MIN_POINTS = 1;
const MAX_POINTS = 1;


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
  const [points, setPoints] = useState(seedAssets(Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS + 1) + MIN_POINTS)));
  const [gold, setGold] = useState(seedAssets(Math.floor(Math.random() * (MAX_GOLD - MIN_GOLD + 1) + MIN_GOLD)));
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
  
  const {triggerSoundEffect} = useAudio();

  const [completed, setCompleted] = useState(false);

  useEffect(()=>{
    if(completed) return triggerSoundEffect('victory');
    return triggerSoundEffect(`frenzy`);
    // return ()=>{if(stop)stop()};
  },[triggerSoundEffect, completed]);

  useEffect(()=>{
    players.forEach((player)=>{
    dispatch(setPlayerControls({playerId: player.id, controls: 'FRENZY'}))
    })
    // console.log('abcd')
  },[])

  const [results, setResults] = useState<Player[]>([]);

  useEffect(()=>{
    if(gold.filter(g=>!g.collected).length + points.filter(g=>!g.collected).length == 0 && results.length == 0){
      // console.log(results)
      setResults(()=>{
        return [...players].sort((a,b)=>{
          if(! (a.id in playerPoints) || ! (b.id in playerPoints)) return 0;
          if(playerPoints[a.id] !== playerPoints[b.id]){
            return playerPoints[a.id] - playerPoints[b.id] 
          }
          if(playerGold[a.id] !== playerGold[b.id]){
            return playerGold[a.id] - playerGold[b.id] 
          }
          return 0;
        })
      });
    }
  },[
    gold, 
    points, 
    players, 
    playerGold, 
    playerPoints, 
    results
  ])


  const [rewardGranted, setRewardGranted] = useState(false)
  const endFrenzy = useCallback(()=>{
    if(!results.length) return;
    // let t1: NodeJS.Timeout;
      dispatch(setPlayerControls({playerId: players[0].id, controls: []}))
      const t = setTimeout(()=>{
        // if(completed) return;
        if(completed && rewardGranted) return;
        dispatch((dispatch)=>{
          Object.entries(playerPoints).forEach(([playerId, points])=>{
            dispatch(givePlayerPoints({playerId, points}))
          });
          Object.entries(playerGold).forEach(([playerId, gold])=>{
            dispatch(givePlayerGold({playerId, gold}))
          });
          setRewardGranted(true);
        })
      },1000)
      const t1 = setTimeout(()=>{
        dispatch(endMinigame());
        dispatch(triggerNextQueuedAction());
        // t2 = setTimeout(()=>{
        // },500);
      }, 5000)
      setCompleted(true)
      return ()=>{
        clearTimeout(t);
        clearTimeout(t1);
        // clearTimeout(t2);
      }
  },[
    completed, 
    dispatch, 
    playerGold, 
    playerPoints, 
    players, 
    results,
    rewardGranted
  ])


  useEffect(endFrenzy,[endFrenzy])

  if(results.length){
    const ranked = [...results].reverse();
    return (
      <div className="flex gap-8 flex-col items-center justify-center h-full">
        <h1 className="text-black text-center text-8xl font-extrabold">RESULTS</h1>
        <div className="flex flex-col rounded-xl overflow-clip divide-y divide-black border-black border w-full max-w-lg">
          {ranked.map((result, i) => (
            <LeaderboardItem
              key={result.id}
              player={{ ...result, points: playerPoints[result.id] ?? 0, gold: playerGold[result.id] ?? 0 }}
              rank={i + 1}
              className={i === 0 ? 'bg-yellow-200' : i === 1 ? 'bg-gray-200' : i === 2 ? 'bg-orange-200' : 'bg-white bg-opacity-70'}
            />
          ))}
        </div>
      </div>
    );
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