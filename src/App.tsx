import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App(): React.ReactNode {
  return <RouterProvider router={router} />;
}

export default App;
