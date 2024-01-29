import { Sprite, } from '@pixi/react';
import bg from '$assets/bg.png';
import { WrappedStage } from './Race';
import PlayerPieces from './PlayerPieces';
import BoardSpaces from './BoardSpaces';
import RoundCounter from './RoundCounter';
import Paths from './Paths';

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();


export const PixiHost = () =>
{
  // const players = useSelector((state:StoreData) => state.players);
  return (
    //@ts-expect-error this is a WrappedStage bug
    <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0xffffff, antialias: true }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
      <RoundCounter />
      <Paths />
      <BoardSpaces />
      <PlayerPieces />
    </WrappedStage>
  );
};

export default PixiHost