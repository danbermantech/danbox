import { useSelector } from 'react-redux';
import { StoreData } from '$store/types';
import Circles from '$components/pixi/Circle';
import useBoardDimensions from '$hooks/useBoardDimensions';

const BoardCircles = () => {
  const board = useSelector((state: StoreData) => state.board);
  const players = useSelector((state: StoreData) => state.players);
  const { boardWidth, boardHeight } = useBoardDimensions();

  const occupiedSpaces = new Set(players.map(p => p.spaceId));

  const circles = Object.values(board).map(loc => {
    const scale = occupiedSpaces.has(loc.id) ? 1 : 0.8;
    return {
      x: loc.x * boardWidth,
      y: loc.y * boardHeight,
      radius: loc.width * boardWidth * scale,
      fill: loc.color,
      stroke: loc.color,
      strokeWidth: 10,
    };
  });

  return <Circles circles={circles} />;
};

export default BoardCircles;
