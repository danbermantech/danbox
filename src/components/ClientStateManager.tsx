import { useEffect } from 'react';
import { useDispatch} from 'react-redux'
import setState from '../store/actions/setState';
import { usePeer } from '../hooks/usePeer';
import { StoreData } from '../store/types';


const ClientStateManager = () =>{
  // const state = useSelector((state:StoreData)=>state.game);
  const dispatch = useDispatch();
  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (cb:(value: {type: string, payload:{value:StoreData}}) => void, id:string)=>void
  const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void
  useEffect(()=>{
    onDataReceived && onDataReceived((data)=>{
      console.log(data); 
      console.log(data.payload)
      if(data.type == 'state' && data.payload){
        dispatch(setState(data.payload.value))
      }
    }, 'clientListener');
    return ()=>{removeOnDataReceivedListener('clientListener')};
  },[onDataReceived, dispatch, removeOnDataReceivedListener])
  return null
  // return (
  //   <div>
  //     <h1>ClientStateManager</h1>
  //     <pre>
  //       {JSON.stringify(state, null, 2)}
  //     </pre>
  //   </div>
  // )

}

export default ClientStateManager;