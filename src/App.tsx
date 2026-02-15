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
} from "@/pages";
import PriceAnalysis from "./PriceAnaliysis/PriceAnalysis";


const App: React.FC = () => {
  const hasAccess = () => {
    return true;
  };

  const [currentUser, setCurrentUser] = useState({ username: '', fullName: '', permissions: [] as string[] });
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'technical' | 'employee'>('employee');

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
              element: <Dashboard userName={currentUser.fullName} userPosition={
                userRole === 'admin' ? 'Administrator' :
                  userRole === 'manager' ? 'Menejer' :
                    userRole === 'technical' ? 'Texnik mutaxassis' :
                      'Xodim'
              } />
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
          path: "users-management",
          element: <UsersManagement />,
        },
        {
          path: "product-management",
          element: <ProductManagement />
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
