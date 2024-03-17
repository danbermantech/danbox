import { Suspense, lazy } from "react";
const ReduxProvider = lazy(async()=>await import("$contexts/ReduxProvider"));
// import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Logo from "$components/Logo";
const Router = lazy(async()=>await import("./routes"));
function App(){
  return (
  <Suspense fallback={<Logo />}>
    <ReduxProvider>
      <Suspense fallback={<Logo />}>
        <Router/>
      </Suspense>
    </ReduxProvider>
    <SpeedInsights />
  </Suspense>)
}

export default App;
