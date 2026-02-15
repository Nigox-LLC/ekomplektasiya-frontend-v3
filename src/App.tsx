import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import { EmployeeStatistics, LettersPage, Login } from "@/pages";

const App: React.FC = () => {
  const hasAccess = () => {
    return true;
  };

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
              element: <></>,
            },
          ],
        },
        {
          path: "incoming",
          element: <Outlet />,
          children: [
            {
              path: ":status",
              element: <LettersPage />,
            },
          ],
        },
        {
          path: "outgoing",
          element: <Outlet />,
          children: [
            {
              path: ":status",
              element: <LettersPage />,
            },
          ],
        },
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
