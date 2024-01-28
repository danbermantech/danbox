import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import { useEffect } from "react";
import HostStateManager from "../../components/HostStateManager";
import { AudioPlayerContextProvider } from "$contexts/AudioPlayerContext";

const Layout = (): React.ReactNode => {
  const initialize = usePeer((cv) => cv.initialize) as () => void;

  useEffect(() => {
    if (!initialize) return;
    initialize();
  },[initialize]);

  return (
    <div>
      <AudioPlayerContextProvider>
        <HostStateManager />
        <Outlet />
      </AudioPlayerContextProvider>
    </div>
  );
};

export default Layout;
