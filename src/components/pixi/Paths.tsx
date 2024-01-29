import { useSelector } from "react-redux"
import Line from "./Line";
import { StoreData } from "$store/types";


const Paths = () =>{
  const board = useSelector((state:StoreData) => state.game.board);
  return <>
  {board.map((location) => {
    return location.connections.map((connection) => {
      const connectedLocation = board.find((location) => location.id == connection);
      if (!connectedLocation) return null;
      return <Line
        key={location.id + '_' + connection}
        from={location}
        to={connectedLocation}
        color={location.color}
        width={1}
      />
    })
  })}
  </>
}

export default Paths