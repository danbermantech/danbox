import {useState, useCallback} from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { usePeer } from '../../hooks/usePeer';

const Layout = (): React.ReactNode => {

  const [searchParams] = useSearchParams();

  const [hostId] = useState(searchParams.get('hostId'));
  const connect = usePeer((cv)=>(cv.connect)) as (hostId:string, onPeerConnect: (peer: unknown) => void) => void;
  const [connected, setConnected] = useState(false);

  const join = useCallback(()=>{
    if (typeof connect == 'function' && hostId && !connected) {
      // onPeerConnect(console.log);
      connect(hostId,(x)=>{console.log(x)} );
      setConnected(()=>true);
    }
  },[connect, hostId, connected]);

  return (
    <div>
      <h1>CLIENT</h1>
      <button onClick={join}>Join</button>
      <Outlet />
    </div>
  )
}

export default Layout
