import { useSelector } from 'react-redux';
import { StoreData } from '$store/types';
import Circles from '$components/pixi/Circle';
import useBoardDimensions from '$hooks/useBoardDimensions';

const BoardCircles = () => {
  const board = useSelector((state: StoreData) => state.board);
  const { boardWidth, boardHeight } = useBoardDimensions();

  const circles = Object.values(board).map(loc => ({
    x: loc.x * boardWidth,
    y: loc.y * boardHeight,
    radius: loc.width * boardWidth,
    fill: loc.color,
    stroke: loc.color,
    strokeWidth: 10,
  }));

  return <Circles circles={circles} />;
};

export default BoardCircles;
