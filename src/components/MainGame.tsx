import { useSelector } from "react-redux";
import RandomAssetChange from "$components/RandomAssetChange";
import RegistrationScreen from "$components/RegistrationScreen";
import GameOverScreen from "$components/GameOverScreen";
import Trivia from "$components/Trivia";
import { GAME_MODE, StoreData } from "$store/types";
import Shop from "$components/Shop";
import GetAssetScreen from "./GetAssetScreen";
import LoseAssetScreen from './LoseAssetScreen'
import Duel from "./Duel";
import Frenzy from "./pixi/Frenzy";
import PixiHost from "./pixi/PixiHost";
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