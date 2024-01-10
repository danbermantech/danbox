import { Outlet } from 'react-router-dom'
import { usePeer } from '../../hooks/usePeer'
import { useCallback } from 'react'

const Layout = (): React.ReactNode => {
  const initialize = usePeer((cv)=>(cv.initialize)) as ()=>void;
  const myPeerId = usePeer((cv)=>cv.myPeerId) as string;

  const handleInitialize = useCallback(()=>{
    if(initialize)initialize();
  },[initialize])

  return (
    <div>
      <h1>HOST</h1>
      <button type="button" onClick={()=>{handleInitialize()}}>Initialize</button>
      {myPeerId ? <p>My Peer ID: {myPeerId}</p> : null}
      <Outlet />
    </div>
  )
}

export default Layout
