import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "@/components";
import { Login } from "@/pages";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [],
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
