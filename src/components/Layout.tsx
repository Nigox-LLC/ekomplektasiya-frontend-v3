import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar/Sidebar";

const Layout: React.FC = () => {
  const token = localStorage.getItem("v3_ganiwer");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return (
    <>
      <header>Header</header>
      <Sidebar />
      <Outlet />
      <footer>footer</footer>
    </>
  );
};

export default Layout;
