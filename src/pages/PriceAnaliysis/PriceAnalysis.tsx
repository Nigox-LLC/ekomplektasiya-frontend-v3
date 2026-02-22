import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Plus,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";
import { Button, Input } from "antd";

// API response types
interface AnalysisItem {
  id: number;
  employee_name: string;
  created_at: string; // ISO 8601
  number: string;
  is_signed: boolean;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AnalysisItem[];
}

// Date formatter
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const ITEMS_PER_PAGE = 10;
const BASE_URL = "/document/analysis/";

const PriceAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [data, setData] = useState<AnalysisItem[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch list with pagination and optional filter
  const fetchList = useCallback(async (page: number, status: typeof statusFilter) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const params: any = { limit: ITEMS_PER_PAGE, offset };
      if (status !== "all") {
        params.is_signed = status === "approved";
      }
      const res = await axiosAPI.get<ApiResponse>(BASE_URL, { params });
      setData(res.data.results);
      setCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch price analysis list", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchList]);

  // Keyboard shortcut for search (Ctrl+F)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Filter by search term locally
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (item) =>
        item.number.toLowerCase().includes(q) ||
        item.employee_name.toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, count);

  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleRefresh = () => {
    fetchList(currentPage, statusFilter);
  };

  const handlePrint = async () => {
    // Simplified print – fetch all pages and print
    setPrintLoading(true);
    try {
      let allItems: AnalysisItem[] = [];
      let nextUrl: string | null = BASE_URL;
      while (nextUrl) {
        const res = await axiosAPI.get<ApiResponse>(nextUrl);
        allItems = [...allItems, ...res.data.results];
        nextUrl = res.data.next;
      }
      // Apply status filter if needed
      if (statusFilter !== "all") {
        allItems = allItems.filter((item) =>
          statusFilter === "approved" ? item.is_signed : !item.is_signed
        );
      }
      // Apply search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        allItems = allItems.filter(
          (item) =>
            item.number.toLowerCase().includes(q) ||
            item.employee_name.toLowerCase().includes(q)
        );
      }

      // Generate print HTML
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const rows = allItems
        .map(
          (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.number}</td>
          <td>${formatDate(item.created_at)}</td>
          <td>${item.employee_name}</td>
          <td>${item.is_signed ? "Tasdiqlangan" : "Tasdiqlanmagan"}</td>
        </tr>
      `
        )
        .join("");

      const html = `
        <html>
          <head><title>Narx tahlili hisoboti</title>
          <style>
            body { font-family: Arial; margin:20px; }
            table { border-collapse: collapse; width:100%; }
            th,td { border:1px solid #ccc; padding:8px; text-align:left; }
            th { background:#1E56A0; color:white; }
          </style>
          </head>
          <body>
            <h2>Narx tahlili hujjatlari</h2>
            <table>
              <thead><tr><th>№</th><th>Hujjat raqami</th><th>Sana</th><th>Xodim</th><th>Holati</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
            <p>Jami: ${allItems.length} ta</p>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Print error", error);
    } finally {
      setPrintLoading(false);
    }
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-700">
      {/* Status bar and actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCurrentPage(1); setStatusFilter("all"); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
                ${statusFilter === "all"
                  ? "bg-slate-100 border-slate-300 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 border-transparent"}`}
            >
              <span>Barchasi</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-md">
                {count}
              </span>
            </button>
            <button
              onClick={() => { setCurrentPage(1); setStatusFilter("approved"); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
                ${statusFilter === "approved"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "text-slate-600 hover:bg-emerald-50 border-transparent"}`}
            >
              <span>Tasdiqlangan</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-md">
                {data.filter((d) => d.is_signed).length}
              </span>
            </button>
            <button
              onClick={() => { setCurrentPage(1); setStatusFilter("unapproved"); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
                ${statusFilter === "unapproved"
                  ? "bg-rose-50 border-rose-300 text-rose-800"
                  : "text-slate-600 hover:bg-rose-50 border-transparent"}`}
            >
              <span>Tasdiqlanmagan</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-md">
                {data.filter((d) => !d.is_signed).length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("create")}>
              <Plus className="w-4 h-4 mr-1" /> Yaratish
            </Button>
            <Button onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Yangilanmoqda..." : "Yangilash"}
            </Button>
            <Button variant="outlined" onClick={handlePrint} disabled={printLoading}>
              <Printer className={`w-4 h-4 mr-2 ${printLoading ? "animate-spin" : ""}`} />
              {printLoading ? "Chop etilmoqda..." : "Chop etish"}
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Qidirish (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-8 pl-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Nomer</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Sana</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Xodim</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Tasdiqlanish holati</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Maʼlumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/price-analysis/${item.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 text-sm text-slate-800">{item.number}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {item.employee_name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.is_signed ? (
                        <CheckCircle className="text-emerald-500 inline w-5 h-5" />
                      ) : (
                        <X className="text-rose-500 inline w-5 h-5" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Jami: <span className="font-medium text-slate-900">{count}</span> ta
              {count > 0 && (
                <>
                  <span className="mx-2 text-slate-300">|</span>
                  Ko‘rsatilmoqda: {startIndex + 1}–{endIndex}
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outlined" size="small" onClick={goToFirst} disabled={currentPage === 1}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button variant="outlined" size="small" onClick={goToPrev} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="small"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === pageNum
                      ? "bg-[#1E56A0] text-white"
                      : "border-slate-300 text-slate-600 hover:bg-[#1E56A0]/70"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              <Button variant="outlined" size="small" onClick={goToNext} disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outlined" size="small" onClick={goToLast} disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceAnalysis;