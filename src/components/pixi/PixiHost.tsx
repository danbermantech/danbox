import { Sprite, } from '@pixi/react';
import bg from '$assets/bg.png';
import { WrappedStage } from './Race';
import RoundCounter from './RoundCounter';
import Board from './Board';

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();


export const PixiHost = () =>
{
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