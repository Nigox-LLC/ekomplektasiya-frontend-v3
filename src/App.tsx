import React, { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import {
  EmployeeStatistics,
  GenStatistics,
  Login,
  Calendar,
  LettersPage,
  Dashboard,
  UsersManagement,
  ProductManagement,
  TurnoverReport,
  GoodsBalanceReport,
  ReportTableOne,
  ReferenceRequisites,
  Contracts,
  GoodsIn,
  GoodsOut,
  WareHouseTransfer,
  YearPlan,
  Bank,
  AppealLetter,
  Statistics,
  PriceAnalysis,
  CreatePriceAnalysis,
} from "@/pages";
import NewDocumentProduct from "./pages/NewDocument/NewDocumentProduct/NewDocumentProduct";

const App: React.FC = () => {
  const hasAccess = () => {
    return true;
  };

  const [currentUser, setCurrentUser] = useState({
    username: "",
    fullName: "",
    permissions: [] as string[],
  });
  const [userRole, setUserRole] = useState<
    "admin" | "manager" | "technical" | "employee"
  >("employee");

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
              path: "dashboard-main",
              element: (
                <Dashboard
                  userName={currentUser.fullName}
                  userPosition={
                    userRole === "admin"
                      ? "Administrator"
                      : userRole === "manager"
                        ? "Menejer"
                        : userRole === "technical"
                          ? "Texnik mutaxassis"
                          : "Xodim"
                  }
                />
              ),
            },
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
          path: "appeal-letter",
          element: <AppealLetter />,
        },
        {
          path: "price-analysis",
          element: <Outlet />,
          children: [
            { index: true, element: <PriceAnalysis /> },
            { path: "create", element: <CreatePriceAnalysis /> },
          ],
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
          path: "users-management",
          element: <UsersManagement />,
        },
        {
          path: "product-management",
          element: <ProductManagement />,
        },
        {
          path: "reports",
          element: <Outlet />,
          children: [
            {
              path: "reports-turnover",
              element: <TurnoverReport />,
            },
            {
              path: "reports-goods-balance",
              element: <GoodsBalanceReport />,
            },
            {
              path: "reports-table1",
              element: <ReportTableOne />,
            },
            {
              path: "reports-table2",
              element: <ReportTableOne />,
            },
            {
              path: "reports-table3",
              element: <ReportTableOne />,
            },
          ],
        },
        {
          path: "reference",
          element: <Outlet />,
          children: [
            // Rekvizitlar
            { path: "reference-requisites", element: <ReferenceRequisites /> },
            // Banklar
            { path: "reference-bank", element: <Bank /> },
            // Shartnomalar
            { path: "reference-contracts", element: <Contracts /> },
            // Tovarlar kirimi
            { path: "reference-goods-in", element: <GoodsIn /> },
            // Tovarlar chiqimi
            { path: "reference-goods-out", element: <GoodsOut /> },
            // Ombor o'tkazmalar
            {
              path: "reference-warehouse-transfer",
              element: <WareHouseTransfer />,
            },
            // Yillik reja
            { path: "reference-year-plan", element: <YearPlan /> },
          ],
        },
        {
          path: "statistics",
          element: <Outlet />,
          children: [
            {
              path: "statistics-employee",
              element: <Statistics />,
            },
          ],
        },
        {
          path: "new-document/:type",
          element: <NewDocumentProduct />,
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
