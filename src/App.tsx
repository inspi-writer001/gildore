import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./route";

function App() {
  return (
    <div className="">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
