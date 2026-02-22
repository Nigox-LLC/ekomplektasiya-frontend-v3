import { ChevronDown, FileText, Mail, Plus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type ViewType =
  | "calendar"
  | "incoming"
  | "outgoing"
  | "my-documents"
  | "reports"
  | "chat"
  | "sent-all"
  | "sent-execution"
  | "sent-info"
  | "sent-instructions"
  | "incoming-all"
  | "incoming-execution"
  | "incoming-signing"
  | "incoming-resolution"
  | "incoming-info"
  | "approval"
  | "backup"
  | "for-signing"
  | "new-document"
  | "service-document"
  | "appeal-letter"
  | "price-analysis"
  | "dashboard"
  | "dashboard-main"
  | "dashboard-stats"
  | "dashboard-employee"
  | "reference-requisites"
  | "reference-bank"
  | "reference-contracts"
  | "reference-goods-in"
  | "reference-goods-out"
  | "reference-warehouse-transfer"
  | "reference-year-plan"
  | "statistics-general"
  | "statistics-department"
  | "statistics-employee"
  | "reports-turnover"
  | "reports-goods-balance"
  | "reports-table1"
  | "reports-table2"
  | "reports-table3"
  | "reports-employee-stats"
  | "users-management"
  | "goods-management";

interface Letter {
  id: string;
  number: string;
  region?: string;
  recipient?: string;
  title: string;
  status: "overdue" | "today" | "completed";
  type: "incoming" | "outgoing";
}

const SidebarHeader: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [showNewDocDropdown, setShowNewDocDropdown] = useState(false);

  const openOnlyOffice = (documentType: "service" | "order") => {
    const title = documentType === "service" ? "Xizmat xati" : "Buyurtma xati";
    window.open("https://onlyoffice.com", "_blank");
    toast.success(`${title} uchun OnlyOffice ochildi`, {
      description: "Yangi oynada hujjat yaratilmoqda...",
      duration: 3000,
    });
    setShowNewDocDropdown(false);
  };

  return (
    <div className="p-6 border-b border-gray-700 relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/hudud_logo.png" alt="logo" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">HITSUK</h1>
          <p className="text-xs text-gray-400">Hujjat ijrosi tizimi</p>
        </div>
      </div>
      <button
        onClick={() => setShowNewDocDropdown((prev) => !prev)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm"
      >
        <Plus className="size-5" />
        <span>Yangi hujjat</span>
        <ChevronDown
          className={`size-4 transition-transform ${showNewDocDropdown ? "rotate-180" : ""}`}
        />
      </button>

      {showNewDocDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-99 overflow-hidden">
          <button
            onClick={() => {
              navigate("/new-document/internal");
              setShowNewDocDropdown(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100"
          >
            <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Ichki hujjat
              </p>
              <p className="text-xs text-gray-500">
                Ichki hujjat shakillantirish
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              navigate("/new-document/external");
              setShowNewDocDropdown(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 border-b border-gray-100"
          >
            <div className="size-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="size-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Tashqi hujjat
              </p>
              <p className="text-xs text-gray-500">
                Tashqi hujjat shakillantirish
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
});

export default SidebarHeader;
