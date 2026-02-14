import React, { useEffect } from "react";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./LoginForm";
import LoginFooter from "./components/LoginFooter";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("v3_ganiwer");

  useEffect(() => {
    if (token) {
      navigate("/"); // Replace with your desired route
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 ">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </div>
    </div>
  );
};

export default Login;
