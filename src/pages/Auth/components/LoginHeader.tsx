// components/LoginHeader.tsx
import React from "react";

import logo from "@/assets/hudud_logo.png"

const LoginHeader = React.memo(() => {
  return (
    <div className="text-center my-6">
      <div className="inline-flex items-center justify-center mb-4">
        <img src={logo} alt="Logo" className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">
        Raqamli nazorat
      </h1>
      <p className="text-gray-600 mt-2">
        Elektron hujjat ijrosi tizimi
      </p>
    </div>
  );
});

export default LoginHeader;
