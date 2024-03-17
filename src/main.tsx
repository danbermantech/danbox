import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import("./assets/index.css");
import { Provider } from "react-redux";
import store from "./store";
import { SpeedInsights } from "@vercel/speed-insights/react"
import Logo from "$components/Logo";
const App = lazy(async()=>await import( "./App"));
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Suspense fallback={<Logo />}>
  <Provider store={store}>
    <App />
    <SpeedInsights />
  </Provider>
  </Suspense>
  // </React.StrictMode>
);
