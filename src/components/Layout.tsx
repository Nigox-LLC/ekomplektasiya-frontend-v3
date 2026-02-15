import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

const Layout: React.FC = () => {
  const token = localStorage.getItem("v3_ganiwer");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return (
    <>
      <div className="flex items-start">
        <Sidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
