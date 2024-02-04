import { Suspense } from "react";
import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import HostPage from "./host/Page";
import PlayPage from "./play/Page";
import AdminPage from "./admin/Page";
import PlayLayout from "./play/Layout";
import HostLayout from "./host/Layout";
import AdminLayout from "./admin/Layout";
import { PeerContextProvider } from "../contexts/PeerContext";
const router = createBrowserRouter([
  {
    path: "/",
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
      { index: true, loader: () => redirect("/play") },
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
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminPage /> }]
      }
    ],
  },
]);

export default router;
