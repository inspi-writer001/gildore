import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./route";

function App() {
  return (
    <div className="gildore_landing flex flex-col w-full h-full overflow-hidden">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
