import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { usePeer } from '../hooks/usePeer';


const ClientStateManager = () =>{
  const statev = useSelector((state)=>state);
  const dispatch = useDispatch();
  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (cb:(value: {payload:unknown}) => void)=>void

  const [state, setState] = useState({});
  useEffect(()=>{
    // console.log(onDataReceived)
    onDataReceived && onDataReceived((data)=>{
      console.log(data); 
      setState(data); 
    })
  },[onDataReceived, dispatch])

  return (
    <div>
      <h1>ClientStateManager</h1>
      <pre>
        {JSON.stringify(statev, null, 2)}
      </pre>
    </div>
  )

}

export default ClientStateManager;