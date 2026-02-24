import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import { axiosAPI } from "@/service/axiosAPI";
import { useAppDispatch } from "@/store/hooks/hooks";
import { setCurrentUserInfo } from "@/store/slices/infoSlice";

const Layout: React.FC = () => {
  const token = localStorage.getItem("v3_ganiwer");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const response = await axiosAPI.get("users/users/current/");
        if (response.status === 200) {
          dispatch(setCurrentUserInfo(response.data));
        } else {
          localStorage.removeItem("v3_ganiwer");
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("v3_ganiwer");
        navigate("/login");
      }
    };

    fetchCurrentUserInfo();

    if (!token) navigate("/login");
  }, [token, navigate]);

  return (
    <>
      <div className="flex items-start">
        <Sidebar />
        <div className="flex flex-col flex-[75%] min-w-0 w-full">
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
