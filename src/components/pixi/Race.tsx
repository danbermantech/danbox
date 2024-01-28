import { Stage, Sprite, useTick, } from '@pixi/react';
import { useDispatch, useSelector } from 'react-redux';
import {  StoreData } from '$store/types';
import React from 'react';
import bg from '$assets/bg.png';
import { ReactReduxContext } from 'react-redux';
import RaceCar from './RaceCar';
import { PeerContext } from '$contexts/PeerContext';

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();


const ContextBridge = ({ children, Context, render }:{children:React.ReactNode, Context: typeof ReactReduxContext | typeof PeerContext,render:(children:React.ReactNode)=>React.ReactNode}) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
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
        {/* {children} */}
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


export const Race = () =>
{
  const players = useSelector((state:StoreData) => state.players);

  return (
    <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth * 0.8} height={boardHeight * 0.8} options={{ backgroundColor: 0x222222, antialias: true }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
    {
      players.map((player)=>{
        return <RaceCar key={player.id} player={player} />
      })
    }
    </WrappedStage>
  );
};

export default Race