import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import SignUp from "$components/SignUp";
import PlayerHeader from "$components/PlayerHeader";
import PlayerItemControls from "$components/PlayerItemControls";
import ClientStateManager from "$components/ClientStateManager";

const Layout = (): React.ReactNode => {
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;

  return (
    <div className="h-screen flex flex-col">
      <ClientStateManager />
      <PlayerHeader />
      <div className="flex flex-grow pt-12">
      {peerConnected ? <Outlet /> : <SignUp />}
      </div>
      {peerConnected == true && <PlayerItemControls />}
    </div>
  );
};

export default Layout;
