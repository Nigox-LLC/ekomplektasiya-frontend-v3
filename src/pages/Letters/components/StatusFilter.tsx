import { Button } from "antd";
import { Search } from "lucide-react";
import React from "react";
import type { Letter } from "../LettersPage";

interface IProps {
  letters: Letter[];
  totalCount: number;
  statusCounts: {
    created: number;
    not_seen: number;
    viewed: number;
    done: number;
    not_done: number;
    sent: number;
  };
  setSelectedLetter: React.Dispatch<React.SetStateAction<Letter | null>>;
}

const StatusFilter: React.FC<IProps> = ({
  totalCount,
  statusCounts,
  setSelectedLetter,
}) => {
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "not_seen" | "viewed" | "done" | "not_done" | "sent"
  >("all");
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div
      className="flex gap-2 pb-3 overflow-x-auto border-b border-gray-200 items-center"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

      <Button
        onClick={() => {
          setStatusFilter("all");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "all"
            ? "bg-slate-100 hover:bg-slate-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "all"
              ? "text-slate-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Barchasi
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "all" ? "bg-slate-600" : "bg-slate-400"
          }`}
        >
          <span className="font-semibold text-xs text-white">{totalCount}</span>
        </div>
      </Button>

      <Button
        onClick={() => {
          setStatusFilter("not_seen");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "not_seen"
            ? "bg-blue-100 hover:bg-blue-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "not_seen"
              ? "text-blue-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Ko'rilmagan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "not_seen" ? "bg-blue-600" : "bg-blue-400"
          }`}
        >
          <span className="text-white font-semibold text-xs">
            {statusCounts.not_seen}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => {
          setStatusFilter("viewed");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "viewed"
            ? "bg-purple-100 hover:bg-purple-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "viewed"
              ? "text-purple-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Ko'rilgan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "viewed" ? "bg-purple-600" : "bg-purple-400"
          }`}
        >
          <span className="text-white font-semibold text-xs">
            {statusCounts.viewed}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => {
          setStatusFilter("done");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "done"
            ? "bg-green-100 hover:bg-green-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "done"
              ? "text-green-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Bajarilgan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "done" ? "bg-green-600" : "bg-green-400"
          }`}
        >
          <span className="font-semibold text-xs text-white">
            {statusCounts.done}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => {
          setStatusFilter("not_done");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "not_done"
            ? "bg-red-100 hover:bg-red-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "not_done"
              ? "text-red-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Bajarilmagan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "not_done" ? "bg-red-600" : "bg-red-400"
          }`}
        >
          <span className="font-semibold text-xs text-white">
            {statusCounts.not_done}
          </span>
        </div>
      </Button>

      <Button
        onClick={() => {
          setStatusFilter("sent");
          setSelectedLetter(null);
        }}
        variant="text"
        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          statusFilter === "sent"
            ? "bg-amber-100 hover:bg-amber-150"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`text-sm ${
            statusFilter === "sent"
              ? "text-amber-700 font-semibold"
              : "text-gray-500"
          }`}
        >
          Jo'natilgan
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-colors ${
            statusFilter === "sent" ? "bg-amber-600" : "bg-amber-400"
          }`}
        >
          <span className="font-semibold text-xs text-white">
            {statusCounts.sent}
          </span>
        </div>
      </Button>

      {/* Qidiruv tugmasi - O'NG TOMONDA */}
      <div className="ml-auto">
        <Button
          onClick={() => {
            setShowFilters(true);
            setSelectedLetter(null);
          }}
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
