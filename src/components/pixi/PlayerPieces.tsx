import { useSelector } from "react-redux";
import PlayerPiece from "./PlayerPiece";
import { StoreData } from "$store/types";

const PlayerPieces = () => {
  const players = useSelector((state: StoreData) => state.players);
  return (
    <>
      {players.map((player) => {
        return <PlayerPiece id={player.id} key={player.id} />;
      })}
    </>
  );
}

export default PlayerPieces