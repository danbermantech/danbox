import { Board, GAME_MODE, BoardSpaceConfig, Player } from "$store/types";
import Leaderboard from "./Leaderboard";
import { usePeer } from "$hooks/usePeer";
import QRShare from "./QRShare";
import {bg as bgImage} from '$assets/images.ts'
import MuteToggle from "./MuteToggle";
import { useEffect, useRef, useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "$store/hooks";
import { pauseGame, resumeGame, setDefaultMovesPerRound, setMaxRounds, setTriviaTimeLimit } from "$store/slices/gameProgressSlice";
import restart from "$store/actions/restart";
import { useRegistration } from "$contexts/RegistrationContext";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { clearAllPlayerControls, removePlayer, setAllPlayersMovesPerRound } from "$store/slices/playerSlice";
import { setBoardLayout } from "$store/slices/boardSlice";
import { boardLayout, boardLayout2, generateRandomBoard, createDemoBoard } from "$constants/boardLayout";

const DESIGNER_STORAGE_KEY = "danbox-board-designer-v1";
const DESIGNER_STORAGE_INDEX_KEY = `${DESIGNER_STORAGE_KEY}:index`;
const DESIGNER_STORAGE_ITEM_PREFIX = `${DESIGNER_STORAGE_KEY}:item:`;

type SavedBoardEntry = {
  key: string;
  name: string;
  updatedAt: number;
};

function loadSavedBoardIndex(): SavedBoardEntry[] {
  try {
    const raw = localStorage.getItem(DESIGNER_STORAGE_INDEX_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedBoardEntry[]) : [];
    const baseList = Array.isArray(parsed)
      ? parsed.filter((entry) => entry && typeof entry.key === "string" && typeof entry.name === "string")
      : [];

    // Backward compatibility with older single-slot save format.
    if (baseList.length === 0 && localStorage.getItem(DESIGNER_STORAGE_KEY)) {
      return [{ key: "legacy", name: "Legacy Save", updatedAt: 0 }];
    }

    return baseList.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function loadSavedBoardByKey(key: string): Board | null {
  try {
    const raw = key === "legacy"
      ? localStorage.getItem(DESIGNER_STORAGE_KEY)
      : localStorage.getItem(`${DESIGNER_STORAGE_ITEM_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as Board;
  } catch {
    return null;
  }
}

const RegistrationPanel = () => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const maxRounds = useAppSelector((state) => state.game.maxRounds);
  const defaultMovesPerRound = useAppSelector((state) => state.game.defaultMovesPerRound ?? 3);
  const triviaTimeLimit = useAppSelector((state) => state.game.triviaTimeLimit ?? 30);
  const dispatch = useAppDispatch();
  const { selectedBoard, setSelectedBoard } = useRegistration();
  const [savedBoards, setSavedBoards] = useState<SavedBoardEntry[]>([]);

  useEffect(() => {
    const refreshSavedBoards = () => {
      setSavedBoards(loadSavedBoardIndex());
    };

    refreshSavedBoards();
    window.addEventListener("focus", refreshSavedBoards);
    window.addEventListener("storage", refreshSavedBoards);

    return () => {
      window.removeEventListener("focus", refreshSavedBoards);
      window.removeEventListener("storage", refreshSavedBoards);
    };
  }, []);

  useEffect(() => {
    if (!selectedBoard.startsWith("saved:")) return;
    const selectedKey = selectedBoard.slice("saved:".length);
    const stillExists = savedBoards.some((entry) => entry.key === selectedKey);
    if (!stillExists) {
      setSelectedBoard("random");
    }
  }, [savedBoards, selectedBoard, setSelectedBoard]);

  const handleStart = useCallback(() => {
    if (selectedBoard.startsWith("saved:")) {
      const savedKey = selectedBoard.slice("saved:".length);
      const savedBoard = loadSavedBoardByKey(savedKey);
      if (savedBoard) {
        dispatch(setBoardLayout({ __wrapped: true, board: savedBoard, preserveConnections: true }));
      } else {
        dispatch(setBoardLayout(generateRandomBoard()));
        setSelectedBoard("random");
      }
      dispatch(setAllPlayersMovesPerRound(defaultMovesPerRound));
      dispatch(clearAllPlayerControls());
      dispatch(triggerNextQueuedAction());
      return;
    }

    const boardOptions: Record<string, () => Record<string, BoardSpaceConfig>> = {
      '1': () => boardLayout,
      '2': () => boardLayout2,
      'demo': createDemoBoard,
      'random': generateRandomBoard,
    };
    dispatch(setBoardLayout(boardOptions[selectedBoard]()));
    dispatch(setAllPlayersMovesPerRound(defaultMovesPerRound));
    dispatch(clearAllPlayerControls());
    dispatch(triggerNextQueuedAction());
  }, [defaultMovesPerRound, dispatch, selectedBoard, setSelectedBoard]);

  return (
    <div className="flex flex-col bg-slate-200 rounded-xl p-4 gap-4 h-full overflow-auto bg-gradient-radial from-pink-300 to-fuchsia-300" style={{ height: 'calc(100dvh - 32px)' }}>
      {/* <Logo /> */}
      <div className="flex flex-col gap-3 font-titan">
        <div className="flex flex-col items-center gap-2 bg-white bg-opacity-60 rounded-xl p-3 shadow">
          <span className="text-sm font-bold text-gray-600">Scan</span>
          <QRShare className="w-40 h-40 shadow overflow-clip border-none bg-white rounded-xl" />
        {/* </div>
        <div className="flex flex-col items-center gap-1 bg-white bg-opacity-60 rounded-xl p-3 shadow text-center"> */}
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Or visit</span>
          <span className="font-mono font-bold">Danbox.DanBerman.dev</span>
          <span className="text-xs text-gray-500">and use code</span>
          <span className="font-mono font-extrabold text-3xl select-text">{myShortId}</span>
        </div>
        <div className="flex flex-col gap-1 bg-white bg-opacity-60 rounded-xl p-3 shadow">
          <label htmlFor="host-game-length" className=" text-gray-600">Game Length</label>
          <input
            id="host-game-length"
            name="gameLength"
            className="text-xl bg-white font-sans bg-opacity-70 font-bold border-2 border-gray-300 rounded-lg px-2 py-1 w-full"
            type="number"
            value={maxRounds}
            onChange={(e) => dispatch(setMaxRounds(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1 bg-white bg-opacity-60 rounded-xl p-3 shadow">
          <label htmlFor="host-board-select" className=" text-gray-600">Board</label>
          <select
            id="host-board-select"
            name="board"
            className="text-base font-sans font-bold bg-white bg-opacity-70 border-2 border-gray-300 rounded-lg px-2 py-1 w-full"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            <option value="random">Random!</option>
            <option value="demo">Demo</option>
            <option value="1">Path to Heaven</option>
            <option value="2">Dream Gate</option>
            {savedBoards.length > 0 && (
              <optgroup label="Created Maps" className="text-blue-400">
                {savedBoards.map((entry) => (
                  <option key={entry.key} value={`saved:${entry.key}`}>
                    {entry.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        <div className="flex flex-col gap-1 bg-white bg-opacity-60 rounded-xl p-3 shadow">
          <label htmlFor="host-moves-per-round" className=" text-gray-600">Moves Per Round</label>
          <input
            id="host-moves-per-round"
            name="movesPerRound"
            className="text-xl bg-white font-sans bg-opacity-70 font-bold border-2 border-gray-300 rounded-lg px-2 py-1 w-full"
            type="number"
            min={1}
            value={defaultMovesPerRound}
            onChange={(e) => dispatch(setDefaultMovesPerRound(Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>
        <div className="flex flex-col gap-1 bg-white bg-opacity-60 rounded-xl p-3 shadow">
          <label htmlFor="host-trivia-time-limit" className=" text-gray-600">Trivia Time Limit (seconds)</label>
          <input
            id="host-trivia-time-limit"
            name="triviaTimeLimit"
            className="text-xl bg-white font-sans bg-opacity-70 font-bold border-2 border-gray-300 rounded-lg px-2 py-1 w-full"
            type="number"
            min={5}
            value={triviaTimeLimit}
            onChange={(e) => dispatch(setTriviaTimeLimit(Math.max(5, Number(e.target.value) || 5)))}
          />
        </div>
        <div className="flex justify-center">
          <MuteToggle />
        </div>
        <button
          className="w-full py-3 rounded-xl text-white font-titan text-xl bg-green-500 hover:bg-green-400 active:bg-green-600 shadow transition-colors"
          onClick={handleStart}
        >
          ▶ Start
        </button>
      </div>
    </div>
  );
};

const ScoreBoard = () => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const players = useAppSelector((state)=>state.players);
  const activePlayers = useAppSelector((state)=>state.game.activePlayers);
  const gameMode = useAppSelector((state)=>state.game.mode);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRound = useAppSelector((state)=>state.game.currentRound);
  const maxRounds = useAppSelector((state)=>state.game.maxRounds);
  const isPaused = useAppSelector((state)=>state.game.isPaused);
  const dispatch = useAppDispatch();
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);

  useEffect(()=>{
    const x = setInterval(()=>{
    if(scrollRef.current){
      if(scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
        scrollRef.current.scrollTo({top:12, behavior:'smooth'})
      }else{
        scrollRef.current.scrollBy({top: 170, behavior:'smooth'})
      }
    }}, 4000);
    return ()=>clearInterval(x);
  },[scrollRef])

  if (gameMode === GAME_MODE.REGISTRATION) {
    return <RegistrationPanel />;
  }

    return <div className="text-black gap-4 p-0 flex flex-col relative  h-full overflow-clip max-h-full rounded-xl bg-cover" style={{ height:'calc(100dvh - 32px)'}}>
      {deleteTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 rounded-xl">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 items-center min-w-[220px]">
            <img src={deleteTarget.image} className="w-14 h-14 rounded-full" />
            <div className="font-titan text-lg text-center">Remove <span className="text-red-600">{deleteTarget.name}</span>?</div>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                onClick={() => { dispatch(removePlayer({ playerId: deleteTarget.id })); setDeleteTarget(null); }}
              >
                Remove
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full bg-slate-200 left-0 rounded-xl top-0 mx-auto">
        <div className="flex w-full justify-between gap-1 px-2 py-2">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-24 h-24 shadow aspect-square flex items-center justify-center text-2xl font-titan text-center bg-white p-4 rounded-xl bg-opacity-50">
              Round <br/>
              {currentRound}/{maxRounds}
            </div>
            <div className="w-24 h-10 shadow flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
              <MuteToggle />
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-24 h-24 shadow font-mono flex-col aspect-square flex items-center justify-center bg-white p-4 rounded-xl bg-opacity-50">
              <div className="text-sm font-titan">Host ID</div>
              <div className="text-xl font-titan font-thin">{myShortId}</div>
            </div>
            <button
              className="w-24 h-10 shadow flex items-center justify-center rounded-xl text-white text-xl transition-colors"
              style={{ background: isPaused ? '#16a34a' : '#ca8a04' }}
              onClick={() => dispatch(isPaused ? resumeGame() : pauseGame())}
            >
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <QRShare className="w-24 h-24 shadow overflow-clip border-none bg-white"/>
            <button
              className="w-24 h-10 shadow flex items-center justify-center rounded-xl text-xl bg-red-700 hover:bg-red-600 transition-colors"
              onClick={() => { if (confirm('Restart the game?')) dispatch(restart()); }}
            >
              🔄
            </button>
          </div>
        </div>
      </div>
      <div 
        ref={scrollRef} 
        style={{
          background:`url(${bgImage})`, 
          backgroundPosition:'center',
        }} 
      className="scoreboardContainer flex flex-col py-1 px-1 rounded-xl top-8 gap-1 flex-1 min-h-0 overflow-auto">
        <Leaderboard
          players={players}
          activePlayers={activePlayers}
          itemClassName={(player) =>
            gameMode === GAME_MODE.MOVEMENT
              ? player.movesRemaining > 0 ? 'bg-blue-400' : 'bg-green-400'
              : undefined
          }
          onPlayerClick={isPaused ? (player) => setDeleteTarget(player) : undefined}
        />
      </div>
    </div>
}

export default ScoreBoard

// const ScoreBoard = () => {
//   const myShortId = usePeer((cv) => cv.myShortId) as string;
//   const players = useAppSelector((state)=>state.players);
//   const activePlayers = useAppSelector((state)=>state.game.activePlayers);
//   const gameMode = useAppSelector((state)=>state.game.mode);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const currentRound = useAppSelector((state)=>state.game.currentRound);
//   const maxRounds = useAppSelector((state)=>state.game.maxRounds);
//   const isPaused = useAppSelector((state)=>state.game.isPaused);
//   const dispatch = useAppDispatch();
//   useEffect(()=>{
//     const x = setInterval(()=>{
//     if(scrollRef.current){
//       if(scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
//         scrollRef.current.scrollTo({top:12, behavior:'smooth'})
//       }else{
//         scrollRef.current.scrollBy({top: 170, behavior:'smooth'})
//       }
//       // console.dir(scrollRef.current)
//     }}, 4000);
//     return ()=>clearInterval(x);
//   },[scrollRef])


//     return <div className="text-black gap-4 p-0 flex flex-col relative  h-full overflow-clip max-h-full rounded-xl bg-cover" style={{ height:'calc(100dvh - 32px)'}}>
//       <div className="flex flex-col  bg-slate-200 left-0 rounded-xl top-0 mx-auto">
//         <div className="flex w-full justify-center items-center">
//           <div className="w-32 flex items-center justify-center font-titan text-center text-2xl flex-col">
//             <div className="w-24 h-24 shadow aspect-square flex items-center justify-center text-2xl bg-white p-4 rounded-xl bg-opacity-50">
//               Round <br/>
//               {currentRound}/{maxRounds}
//             </div>
//           </div>
//           <div className="w-32 flex items-center justify-center font-bold">
//             <div className="w-24 shadow h-24 font-mono flex-col text-4xl aspect-square flex items-center justify-center bg-white p-4 rounded-xl bg-opacity-50">
//               <div className="text-sm font-titan">Host ID</div>
//               <div className="text-xl font-titan font-thin">{myShortId}</div>
//             </div>
//           </div>
//           <div className="flex-col w-min items-center justify-center">
//             <QRShare className="w-24 h-24 shadow left-0 overflow-clip flex-shrink border-none bg-white"/>
//           </div>
//         </div>
//         <div className="flex w-full gap-1 px-2 pb-2 pt-1 justify-center">
//           <div className="w-24 h-10 shadow flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
//             <MuteToggle />
//           </div>
//           <button
//             className="w-24 h-10 shadow flex items-center justify-center rounded-xl text-white text-xl transition-colors"
//             style={{ background: isPaused ? '#16a34a' : '#ca8a04' }}
//             onClick={() => dispatch(isPaused ? resumeGame() : pauseGame())}
//           >
//             {isPaused ? '▶' : '⏸'}
//           </button>
//           <button
//             className="w-24 h-10 shadow flex items-center justify-center rounded-xl text-xl bg-red-700 hover:bg-red-600 transition-colors"
//             onClick={() => { if (confirm('Restart the game?')) dispatch(restart()); }}
//           >
//             🔄
//           </button>
//         </div>
//       </div>
//       <div 
//         ref={scrollRef} 
//         style={{
//           background:`url(${bgImage})`, 
//           backgroundPosition:'center',
//         }} 
//       className="scoreboardContainer flex flex-col py-1 px-1 rounded-xl top-8 gap-1 flex-1 min-h-0 overflow-auto">
//         <Leaderboard
//           players={players}
//           activePlayers={activePlayers}
//           itemClassName={(player) =>
//             gameMode === GAME_MODE.MOVEMENT
//               ? player.movesRemaining > 0 ? 'bg-blue-400' : 'bg-green-400'
//               : undefined
//           }
//         />
//       </div>
//     </div>
// }

// export default ScoreBoard