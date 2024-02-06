import { Suspense, lazy } from "react";
const ReduxProvider = lazy(async()=>await import("$contexts/ReduxProvider"));
// import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
const Router = lazy(async()=>await import("./routes"));
function App(){
  return (
  <Suspense fallback={<div className="w-screen mx-auto my-auto h-screen min-w-full min-h-full bg-red-400 animate-pulse flex justify-center place-items-center items-center content-center"><div className="mx-auto content-center my-auto text-center text-8xl font-extrabold">Loading...</div></div>}>
    <ReduxProvider>
      <Suspense fallback={<div className="w-screen mx-auto my-auto h-screen min-w-full min-h-full bg-red-400 animate-pulse flex justify-center place-items-center items-center content-center"><div className="mx-auto content-center my-auto text-center text-8xl font-extrabold">Loading...</div></div>}>
        <Router/>
      </Suspense>
    </ReduxProvider>
    <SpeedInsights />
  </Suspense>)
}

export default App;
