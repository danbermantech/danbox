import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import { Suspense, lazy } from "react";
import PlayerHeader from "$components/PlayerHeader";
import PlayerItemControls from "$components/PlayerItemControls";
import ClientStateManager from "$components/ClientStateManager";
const SignUp = lazy(async()=>await import("$components/SignUp"));

const Layout = (): React.ReactNode => {
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;

  return (
    <div className="h-screen flex flex-col">
      <ClientStateManager />
      <PlayerHeader />
      <div className="flex flex-grow pt-12">
        <Suspense fallback={<div className="p-8 min-w-24 bg-blue-500 rounded-full animate-pulse"></div>}>
      {peerConnected ? <Outlet /> : <SignUp />}
      </Suspense>
      </div>
      {peerConnected == true && <PlayerItemControls />}
    </div>
  );
};

export default Layout;
