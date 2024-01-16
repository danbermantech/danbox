import { useSelector } from "react-redux";
import RandomAssetChange from "$components/RandomAssetChange";
import RegistrationScreen from "$components/RegistrationScreen";
import GameOverScreen from "$components/GameOverScreen";
import Trivia from "$components/Trivia";
import { StoreData } from "$store/types";
import Shop from "$components/Shop";

const ModalContents = () =>{
  const content = useSelector((state:StoreData)=>state.game.modalContent);
  const mode = useSelector((state:StoreData)=>state.game.mode);
  
  switch(mode){
    case 'REGISTRATION':
      return <RegistrationScreen />
    case 'GAME_OVER':
      return <GameOverScreen />
    case 'MINIGAME':
      switch(content){
        case 'RANDOM_ASSET_CHANGE':
          return <RandomAssetChange  />
        case 'TRIVIA':
          return <Trivia />
        case 'SHOP':
          return <Shop />
        default:
          return null;
      }
    default:
      null
  }
  return null;
}

export default ModalContents