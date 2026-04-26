import { Player } from "$store/types";
import clsx from "clsx";
import LeaderboardItem from "./LeaderboardItem";

type LeaderboardProps = {
  players: Player[];
  activePlayers?: string[];
  className?: string;
  itemClassName?: (player: Player) => string | undefined;
  onPlayerClick?: (player: Player) => void;
};

const Leaderboard = ({ players, activePlayers = [], className, itemClassName, onPlayerClick }: LeaderboardProps) => {
  const sorted = [...players].sort(
    (a, b) => b.points * 1000 + b.gold * 0.0001 - (a.points * 1000 + a.gold * 0.0001)
  );

  return (
    <div className={clsx("flex flex-col rounded-xl overflow-clip divide-y divide-black border-black border", className)}>
      {sorted.map((player, index) => (
        <LeaderboardItem
          key={player.id}
          player={player}
          rank={index + 1}
          className={clsx(
            "bg-[#88888888]",
            activePlayers.includes(player.id) && "bg-green-400",
            itemClassName?.(player)
          )}
          onClick={onPlayerClick}
        />
      ))}
    </div>
  );
};

export default Leaderboard;
