import { useAppSelector } from "@/store/hooks/hooks";
import { Button } from "antd";
import { LogOut, User } from "lucide-react";
import React from "react";

interface SidebarFooterProps {
  setShowLogoutConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = React.memo(
  ({ setShowLogoutConfirm, isCollapsed }) => {
    const handleLogout = () => {
      setShowLogoutConfirm(true);
    };

    const { currentUserInfo } = useAppSelector((state) => state.info);

    return (
      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
          isCollapsed ? "justify-center" : ""
        }`}>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="size-5 text-gray-300" />
          </div>
          <div className={`flex-1 transition-all duration-300 overflow-hidden ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}>
            <p className="text-sm font-medium text-white whitespace-nowrap">
              {currentUserInfo?.full_name || "John Doe"}
            </p>
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {currentUserInfo?.role === "admin" && "Administrator"}
              {currentUserInfo?.role === "manager" && "Menejer"}
              {currentUserInfo?.role === "technical" && "Texnik mutaxassis"}
              {currentUserInfo?.role === "employee" && "Xodim"}
            </p>
          </div>
          {!isCollapsed && (
            <Button type="text" className="text-white! hover:bg-white/30! z-50!" size="small" onClick={handleLogout}>
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </div>
    );
  },
);

export default SidebarFooter;
