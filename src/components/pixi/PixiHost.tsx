import WrappedStage from './WrappedStage';
import Board from './Board';
import useBoardDimensions from '$hooks/useBoardDimensions';
import ShiftingLavaBackground from './ShiftingLavaBackground';


export const PixiHost = () =>
{
  const {boardWidth, boardHeight } = useBoardDimensions();
  return (
    //@ts-expect-error this is a WrappedStage bug
    <WrappedStage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0x222222, antialias: true }}>
      <ShiftingLavaBackground />
      <Board />
    </WrappedStage>
  );
};

export default PixiHost