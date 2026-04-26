import { Stage} from '@pixi/react';
import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { PeerContext } from '$contexts/PeerContext';
import { BoardDimensionsContext } from '$contexts/BoardDimensionsContext';

type ContextBridgeProps = {
  children:React.ReactNode,
  Context: (typeof ReactReduxContext | typeof PeerContext | typeof BoardDimensionsContext),
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
        render={(children) =>
        <ContextBridge
          Context={BoardDimensionsContext}
          render={(children) => <Stage {...props}>{children}</Stage>}
        >
          {children}
        </ContextBridge>}
        >
          {children}
      </ContextBridge>
    }
    >
      {children}
    </ContextBridge>
  );
};

export default WrappedStage