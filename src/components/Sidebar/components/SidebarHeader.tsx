import { FileText, Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const SidebarHeader: React.FC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <div className="p-6 border-b border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Raqamli nazorat</h1>
          <p className="text-xs text-gray-400">Hujjat ijrosi tizimi</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/new-document")}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm"
      >
        <Plus className="size-5" />
        <span>Yangi hujjat</span>
      </button>
    </div>
  );
});

export default SidebarHeader;
