import React, { useEffect } from "react";
import { CheckCircle2, X, XCircle, Trash2 } from "lucide-react";
import { Button } from "antd";

interface SuccessNotificationProps {
  message: string;
  type: "success" | "danger";
  onClose: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />;
      case "danger":
        return <XCircle className="size-5 text-red-600 flex-shrink-0" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-50 to-green-100 border-green-300";
      case "danger":
        return "bg-gradient-to-r from-red-50 to-red-100 border-red-300";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "danger":
        return "text-red-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-from-top">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border-2 ${getBgColor()} min-w-[400px]`}>
        {getIcon()}
        <p className={`flex-1 font-semibold text-sm ${getTextColor()}`}>
          {message}
        </p>
        <Button
          variant="outlined"
          size="small"
          className="h-6 w-6 p-0 hover:bg-white/50 flex-shrink-0"
          onClick={onClose}
        >
          <X className="size-4 text-gray-600" />
        </Button>
      </div>

      <style>{`
        @keyframes slide-from-top {
          from {
            transform: translateY(-150%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-from-top {
          animation: slide-from-top 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SuccessNotification;