import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { router } from "./route";

function App() {
  return (
    <div className="">
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            success: {
              iconTheme: { primary: "#FBC052", secondary: "#1a1a1a" },
            },
          }}
        />
    </div>
  );
}

export default App;
