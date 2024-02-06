import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import("./assets/index.css");
import { Provider } from "react-redux";
import store from "./store";
import { SpeedInsights } from "@vercel/speed-insights/react"
const App = lazy(async()=>await import( "./App"));
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Suspense fallback={<div className="w-screen mx-auto my-auto h-screen min-w-full min-h-full bg-red-400 animate-pulse flex justify-center place-items-center items-center content-center"><div className="mx-auto content-center my-auto text-center text-8xl font-extrabold">Loading...</div></div>}>
  <Provider store={store}>
    <App />
    <SpeedInsights />
  </Provider>
  </Suspense>
  // </React.StrictMode>
);
