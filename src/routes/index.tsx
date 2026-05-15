import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
  type LoaderFunctionArgs,
} from 'react-router';
import { PeerContextProvider } from '../contexts/PeerContext';
// import Logo from "$components/Logo";
import DefaultSuspense from '$components/DefaultSuspense';
const HostPage = lazy(async () => await import('./host/Page'));
const PlayPage = lazy(async () => await import('./play/Page'));
const AdminPage = lazy(async () => await import('./admin/Page'));
const PlayLayout = lazy(async () => await import('./play/Layout'));
const HostLayout = lazy(async () => await import('./host/Layout'));
const AdminLayout = lazy(async () => await import('./admin/Layout'));
const DesignerPage = lazy(async () => await import('./designer/Page'));
const Home = lazy(async () => await import('./Home'));
const NotFound = lazy(async () => await import('./NotFound'));
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<DefaultSuspense />}>
        <PeerContextProvider>
          <Outlet />
        </PeerContextProvider>
      </Suspense>
    ),
    children: [
      {
        index: true,
        // loader: () => redirect('/play')
        element: <Home />,
      },
      {
        path: '/host',
        element: <HostLayout />,
        children: [{ index: true, element: <HostPage /> }],
      },
      {
        path: '/play',
        element: <PlayLayout />,
        children: [{ index: true, element: <PlayPage /> }],
      },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminPage /> }],
      },
      {
        path: '/designer',
        element: <DesignerPage />,
      },
      {
        path: '/j/:host_id',
        loader: ({ params }: LoaderFunctionArgs) =>
          redirect(`/play?hostId=${params.host_id}`),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
