// components/SubmitButton.tsx
import { Button } from "antd";
import { LogIn } from "lucide-react";
import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  loading: boolean;
  onClick: () => void;
}

const SubmitButton: React.FC<Props> = React.memo(({ loading, onClick }) => {
  return (
    <Button
      type="primary"
      className="w-full h-11"
      disabled={loading}
      onClick={onClick}
    >
      <LogIn className="size-5 mr-2" />
      Kirish
      {loading && <ClipLoader color="#fff" size={18} />}
    </Button>
  );
});

export default SubmitButton;
