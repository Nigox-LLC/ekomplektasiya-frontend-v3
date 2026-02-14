import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "@/components";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import { Login } from "@/pages";

const App: React.FC = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "about",
          element: <About />
        }
      ]
    },
    {
      path: "login",
      element: <Login />
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
