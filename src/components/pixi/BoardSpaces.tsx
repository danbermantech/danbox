import { StoreData } from "$store/types";
import { useSelector } from "react-redux";
import BoardSpace from "./BoardSpace";

const BoardSpaces = () =>{
  const board = useSelector((state:StoreData) => state.game.board);
  return (
    <>
      {board.map((space) => {
        return <BoardSpace id={space.id} key={space.id} />;
      })}
    </>
  );
}

export default BoardSpaces