import Line from "./Line";
import { useAppSelector } from "$store/hooks";


const Paths = () =>{
  const board = useAppSelector((state) => state.board);
  return <>
  {Object.values(board).map((location) => {
    return location.connections.map((connection) => {
      const connectedLocation = board[connection];
      if (!connectedLocation) return null;
      return <Line
        key={location.id + '_' + connection}
        from={location}
        to={connectedLocation}
        color={location.color}
        width={4}
      />
    })
  })}
  </>
}

export default Paths