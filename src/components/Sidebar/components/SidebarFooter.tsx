import { Button } from "antd";
import { LogOut, User } from "lucide-react";
import React from "react";

const SidebarFooter: React.FC = React.memo(() => {
  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="size-5 text-gray-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {/* {currentUser.fullName} */} John Doe
          </p>
          <p className="text-xs text-gray-400">
            {/* {userRole === "admin" && "Administrator"}
                {userRole === "manager" && "Menejer"}
                {userRole === "technical" && "Texnik mutaxassis"}
                {userRole === "employee" && "Xodim"} */}{" "}
            Administrator
          </p>
        </div>
        <Button
          variant="text"
          size="small"
          className="hover:bg-gray-700 text-gray-400 hover:text-white"
          // onClick={handleLogout}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );
});

export default SidebarFooter;
