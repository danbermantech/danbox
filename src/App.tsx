import { Suspense, lazy } from "react";
const ReduxProvider = lazy(async()=>await import("$contexts/ReduxProvider"));
// import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
// import Logo from "$components/Logo";
import DefaultSuspense from "$components/DefaultSuspense";
const Router = lazy(async()=>await import("./routes"));
function App(){
  return (
  <Suspense fallback={<DefaultSuspense />}>
    <ReduxProvider>
      <Suspense fallback={<DefaultSuspense />}>
        <Router/>
      </Suspense>
    </ReduxProvider>
    <SpeedInsights />
  </Suspense>)
}

export default App;
