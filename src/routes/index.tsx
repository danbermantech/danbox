import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { PeerContextProvider } from "../contexts/PeerContext";
import { RouterProvider } from "react-router-dom";
// import Logo from "$components/Logo";
import DefaultSuspense from "$components/DefaultSuspense";
const HostPage = lazy(async()=>await import("./host/Page"));
const PlayPage = lazy(async()=>await import("./play/Page"));
const AdminPage = lazy(async()=>await import("./admin/Page"));
const PlayLayout = lazy(async()=>await import("./play/Layout"));
const HostLayout = lazy(async()=>await import("./host/Layout"));
const AdminLayout = lazy(async()=>await import("./admin/Layout"));
const Home = lazy(async()=>await import("./Home"));
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<DefaultSuspense />}>
        <PeerContextProvider>
          <div>
            {/* <h1>DanBox</h1> */}
            <Outlet />
          </div>
        </PeerContextProvider>
      </Suspense>
    ),
    children: [
      { index: true, 
        // loader: () => redirect("/play") 
        element: <Home />
      },
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
