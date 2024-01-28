// import { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import SignUp from "$components/SignUp";
// import useMe from "$hooks/useMe";
import PlayerHeader from "$components/PlayerHeader";
import PlayerItemControls from "$components/PlayerItemControls";
const Layout = (): React.ReactNode => {
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;
  // const me = useMe();
  // const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
  //   value: { type: string; payload: { playerId: string; action: string, value: string }},
  // ) => void;


  return (
    <div className="h-screen flex flex-col">
      <PlayerHeader />
      <div className="flex flex-grow pt-12">
      {peerConnected ? <Outlet /> : <SignUp />}
      </div>
      <PlayerItemControls />
    </div>
  );
};

export default Layout;
