import { useSelector } from "react-redux";
import { GAME_MODE, StoreData } from "$store/types";
import { lazy } from "react";
const RandomAssetChange = lazy(async()=>await import("$components/RandomAssetChange"));
const RegistrationScreen = lazy(async()=>await import("$components/RegistrationScreen"));
const GameOverScreen = lazy(async()=>await import("$components/GameOverScreen"));
const Trivia = lazy(async()=>await import("$components/Trivia"));
const Shop = lazy(async()=>await import("$components/Shop"));
const GetAssetScreen = lazy(async()=>await import("./GetAssetScreen"));
const LoseAssetScreen = lazy(async()=>await import('./LoseAssetScreen'));
const Duel = lazy(async()=>await import("./Duel"));
const Frenzy = lazy(async()=>await import("./pixi/Frenzy"));
const PixiHost = lazy(async()=>await import("./pixi/PixiHost"));
// import Pursuit from "./pixi/Pursuit";

const MainGame = () =>{
  const mode = useSelector((state:StoreData)=>state.game.mode);
  
  switch(mode){
    case GAME_MODE.MOVEMENT:
      return <PixiHost />
    case GAME_MODE.REGISTRATION:
      return <RegistrationScreen />
    case GAME_MODE.GAME_OVER:
      return <GameOverScreen />
    case GAME_MODE.RANDOM_ASSET_CHANGE:
      return <RandomAssetChange  />
    case GAME_MODE.TRIVIA:
      return <Trivia />
    case GAME_MODE.SHOP:
      return <Shop />
    case GAME_MODE.GET_ASSET:
      return <GetAssetScreen />
    case GAME_MODE.LOSE_ASSET:
      return <LoseAssetScreen />
    case GAME_MODE.DUEL:
      return <Duel />
    case GAME_MODE.FRENZY:
      return <Frenzy />
    default:
      return <PixiHost />;
  }
}

export default MainGame