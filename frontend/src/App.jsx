import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Result from "../pages/Result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/results",
    element: <Result />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
