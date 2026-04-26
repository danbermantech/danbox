import { StoreData } from "$store/types";
import { useSelector } from "react-redux";
import BoardSpace from "./BoardSpace";
import BoardCircles from "./BoardCircles";

const BoardSpaces = () =>{
  const board = useSelector((state:StoreData) => state.board);
  return (
    <>
      <BoardCircles />
      {Object.keys(board).map((space) => {
        return <BoardSpace id={space} key={space} />;
      })}
    </>
  );
}

export default BoardSpaces