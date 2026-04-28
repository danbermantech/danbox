import { Sprite, } from '@pixi/react';
import {bg} from '$assets/images';
import useBoardDimensions from '$hooks/useBoardDimensions';
import WrappedStage from './WrappedStage';
import Board from './Board';

export const PixiHost = () =>
{
  const {boardWidth, boardHeight } = useBoardDimensions();
  return (
    //@ts-expect-error this is a WrappedStage bug
    <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0xffffff, antialias: true }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
      <Board />
    </WrappedStage>
  );
};

export default PixiHost