import { useEffect } from 'react';
import { useAppSelector } from '$store/hooks';
import {
  GAME_MODE,
  type GameState,
  type Players,
  type Board,
} from '$store/types';

const BACKUP_KEY = 'danbox_game_backup';

type GameBackup = {
  game: GameState;
  players: Players;
  board: Board;
  savedAt: number;
};

export function saveGameBackup(state: {
  game: GameState;
  players: Players;
  board: Board;
}) {
  try {
    const backup: GameBackup = { ...state, savedAt: Date.now() };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  } catch {
    // localStorage may be unavailable or full
  }
}

export function clearGameBackup() {
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch {
    // ignore
  }
}

export function loadGameBackup(): GameBackup | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameBackup;
  } catch {
    return null;
  }
}

const useGameBackup = () => {
  const game = useAppSelector((state) => state.game);
  const players = useAppSelector((state) => state.players);
  const board = useAppSelector((state) => state.board);

  // Save to localStorage each time a new round begins (i.e., the previous round just ended)
  useEffect(() => {
    if (game.currentRound > 0 && game.mode === GAME_MODE.MOVEMENT) {
      saveGameBackup({ game, players, board });
    }
    // Only re-run when the round number or mode changes, not on every state mutation
  }, [game, players, board]);

  // Clear the backup once the game finishes normally so we don't offer a stale restore
  useEffect(() => {
    if (game.mode === GAME_MODE.GAME_OVER) {
      clearGameBackup();
    }
  }, [game.mode]);
};

export default useGameBackup;
