import { StoreData } from "$store/types";
import { useSelector } from "react-redux";
import BoardSpace from "./BoardSpace";

const BoardSpaces = () =>{
  const board = useSelector((state:StoreData) => state.board);
  return (
    <>
      {Object.keys(board).map((space) => {
        return <BoardSpace id={space} key={space} />;
      })}
    </>
  );
}

export default BoardSpaces