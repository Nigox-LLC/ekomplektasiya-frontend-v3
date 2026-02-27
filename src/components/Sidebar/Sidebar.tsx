import { Button } from "antd";
import { LogOut } from "lucide-react";
import React from "react";
import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";
import SidebarNav from "./components/SidebarNav";
import { useAppDispatch } from "@/store/hooks/hooks";
import {
  setCurrentUserInfo,
  setEimzoRememberedCert,
} from "@/store/slices/infoSlice";
import { useNavigate } from "react-router";
import { clearSavedEimzoCert } from "@/utils/eimzoStorage";

const Sidebar: React.FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const theme = localStorage.getItem("theme") || "light";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const confirmLogout = () => {
    dispatch(setCurrentUserInfo(null));
    localStorage.removeItem("v3_ganiwer");
    navigate("/login");
    clearSavedEimzoCert();
    dispatch(setEimzoRememberedCert(null));
  };

  return (
    <>
      <aside className="flex flex-col flex-[20%] sticky left-0 top-0 h-screen bg-[#1a2332] text-white shadow-xl z-40">
        <SidebarHeader />
        <SidebarNav />
        <SidebarFooter setShowLogoutConfirm={setShowLogoutConfirm} />
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <LogOut className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Tizimdan chiqish
                  </h2>
                  <p className="text-sm text-red-100">
                    Tasdiqlash talab qilinadi
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-2">
                Haqiqatan ham tizimdan chiqmoqchimisiz?
              </p>
              <p className="text-sm text-gray-500 text-center">
                Barcha ochiq sessiyalaringiz yakunlanadi
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                variant="outlined"
                className="flex-1 border-2"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmLogout}
              >
                <LogOut className="size-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
