import { useDispatch} from 'react-redux'
import setState from '../store/actions/setState';
import usePeerDataReceived from '$hooks/useDataReceived';
import { StoreData } from '$store/types';
import { setBoardLayout } from '$store/slices/boardSlice';
import { setGameState } from '$store/slices/gameProgressSlice';
import { setPlayers } from '$store/slices/playerSlice';


const ClientStateManager = () =>{
  const dispatch = useDispatch();

  usePeerDataReceived<{value: StoreData}>((data)=>{
      dispatch(setState(data.payload.value))
  }, 'state')

  usePeerDataReceived<{value: StoreData['board']}>((data)=>{
      dispatch(setBoardLayout(data.payload.value))
  }, 'board');

  usePeerDataReceived<{value: StoreData['game']}>((data)=>{
      dispatch(setGameState(data.payload.value))
  }, 'game');

  usePeerDataReceived<{value: StoreData['players']}>((data)=>{
      dispatch(setPlayers(data.payload.value))
  }, 'players');

  return null;

}

export default ClientStateManager;