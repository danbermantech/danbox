import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import { PeerContextProvider } from "../contexts/PeerContext";
import { RouterProvider } from "react-router-dom";
const HostPage = lazy(async()=>await import("./host/Page"));
const PlayPage = lazy(async()=>await import("./play/Page"));
const AdminPage = lazy(async()=>await import("./admin/Page"));
const PlayLayout = lazy(async()=>await import("./play/Layout"));
const HostLayout = lazy(async()=>await import("./host/Layout"));
const AdminLayout = lazy(async()=>await import("./admin/Layout"));
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div className="w-screen mx-auto my-auto h-screen min-w-full min-h-full bg-red-400 animate-pulse flex justify-center place-items-center items-center content-center"><div className="mx-auto h-min content-center my-auto text-center text-8xl font-extrabold">Loading...</div></div>}>
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



function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
