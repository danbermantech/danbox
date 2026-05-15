import { Stage } from '@pixi/react';
import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { PeerContext } from '$contexts/PeerContext';
import { BoardDimensionsContext } from '$contexts/BoardDimensionsContext';

type ContextBridgeProps<T> = {
  children: React.ReactNode;
  Context: React.Context<T>;
  render: (children: React.ReactNode) => React.ReactNode;
};

const ContextBridge = <T,>({
  children,
  Context,
  render,
}: ContextBridgeProps<T>) => {
  return (
    <Context.Consumer>
      {(value) => {
        return render(
          <Context.Provider value={value}>{children}</Context.Provider>,
        );
      }}
    </Context.Consumer>
  );
};

export const WrappedStage = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
  options?: Record<string, unknown>;
}) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children) => (
        <ContextBridge
          Context={PeerContext}
          render={(children) => (
            <ContextBridge
              Context={BoardDimensionsContext}
              render={(children) => <Stage {...props}>{children}</Stage>}
            >
              {children}
            </ContextBridge>
          )}
        >
          {children}
        </ContextBridge>
      )}
    >
      {children}
    </ContextBridge>
  );
};

export default WrappedStage;
