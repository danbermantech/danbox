import ReactDOM from "react-dom/client";
import "./assets/index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { SpeedInsights } from "@vercel/speed-insights/react"
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
    <SpeedInsights />
  </Provider>,
  // </React.StrictMode>
);
