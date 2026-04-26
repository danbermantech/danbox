import { Player } from "$store/types";
import clsx from "clsx";
import { gold as goldImg, points as pointsImg } from "$assets/images.ts";

type LeaderboardItemProps = {
  player: Player;
  rank: number;
  className?: string;
  onClick?: (player: Player) => void;
};

const LeaderboardItem = ({ player, rank, className, onClick }: LeaderboardItemProps) => {
  if (!player) return null;
  return (
    <div
      className={clsx("flex items-center w-full gap-2 px-3 py-2  text-black", className, onClick && "cursor-pointer")}
      onClick={onClick ? () => onClick(player) : undefined}
    >
      {/* Rank */}
      <div className="w-7 text-center font-titan font-bold text-lg flex-shrink-0">{rank}</div>

      {/* Image */}
      <img src={player.image} width="40" height="40" className="w-10 h-10 min-w-10 rounded-full flex-shrink-0" />

      {/* Name + Items */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {player.name.toLocaleUpperCase()}
        </span>
        {player.items.length > 0 && (
          <div className="flex flex-row gap-1 mt-0.5 flex-wrap">
            {player.items.map((item, i) => (
              <img src={item.image} key={item.name + i} width="20" height="20" className="w-5 h-5" />
            ))}
          </div>
        )}
      </div>

      {/* Points */}
      <div className="flex items-center gap-1 w-14 justify-end flex-shrink-0">
        <img src={pointsImg} width="16" height="16" className="w-4 h-4" />
        <span className="text-sm font-bold">{player.points}</span>
      </div>

      {/* Gold */}
      <div className="flex items-center gap-1 w-14 justify-end flex-shrink-0">
        <img src={goldImg} width="16" height="16" className="w-4 h-4" />
        <span className="text-sm font-bold">{player.gold}</span>
      </div>
    </div>
  );
};

export default LeaderboardItem;
