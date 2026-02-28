import { Button } from "antd";
import { Bell, Filter, Globe, Settings } from "lucide-react";
import React from "react";
import { FaBars } from "react-icons/fa6";
import { useLocation } from "react-router";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [showLanguage, setShowLanguage] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  const theme = localStorage.getItem("theme") || "light";
  const location = useLocation();

  return (
    <header
      className={`px-8 py-4 border-b flex items-center justify-between w-full ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <div>
            <h2
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {location.pathname === "/calendar" ? "Topshiriqlar" : "Xatlar"}
            </h2>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {new Date().toLocaleDateString("uz-UZ", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {/* Toggle collapsing sidebar */}
          <Button
            type="text"
            className={`ml-4 transition-transform duration-300 ${
              isSidebarCollapsed ? "rotate-180" : ""
            } ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {location.pathname === "/calendar" && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowLanguage(!showLanguage)}
              >
                <Globe className="size-4" />
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="size-4" />
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="size-4 mr-2" />
                {showFilters ? "Filtrlarni yashirish" : "Filtrlarni ko'rsatish"}
              </Button>
            </>
          )}
          <Button variant="outlined" size="small" className="relative">
            <Bell className="size-4" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
