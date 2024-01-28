import { useDispatch} from 'react-redux'
import setState from '../store/actions/setState';
import usePeerDataReceived from '$hooks/useDataReceived';
import { StoreData } from '$store/types';


const ClientStateManager = () =>{
  const dispatch = useDispatch();

  usePeerDataReceived<{value: StoreData}>((data)=>{
      dispatch(setState(data.payload.value))
  }, 'state')

  return null;

}

export default ClientStateManager;