import React from "react";

interface TableLoadingSpinnerProps {
  message?: string;
}

const TableLoadingSpinner: React.FC<TableLoadingSpinnerProps> = ({ message = "Ma'lumotlar yuklanmoqda..."}) => {
  return (
    <div className="relative w-full">
      {/* Progress bar container */}
      <div className="w-full h-1 bg-gray-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-loading-bar"></div>
      </div>
      
      {/* Message */}
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="size-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="size-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default TableLoadingSpinner;