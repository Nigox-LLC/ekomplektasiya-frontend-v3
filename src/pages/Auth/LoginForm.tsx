// components/LoginForm.tsx
import React, { useState, useCallback } from "react";
import UsernameInput from "./components/LoginForm/UsernameInput";
import PasswordInput from "./components/LoginForm/PasswordInput";
import SubmitButton from "./components/LoginForm/SubmitButton";
import { axiosAPI } from "@/service/axiosAPI";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const LoginForm = React.memo(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosAPI.post("users/login/", {
        username,
        password,
      });
      const {
        access,
        refresh,
      }: {
        access: string;
        refresh: string;
      } = response.data;

      if (response.status === 200) {
        localStorage.setItem("v3_ganiwer", access);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Parol yoki foydalanuvchi nomi noto'g'ri");
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="p-8 space-y-4"
    >
      <UsernameInput value={username} onChange={setUsername} />
      <PasswordInput value={password} onChange={setPassword} />
      <SubmitButton loading={loading} />
    </form>
  );
});

export default LoginForm;
