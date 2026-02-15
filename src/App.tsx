import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import {
  EmployeeStatistics,
  GenStatistics,
  Login,
  Calendar,
  LettersPage,
} from "@/pages";
import PriceAnalysis from "./PriceAnaliysis/PriceAnalysis";

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
              element: <GenStatistics hasAccess={hasAccess} />,
            },
          ],
        },
        {
          path: "price-analysis",
          element: <PriceAnalysis />,
        },
        {
          path: "calendar",
          element: <Calendar />,
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
