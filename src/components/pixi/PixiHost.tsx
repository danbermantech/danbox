import { Sprite, } from '@pixi/react';

import {bg} from '$assets/images';
// import { WrappedStage } from './Frenzy';
import WrappedStage from './WrappedStage';
import RoundCounter from './RoundCounter';
import Board from './Board';
import useBoardDimensions from '$hooks/useBoardDimensions';

// const boardWidth = (()=>window.innerWidth - 512)();
// const boardHeight = (()=>window.innerHeight - 32)();


export const PixiHost = () =>
{
  const {boardWidth, boardHeight } = useBoardDimensions();
  return (
    //@ts-expect-error this is a WrappedStage bug
    <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0xffffff, antialias: true }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
      <RoundCounter />
      <Board />
    </WrappedStage>
  );
};

export default PixiHost