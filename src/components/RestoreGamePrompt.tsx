import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '$store/hooks';
import setState from '$store/actions/setState';
import { GAME_MODE } from '$store/types';
import { loadGameBackup, clearGameBackup } from '$hooks/useGameBackup';
import { usePeer } from '$hooks/usePeer';

const RestoreGamePrompt = () => {
  const [backup, setBackup] = useState<ReturnType<typeof loadGameBackup>>(null);
  const setAllowClientMessages = usePeer((cv) => cv.setAllowClientMessages) as (value: boolean) => void;
  const currentMode = useAppSelector((state) => state.game.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only show when we're at a fresh registration screen
    if (currentMode !== GAME_MODE.REGISTRATION) return;
    const saved = loadGameBackup();
    // Offer restore only for in-progress games (not finished, not pre-game)
    if (
      saved &&
      saved.game?.currentRound > 0 &&
      saved.game?.mode !== GAME_MODE.GAME_OVER &&
      saved.game?.mode !== GAME_MODE.REGISTRATION
    ) {
      setBackup(saved);
      setAllowClientMessages(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!backup) return null;

  const handleRestore = () => {
    dispatch(setState({ game: backup.game, players: backup.players, board: backup.board }));
    setBackup(null);
    setAllowClientMessages(true);
  };

  const handleDiscard = () => {
    clearGameBackup();
    setBackup(null);
    setAllowClientMessages(true);
  };

  const savedDate = new Date(backup.savedAt).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Restore Previous Game?</h2>
        <p className="text-gray-600 mb-1">
          A game was interrupted on{' '}
          <span className="font-semibold">
            round {backup.game.currentRound} of {backup.game.maxRounds}
          </span>{' '}
          with{' '}
          <span className="font-semibold">{backup.players.length} player{backup.players.length !== 1 ? 's' : ''}</span>.
        </p>
        <p className="text-gray-400 text-sm mb-6">Saved {savedDate}</p>
        <div className="flex gap-3">
          <button
            onClick={handleRestore}
            className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-600 active:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Restore Game
          </button>
          <button
            onClick={handleDiscard}
            className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreGamePrompt;
