import { Button } from "antd";
import { Search } from "lucide-react";
import React from "react";
import type { Letter } from "../LettersPage";

interface IProps {
  letters: Letter[];
}

const StatusFilter: React.FC<IProps> = ({ letters }) => {
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'completed' | 'overdue' | 'cancelled'>('all');
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div
      className="flex gap-2 pb-3 overflow-x-auto border-b border-gray-200 items-center"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

      <Button
        onClick={() => setStatusFilter("all")}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${statusFilter === "all" ? "bg-gray-100" : ""}`}
      >
        <span
          className={`text-sm ${statusFilter === "all" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
        >
          Barchasi
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center ${statusFilter === "all" ? "bg-gray-600" : "bg-gray-200"}`}
        >
          <span
            className={`font-semibold text-xs ${statusFilter === "all" ? "text-white" : "text-gray-700"}`}
          >
            {letters.length}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => setStatusFilter("completed")}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${statusFilter === "completed" ? "bg-green-50" : ""}`}
      >
        <span
          className={`text-sm ${statusFilter === "completed" ? "text-green-700 font-semibold" : "text-gray-500"}`}
        >
          Tasdiqlangan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center ${statusFilter === "completed" ? "bg-green-600" : "bg-green-300"}`}
        >
          <span className="text-white font-semibold text-xs">
            {letters.filter((l) => l.status === "completed").length}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => setStatusFilter("overdue")}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${statusFilter === "overdue" ? "bg-red-50" : ""}`}
      >
        <span
          className={`text-sm ${statusFilter === "overdue" ? "text-red-700 font-semibold" : "text-gray-500"}`}
        >
          Tasdiqlanmagan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center ${statusFilter === "overdue" ? "bg-red-600" : "bg-red-300"}`}
        >
          <span className="text-white font-semibold text-xs">
            {letters.filter((l) => l.status === "overdue").length}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => setStatusFilter("cancelled")}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${statusFilter === "cancelled" ? "bg-gray-50" : ""}`}
      >
        <span
          className={`text-sm ${statusFilter === "cancelled" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
        >
          Bekor qilingan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center ${statusFilter === "cancelled" ? "bg-gray-600" : "bg-gray-300"}`}
        >
          <span
            className={`font-semibold text-xs ${statusFilter === "cancelled" ? "text-white" : "text-gray-700"}`}
          >
            0
          </span>
        </div>
      </Button>

      {/* Qidiruv tugmasi - O'NG TOMONDA */}
      <div className="ml-auto">
        <Button
          onClick={() => setShowFilters(true)}
          size="small"
          className="gap-2"
          variant={showFilters ? "solid" : "outlined"}
        >
          <Search className="size-4" />
          Qidiruv
        </Button>
      </div>
    </div>
  );
};

export default StatusFilter;
