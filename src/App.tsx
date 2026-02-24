import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Layout } from "@/components";
import {
  Login,
  Calendar,
  LettersPage,
  Dashboard,
  UsersManagement,
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
  PriceAnalysisForm,
  PriceAnalysisDetail,
  NewDocumentProduct,
  ProductsBalanceView,
  ProductsIncome,
  ProductBalanceDetailView,
  ProductOutcomeDetailView,
  ProductIncomeDetailView,
  InternalCreate,
  ExternalCreate,
} from "@/pages";
import { ToastContainer } from "react-toastify";
import AgreementModal from "./components/AgreementModal";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Dashboard />,
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
          path: "appeal-letter",
          element: <AppealLetter />,
        },
        {
          path: "price-analysis",
          element: <Outlet />,
          children: [
            { index: true, element: <PriceAnalysis /> },
            { path: "create", element: <PriceAnalysisForm /> },
            { path: ":id", element: <PriceAnalysisDetail /> },
          ],
        },
        // Maxsulotlar boshqaruvi qismi
        {
          path: "management",
          element: <Outlet />,
          children: [
            // {
            //   path: "managemen-products",
            //   element: <ProductsBalanceView />,
            // },
            {
              path: "products-balance",
              element: (
                <ProductsBalanceView
                  title="Maxsulotlar qoldig'i"
                  reportTitle="Jami maxsulotlar qoldig'i"
                />
              ),
            },
            {
              path: "products-balance-detail/:id",
              element: <ProductBalanceDetailView />,
            },
            {
              path: "products-income",
              element: <ProductsIncome />,
            },
            {
              path: "products-income-detail/:id",
              element: <ProductIncomeDetailView />,
            },
            {
              path: "products-outcome",
              element: (
                <ProductsBalanceView
                  title="Maxsulotlar chiqimi"
                  reportTitle="Jami chiqim hujjatlari ichidagi maxsulotlar"
                />
              ),
            },
            {
              path: "products-outcome-detail/:id",
              element: <ProductOutcomeDetailView />,
            },
            {
              path: "products-return",
              element: (
                <ProductsBalanceView
                  title="Maxsulotlarni qaytarish"
                  reportTitle="Jami qaytarish hujjatlari ichidagi maxsulotlar"
                />
              ),
            },
            {
              path: "products-return-detail/:id",
              element: <ProductBalanceDetailView />, // yoki maxsus ReturnDetailView
            },
            {
              path: "products-warehouse-transfer",
              element: (
                <ProductsBalanceView
                  title="Ombordan omborga o'tkazish"
                  reportTitle="Jami o'tkazish hujjatlari ichidagi maxsulotlar"
                />
              ),
            },
            {
              path: "products-warehouse-transfer-detail/:id",
              element: <ProductBalanceDetailView />, // yoki maxsus TransferDetailView
            },
            {
              path: "products-balance-correction",
              element: (
                <ProductsBalanceView
                  title="Qoldiqni to'g'irlash"
                  reportTitle="Jami to'g'irlash hujjatlari ichidagi maxsulotlar"
                />
              ),
            },
            {
              path: "products-balance-correction-detail/:id",
              element: <ProductBalanceDetailView />, // yoki maxsus CorrectionDetailView
            },
          ],
        },
        // Hisobotlar qismi
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

        // Malumotlar qismi
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
          path: "users-management",
          element: <UsersManagement />,
        },
        {
          path: "new-document/",
          element: <Outlet />,
          children: [
            {
              path: "internal",
              element: <InternalCreate />,
            },
            {
              path: "external",
              element: <ExternalCreate />,
            },
          ],
        },

        // Test document create page
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
      {/* <RouterProvider router={router} />
      <ToastContainer /> */}
      <AgreementModal />
    </>
  );
};

export default App;
