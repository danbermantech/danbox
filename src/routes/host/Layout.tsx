import { Outlet } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import { useEffect } from "react";
import HostStateManager from "../../components/HostStateManager";
// import { CopyAllRounded } from "@mui/icons-material";

const Layout = (): React.ReactNode => {
  const initialize = usePeer((cv) => cv.initialize) as () => void;
  // const myPeerId = usePeer((cv) => cv.myPeerId) as string;

  useEffect(() => {
    if (!initialize) return;
    initialize();
  },[initialize]);

  return (
    <div>
      {/* <h1>HOST</h1> */}
      <HostStateManager />
      <Outlet />
    </div>
  );
};

export default Layout;
