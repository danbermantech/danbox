import { Stage,} from '@pixi/react';
import { useSelector } from 'react-redux';
import {  StoreData } from '$store/types';
import React, { useCallback, useEffect, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import { PeerContext } from '$contexts/PeerContext';
import useBoardDimensions from '$hooks/useBoardDimensions';
import ShiftingLavaBackground from './ShiftingLavaBackground';
import PursuitCar from './PursuitCar';
// import usePeerDataReceived from '$hooks/useDataReceived';
import { useAppDispatch, useAppSelector } from '$store/hooks';
// import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
import { givePlayerGold } from '$store/slices/playerSlice';
import PlayerCard from '$components/PlayerCard';
import { closeModal } from '$store/slices/gameProgressSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';
// import { closeModal } from '$store/slices/gameProgressSlice';
// import clsx from 'clsx';

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

interface CaptureMap{
  [id:string]:{
    isCaptured: boolean;
    captured:CaptureMap;
  }
}

export const PursuitCars = ({handleGameOver}:{handleGameOver:(result:CaptureMap)=>void}) => {

  const players= useSelector((state:StoreData)=>state.players);

  const [playerPositions, setPlayerPositions] = useState<Record<string,{x:number, y:number, angle:number, velocity:number}>>(()=>{
    return {}
  });

  const [gameState, setGameState] = useState(()=>{
    const result:CaptureMap= {};
    players.forEach((player)=>{
      result[player.id] = {isCaptured: false, captured:{}}
    })
    return result;
  });
  const dispatch = useAppDispatch();
  

  const handleEnemyCaptured = useCallback((playerId:string, enemyId:string)=>{
    
    console.log(playerId, ' captured ', enemyId)
    setPlayerPositions((prev)=>{
      let next = {...prev};
      delete next[enemyId];
      return next
    })
    setGameState((prev)=>{
      // eslint-disable-next-line prefer-const
      let next = {...prev}
      next[playerId].captured[enemyId] = next[enemyId];
      // next[enemyId].isCaptured = true;
      // next[enemyId] = undefined;
      delete next[enemyId]
      // next[enemyId].isCaptured = true;
      return next;
    });
    dispatch((disp)=>{
      disp(givePlayerGold({playerId, gold: 5}))
      disp(givePlayerGold({enemyId, gold: -5}))
    })
  },[setGameState, dispatch]);

  useEffect(()=>{
    if(Object.values(gameState).filter((player)=>player.isCaptured == false).length <= 1){
      handleGameOver(gameState);
      // setTimeout(()=>{
      //   dispatch(closeModal());
      //   setTimeout(()=>{

      //     dispatch(triggerNextQueuedAction());
      //   },500)
      // },2000)
    }
  },[gameState, handleGameOver, dispatch])
  return <>
    {players.filter(player=>gameState[player.id]).map((player)=>{
      return <PursuitCar
      key={player.id}
      player={player}
      opponents={Object.entries(playerPositions).filter(([id])=>id !== player.id).map(([id, position])=>({id, ...position}))}
      onOpponentCaptured={handleEnemyCaptured}
      onMove={(
        playerId:string, 
        position:{x:number, y:number, angle:number, velocity:number})=>{
        setPlayerPositions((prev)=>{
          return {...prev, [playerId]: position}
        })
      }}
      // position={position[player.id]}
      />
        }
    )}
  </>

}

// type Item = {
//   isCaptured: boolean;
//   captured: string[];
// };

// type CapturedMap = {
//   isCaptured: boolean;
//   captured: Record<string, CapturedMap>;
// };

// function getCapturedMap(data: Record<string, CaptureMap>): CaptureMap {
//   const capturedMap: CaptureMap = {
//   };

//   const processItem = (itemName: string): CaptureMap => {
//     const item = data[itemName];
//     const { isCaptured, captured } = item;

//     const nestedCaptured: Record<string, CaptureMap> = {};

//     captured.forEach((captureItem) => {
//       nestedCaptured[capturedItem] = processItem(capturedItem);
//     });

//     return {
//       isCaptured,
//       capture: nestedCaptured,
//     };
//   };

//   Object.keys(data).forEach((itemName) => {
//     const item = data[itemName];
//     if (!item.isCaptured) {
//       capturedMap.captured[itemName] = processItem(itemName);
//     }
//   });

//   return capturedMap;
// }

const GameOverItem = ({results}:{results:CaptureMap|{[id:string]:CaptureMap}})=>{
  console.log(results);
  const playerId = Object.keys(results)[0];
  console.log(playerId)
  const player = useAppSelector((state)=>state.players.find((p)=>p.id == playerId)) as Player;
  console.log(player)
  console.log(results[playerId])
  if(!results[playerId]) return null;
  return <div>
    <PlayerCard className="" player={player} />
    {/* <img src={player?.image} width="48" height="48" />
    <h2>{player?.name}</h2> */}
    {Object.keys(results[playerId]?.captured ?? {}).length > 0 ? 
    <>
    <hr className="border-black border-2 w-3/4 mx-auto" />
      <div className={`grid content-center place-items-center justify-center justify-items-center grid-cols-${Object.entries(results[playerId].captured)}`}>
      {Object.entries(results[playerId].captured).map(([id, capture])=>{
        console.log(id, capture)
        return <div><div className=" w-1 mx-auto h-8 bg-black "/><GameOverItem key={id} results={{[id]:capture ?? {}}} /></div>
      })}
    </div></>
      :null}
  </div>
}

const GameOverScreen = ({results}:{results:CaptureMap,}) => {
  // const capturedMap = getCapturedMap(results);
  return <div>
    <h1>Game Over</h1>
    <div className="grid grid-cols-1">
      <GameOverItem results={results} />
      {/* {JSON.stringify(results)} */}
      {/* {Object.entries(capturedMap).map(([id, captures])=>{
        return <GameOverItem id={id} captured={captures} />
      })} */}
    </div>
  </div>
}


export const Pursuit = () =>
{
  const {boardWidth, boardHeight } = useBoardDimensions();
  // const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<Record<string, {isCaptured: boolean, captured:string[]}>>();

  const dispatch = useAppDispatch();
  const handleGameOver = useCallback((data:Record<string, {captured:string[], isCaptured:boolean}>)=>{
    // setGameOver(true);
    setResults(data);
    setTimeout(()=>{
      dispatch(closeModal());
      setTimeout(()=>{
        dispatch(triggerNextQueuedAction());
      },500)
    
    },2000)
  },[setResults, dispatch]);

  if(results){
    return <div>
      <div className="grid grid-cols-1">
        <GameOverScreen results={results} />

        {/* <CaptureTreeDisplay tree={captureTree} /> */}
      </div>
    </div>
  }

  // if(results){
  //   return <div>
  //     <h1>Game Over</h1>
  //     <div className="grid grid-cols-1">
  //       {Object.entries(results).filter(([_, player]) => player.isCaptured == false).map(([id, player])=>{
  //         return <div>
  //           <h2>{id}</h2>
  //           <div className="grid grid-cols-1">
  //             {player.captured.map((id)=>{
  //               return <div>{id}</div>
  //             })}
  //           </div>
  //         </div>
  //       })}
  //     </div>
  //   </div>
  // }

  return (
    //@ts-expect-error I need to figure out the className thing
      <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth-32} height={boardHeight-32} options={{ backgroundColor: 0x222222, antialias: true }}>
      <ShiftingLavaBackground />
      <PursuitCars handleGameOver={handleGameOver}  />
    </WrappedStage>
    );
};

export default Pursuit