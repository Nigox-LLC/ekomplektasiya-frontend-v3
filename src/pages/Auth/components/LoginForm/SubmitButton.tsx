// components/SubmitButton.tsx
import { Button } from "antd";
import { LogIn } from "lucide-react";
import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  loading: boolean;
}

const SubmitButton: React.FC<Props> = React.memo(({ loading }) => {
  return (
    <Button
      type="primary"
      htmlType="submit"
      className="w-full h-11"
      disabled={loading}
    >
      <LogIn className="size-5 mr-2" />
      Kirish
      {loading && <ClipLoader color="#fff" size={18} />}
    </Button>
  );
});

export default SubmitButton;
