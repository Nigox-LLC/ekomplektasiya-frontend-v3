// components/UsernameInput.tsx
import { Input } from "antd";
import { User } from "lucide-react";
import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const UsernameInput: React.FC<Props> = React.memo(({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Login
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Loginni kiriting"
          className="px-4! py-4! text-[16px]!"
        />
      </div>
    </div>
  );
});

export default UsernameInput;
