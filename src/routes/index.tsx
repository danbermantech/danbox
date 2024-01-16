import { Suspense } from "react";
import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import HostPage from "./host/Page";
import PlayPage from "./play/Page";
import PlayLayout from "./play/Layout";
import HostLayout from "./host/Layout";
import { PeerContextProvider } from "../contexts/PeerContext";
import { getCookie, setCookie } from "../utilities/cookies";
import {v4 as uuidv4} from "uuid"
const router = createBrowserRouter([
  {
    path: "/",
    loader:async()=>{
      const deviceId = getCookie("deviceId");
      if(!deviceId) {
        setCookie("deviceId", uuidv4(), 365);
      }
      console.log(deviceId)
      return null;
    },
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PeerContextProvider>
          <div>
            {/* <h1>DanBox</h1> */}
            <Outlet />
          </div>
        </PeerContextProvider>
      </Suspense>
    ),
    children: [
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      { index: true, loader: () => redirect("/host") },
      {
        path: "/host",
        element: <HostLayout />,
        children: [{ index: true, element: <HostPage /> }],
      },
      {
        path: "/play",
        element: <PlayLayout />,
        children: [{ index: true, element: <PlayPage /> }],
      },
    ],
  },
]);

export default router;
