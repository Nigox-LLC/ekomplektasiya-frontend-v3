import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import { EmployeeStatistics, Login } from "@/pages";

const App: React.FC = () => {

  const hasAccess = () => {
    return true;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Outlet />,
          children: [
            {
              path: "employee-statistics",
              element: <EmployeeStatistics hasAccess={hasAccess} />,
            },
            {
              path: "general-statistics",
              // Umumiy statistika sahifasi uchun element qo'shish
              element: <></>
            }
          ]
        }
      ],
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
