import { useDispatch, useSelector } from 'react-redux';
import { GAME_MODE, StoreData } from '$store/types';
import { lazy } from 'react';
import Implore from './Implore';
import { setGameMode } from '$store/slices/gameProgressSlice';
const Slots = lazy(async () => await import('$components/Slots'));
const RegistrationScreen = lazy(
  async () => await import('$components/RegistrationScreen'),
);
const GameOverScreen = lazy(
  async () => await import('$components/GameOverScreen'),
);
const Trivia = lazy(async () => await import('$components/Trivia'));
const Shop = lazy(async () => await import('$components/Shop'));
const GetAssetScreen = lazy(async () => await import('./GetAssetScreen'));
const LoseAssetScreen = lazy(async () => await import('./LoseAssetScreen'));
const Duel = lazy(async () => await import('./Duel'));
const Frenzy = lazy(async () => await import('./pixi/Frenzy'));
const PixiHost = lazy(async () => await import('./pixi/PixiHost'));
const Rest = lazy(async () => await import('./Rest'));

const MainGame = () => {
  const mode = useSelector((state: StoreData) => state.game.mode);
  const restScreenKey = useSelector(
    (state: StoreData) =>
      `${state.game.currentRound}-${state.game.queuedActions.length}-${state.game.activePlayers.join(',')}`,
  );
  const playerCount = useSelector(
    (state: StoreData) => Object.keys(state.players).length,
  );
  const dispatch = useDispatch()
  if (mode == GAME_MODE.RANDOM) {
    const newMode = [
        GAME_MODE.SLOTS,
        GAME_MODE.TRIVIA,
        GAME_MODE.SHOP,
        GAME_MODE.DUEL,
        GAME_MODE.FRENZY,
        GAME_MODE.SLOTS,
        GAME_MODE.GET_ASSET,
        GAME_MODE.LOSE_ASSET,
        GAME_MODE.REST,
      ][Math.floor(Math.random() * 9)]
      console.log({newMode})
    dispatch(setGameMode(
      newMode
    ));
  }

  switch (mode) {
    case GAME_MODE.MOVEMENT:
      return <PixiHost />;
    case GAME_MODE.REGISTRATION:
      return <RegistrationScreen />;
    case GAME_MODE.GAME_OVER:
    case GAME_MODE.END:
      return <GameOverScreen />;
    case GAME_MODE.SLOTS:
      return <Slots />;
    case GAME_MODE.TRIVIA:
      return <Trivia />;
    case GAME_MODE.SHOP:
      return <Shop />;
    case GAME_MODE.HOME:
    case GAME_MODE.GET_ASSET:
      return <GetAssetScreen />;
    case GAME_MODE.LOSE_ASSET:
      return <LoseAssetScreen />;
    case GAME_MODE.DUEL:
      if (playerCount < 3) return <Trivia />;
      return <Duel />;
    case GAME_MODE.REST:
      return <Rest key={restScreenKey} />;
    case GAME_MODE.FRENZY:
      return <Frenzy {...(playerCount == 1 ? { points: 1, gold: 0 } : {})} />;
    case GAME_MODE.IMPLORE:
      return <Implore />;
    default:
      return <PixiHost />;
  }
};

export default MainGame;
