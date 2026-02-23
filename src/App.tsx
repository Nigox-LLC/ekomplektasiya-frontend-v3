import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import {
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
  CreateDocument,
} from "@/pages";
import NewDocumentProduct from "./pages/NewDocument/NewDocumentProduct/NewDocumentProduct";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const appLoading = true; // keep overlay until removed manually

  // NOTE: per request, keep the global loading overlay visible until
  // the code is manually removed. Do not auto-hide the overlay.

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
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
          path: "my_letter",
          element: <LettersPage />,
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
          element: <CreateDocument />,
        },
        {
          path: "test-new-document",
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
      <div className="relative">
        <RouterProvider router={router} />

        {/* Global loading overlay shown on app entry (blocks all interaction) */}
        {appLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white/95 border border-gray-200 p-6 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="text-lg font-semibold text-gray-800">Ma'lumotlar yuklanmoqda</div>
                {/* animation: pulsing rings + scaling percent */}
                <style>{`@keyframes scalePulse{0%{transform:scale(0.95);}50%{transform:scale(1.08);}100%{transform:scale(0.95);}} .scale-pulse{animation:scalePulse 1.6s ease-in-out infinite;}`}</style>
                <div className="relative flex items-center justify-center">
                  <span className="absolute block w-44 h-44 rounded-full bg-blue-200/40 animate-ping" />
                  <span className="absolute block w-52 h-52 rounded-full bg-blue-100/30" />
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                    <div className="text-5xl font-semibold text-blue-700 scale-pulse">72%</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">Iltimos kuting — dasturga ma'lumotlar to'liq yuklanmaguncha boshqa sahifalarga o'ta olmaysiz.</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
