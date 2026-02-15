import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import {
  EmployeeStatistics,
  GenStatistics,
  Login,
  Calendar,
  LettersPage,
  ReferenceRequisites,
  Contracts,
  GoodsIn,
  GoodsOut,
  WareHouseTransfer,
  YearPlan,
} from "@/pages";
import PriceAnalysis from "./PriceAnaliysis/PriceAnalysis";
import Bank from "./pages/Reference/Bank/Bank";

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
        {
          path: "reference",
          element: <Outlet />,
          children: [
            // Rekvizitlar
            { path: "reference-requisites",
              element: <ReferenceRequisites />
            },
            // Banklar
            { path: "reference-bank",
              element: <Bank />
            },
            // Shartnomalar
            { path: "reference-contracts",
              element: <Contracts />
            },
            // Tovarlar kirimi
            { path: "reference-goods-in",
              element: <GoodsIn />
            },
            // Tovarlar chiqimi
            { path: "reference-goods-out",
              element: <GoodsOut />
            },
            // Ombor o'tkazmalar
            { path: "reference-warehouse-transfer",
              element: <WareHouseTransfer />
            },
            // Yillik reja
            { path: "reference-year-plan",
              element: <YearPlan />
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
