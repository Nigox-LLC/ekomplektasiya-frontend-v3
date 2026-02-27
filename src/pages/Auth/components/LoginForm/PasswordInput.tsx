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
        <Input.Password
          // iconRender={(visible) =>
          //   visible ? (<EyeOff className="size-5 text-gray-400" />) : (<Eye className="size-5 text-gray-400" />)
          // }
          placeholder="Parolni kiriting"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4! py-4! text-[16px]!"
          autoComplete="on"
        />
      </div>
    </div>
  );
});

export default PasswordInput;
