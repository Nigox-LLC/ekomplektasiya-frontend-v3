// components/LoginForm.tsx
import React, { useState, useCallback } from "react";
import UsernameInput from "./components/LoginForm/UsernameInput";
import PasswordInput from "./components/LoginForm/PasswordInput";
import SubmitButton from "./components/LoginForm/SubmitButton";
import { axiosAPI } from "@/service/axiosAPI";

const LoginForm = React.memo(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      localStorage.setItem("v3_ganiwer", access);
      console.log(refresh);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  return (
    <div className="p-8 space-y-4">
      <UsernameInput value={username} onChange={setUsername} />
      <PasswordInput value={password} onChange={setPassword} />
      <SubmitButton loading={loading} onClick={handleSubmit} />
    </div>
  );
});

export default LoginForm;
