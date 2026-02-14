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
        <Header />
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
