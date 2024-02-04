import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import SignUp from "$components/SignUp";
import PlayerItemControls from "$components/PlayerItemControls";
import ClientStateManager from "$components/ClientStateManager";
import AdminHeader from "$components/AdminHeader";

const Layout = (): React.ReactNode => {
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;

  return (
    <div className="h-screen flex flex-col">
      <ClientStateManager />
      <AdminHeader />
      <div className="flex flex-grow pt-12">
      {peerConnected ? <Outlet /> : <SignUp />}
      </div>
      {peerConnected == true && <PlayerItemControls />}
    </div>
  );
};

export default Layout;
