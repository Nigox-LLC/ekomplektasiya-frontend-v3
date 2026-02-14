// components/PasswordInput.tsx
import { Input } from "antd";
import { Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const PasswordInput: React.FC<Props> = React.memo(({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Parol
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;
