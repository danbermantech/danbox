import { useSelector } from "react-redux";
import RandomAssetChange from "$components/RandomAssetChange";
import RegistrationScreen from "$components/RegistrationScreen";
import GameOverScreen from "$components/GameOverScreen";
import Trivia from "$components/Trivia";
import { ModalContent, StoreData } from "$store/types";
import Shop from "$components/Shop";
import GetAssetScreen from "./GetAssetScreen";
import LoseAssetScreen from './LoseAssetScreen'
import Duel from "./Duel";
import Frenzy from "./pixi/Frenzy";
import PixiHost from "./pixi/PixiHost";
// import Pursuit from "./pixi/Pursuit";

const ModalContents = () =>{
  const content = useSelector((state:StoreData)=>state.game.modalContent);
  const mode = useSelector((state:StoreData)=>state.game.mode);
  
  switch(mode){
    case 'MOVEMENT':
      return <PixiHost />
    case 'REGISTRATION':
      return <RegistrationScreen />
    case 'GAME_OVER':
      return <GameOverScreen />
    case 'MINIGAME':
      switch(content){
        case ModalContent.RANDOM_ASSET_CHANGE:
          return <RandomAssetChange  />
        case ModalContent.TRIVIA:
          return <Trivia />
        case ModalContent.SHOP:
          return <Shop />
        case ModalContent.GET_ASSET:
          return <GetAssetScreen />
        case ModalContent.LOSE_ASSET:
          return <LoseAssetScreen />
        case ModalContent.DUEL:
          return <Duel />
        case ModalContent.FRENZY:
          return <Frenzy />
        default:
          return <PixiHost />;
      }
    default:
      null
  }
  return null;
}

export default ModalContents