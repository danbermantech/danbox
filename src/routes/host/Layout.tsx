import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import { useEffect } from "react";
import HostStateManager from "../../components/HostStateManager";
import RestoreGamePrompt from "../../components/RestoreGamePrompt";
import { AudioPlayerContextProvider } from "$contexts/AudioPlayerContext";

const Layout = (): React.ReactNode => {
  const initialize = usePeer((cv) => cv.initialize) as () => void;

  useEffect(() => {
    if (!initialize) return;
    initialize();
  },[initialize]);

  return (
    <>
      <AudioPlayerContextProvider>
        <HostStateManager />
        <RestoreGamePrompt />
        <Outlet />
      </AudioPlayerContextProvider>
    </>
  );
};

export default Layout;
