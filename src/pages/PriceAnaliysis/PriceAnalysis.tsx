// import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router";
// import {
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   X,
//   Plus,
//   Printer,
//   RefreshCw,
//   Search,
// } from "lucide-react";
// import { axiosAPI } from "@/service/axiosAPI";
// import { Button, Input } from "antd";

// // API response types
// interface AnalysisItem {
//   id: number;
//   employee_name: string;
//   created_at: string; // ISO 8601
//   number: string;
//   is_signed: boolean;
// }

// interface ApiResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: AnalysisItem[];
// }

// // Date formatter
// const formatDate = (iso: string): string => {
//   const d = new Date(iso);
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
//     d.getHours()
//   )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
// };

// const ITEMS_PER_PAGE = 10;
// const BASE_URL = "/document/analysis/";

// const PriceAnalysis: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [printLoading, setPrintLoading] = useState(false);
//   const [data, setData] = useState<AnalysisItem[]>([]);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "unapproved">("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Fetch list with pagination and optional filter
//   const fetchList = useCallback(async (page: number, status: typeof statusFilter) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * ITEMS_PER_PAGE;
//       const params: any = { limit: ITEMS_PER_PAGE, offset };
//       if (status !== "all") {
//         params.is_signed = status === "approved";
//       }
//       const res = await axiosAPI.get<ApiResponse>(BASE_URL, { params });
//       setData(res.data.results);
//       setCount(res.data.count);
//     } catch (error) {
//       console.error("Failed to fetch price analysis list", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchList(currentPage, statusFilter);
//   }, [currentPage, statusFilter, fetchList]);

//   // Keyboard shortcut for search (Ctrl+F)
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.key.toLowerCase() === "f") {
//         e.preventDefault();
//         searchInputRef.current?.focus();
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   // Filter by search term locally
//   const filteredData = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return data;
//     return data.filter(
//       (item) =>
//         item.number.toLowerCase().includes(q) ||
//         item.employee_name.toLowerCase().includes(q)
//     );
//   }, [data, searchTerm]);

//   // Pagination calculations
//   const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, count);

//   const goToFirst = () => setCurrentPage(1);
//   const goToLast = () => setCurrentPage(totalPages);
//   const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
//   const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

//   const getPageNumbers = () => {
//     const pages: number[] = [];
//     const maxVisible = 5;
//     let start = Math.max(1, currentPage - 2);
//     const end = Math.min(totalPages, start + maxVisible - 1);
//     if (end - start < maxVisible - 1) {
//       start = Math.max(1, end - maxVisible + 1);
//     }
//     for (let i = start; i <= end; i++) pages.push(i);
//     return pages;
//   };

//   const handleRefresh = () => {
//     fetchList(currentPage, statusFilter);
//   };

//   const handlePrint = async () => {
//     // Simplified print – fetch all pages and print
//     setPrintLoading(true);
//     try {
//       let allItems: AnalysisItem[] = [];
//       let nextUrl: string | null = BASE_URL;
//       while (nextUrl) {
//         const res = await axiosAPI.get<ApiResponse>(nextUrl);
//         allItems = [...allItems, ...res.data.results];
//         nextUrl = res.data.next;
//       }
//       // Apply status filter if needed
//       if (statusFilter !== "all") {
//         allItems = allItems.filter((item) =>
//           statusFilter === "approved" ? item.is_signed : !item.is_signed
//         );
//       }
//       // Apply search filter
//       if (searchTerm.trim()) {
//         const q = searchTerm.toLowerCase();
//         allItems = allItems.filter(
//           (item) =>
//             item.number.toLowerCase().includes(q) ||
//             item.employee_name.toLowerCase().includes(q)
//         );
//       }

//       // Generate print HTML
//       const printWindow = window.open("", "_blank");
//       if (!printWindow) return;

//       const rows = allItems
//         .map(
//           (item, idx) => `
//         <tr>
//           <td>${idx + 1}</td>
//           <td>${item.number}</td>
//           <td>${formatDate(item.created_at)}</td>
//           <td>${item.employee_name}</td>
//           <td>${item.is_signed ? "Tasdiqlangan" : "Tasdiqlanmagan"}</td>
//         </tr>
//       `
//         )
//         .join("");

//       const html = `
//         <html>
//           <head><title>Narx tahlili hisoboti</title>
//           <style>
//             body { font-family: Arial; margin:20px; }
//             table { border-collapse: collapse; width:100%; }
//             th,td { border:1px solid #ccc; padding:8px; text-align:left; }
//             th { background:#1E56A0; color:white; }
//           </style>
//           </head>
//           <body>
//             <h2>Narx tahlili hujjatlari</h2>
//             <table>
//               <thead><tr><th>№</th><th>Hujjat raqami</th><th>Sana</th><th>Xodim</th><th>Holati</th></tr></thead>
//               <tbody>${rows}</tbody>
//             </table>
//             <p>Jami: ${allItems.length} ta</p>
//           </body>
//         </html>
//       `;
//       printWindow.document.write(html);
//       printWindow.document.close();
//       printWindow.print();
//     } catch (error) {
//       console.error("Print error", error);
//     } finally {
//       setPrintLoading(false);
//     }
//   };

//   return (
//     <section className="space-y-4 animate-in fade-in duration-700">
//       {/* Status bar and actions */}
//       <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
//         <div className="flex items-center justify-between gap-6">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => { setCurrentPage(1); setStatusFilter("all"); }}
//               className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
//                 ${statusFilter === "all"
//                   ? "bg-slate-100 border-slate-300 text-slate-900"
//                   : "text-slate-600 hover:bg-slate-50 border-transparent"}`}
//             >
//               <span>Barchasi</span>
//               <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-md">
//                 {count}
//               </span>
//             </button>
//             <button
//               onClick={() => { setCurrentPage(1); setStatusFilter("approved"); }}
//               className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
//                 ${statusFilter === "approved"
//                   ? "bg-emerald-50 border-emerald-300 text-emerald-800"
//                   : "text-slate-600 hover:bg-emerald-50 border-transparent"}`}
//             >
//               <span>Tasdiqlangan</span>
//               <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-md">
//                 {data.filter((d) => d.is_signed).length}
//               </span>
//             </button>
//             <button
//               onClick={() => { setCurrentPage(1); setStatusFilter("unapproved"); }}
//               className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition
//                 ${statusFilter === "unapproved"
//                   ? "bg-rose-50 border-rose-300 text-rose-800"
//                   : "text-slate-600 hover:bg-rose-50 border-transparent"}`}
//             >
//               <span>Tasdiqlanmagan</span>
//               <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-md">
//                 {data.filter((d) => !d.is_signed).length}
//               </span>
//             </button>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button onClick={() => navigate("create")}>
//               <Plus className="w-4 h-4 mr-1" /> Yaratish
//             </Button>
//             <Button onClick={handleRefresh} disabled={loading}>
//               <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
//               {loading ? "Yangilanmoqda..." : "Yangilash"}
//             </Button>
//             <Button variant="outlined" onClick={handlePrint} disabled={printLoading}>
//               <Printer className={`w-4 h-4 mr-2 ${printLoading ? "animate-spin" : ""}`} />
//               {printLoading ? "Chop etilmoqda..." : "Chop etish"}
//             </Button>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//               <Input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Qidirish (Ctrl+F)"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-64 h-8 pl-9 text-sm"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-50 border-b border-slate-100">
//               <tr>
//                 <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Nomer</th>
//                 <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Sana</th>
//                 <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Xodim</th>
//                 <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Tasdiqlanish holati</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="py-8 text-center text-slate-500">
//                     Maʼlumot topilmadi
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item) => (
//                   <tr
//                     key={item.id}
//                     onClick={() => navigate(`/price-analysis/${item.id}`)}
//                     className="hover:bg-slate-50 cursor-pointer transition"
//                   >
//                     <td className="px-4 py-3 text-sm text-slate-800">{item.number}</td>
//                     <td className="px-4 py-3 text-sm text-slate-700 text-center">
//                       {formatDate(item.created_at)}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-700 text-center">
//                       {item.employee_name}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       {item.is_signed ? (
//                         <CheckCircle className="text-emerald-500 inline w-5 h-5" />
//                       ) : (
//                         <X className="text-rose-500 inline w-5 h-5" />
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-slate-600">
//               Jami: <span className="font-medium text-slate-900">{count}</span> ta
//               {count > 0 && (
//                 <>
//                   <span className="mx-2 text-slate-300">|</span>
//                   Ko‘rsatilmoqda: {startIndex + 1}–{endIndex}
//                 </>
//               )}
//             </div>
//             <div className="flex items-center gap-1">
//               <Button variant="outlined" size="small" onClick={goToFirst} disabled={currentPage === 1}>
//                 <ChevronsLeft className="w-4 h-4" />
//               </Button>
//               <Button variant="outlined" size="small" onClick={goToPrev} disabled={currentPage === 1}>
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>

//               {getPageNumbers().map((pageNum) => (
//                 <Button
//                   key={pageNum}
//                   variant={currentPage === pageNum ? "default" : "outline"}
//                   size="small"
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`h-8 w-8 p-0 ${
//                     currentPage === pageNum
//                       ? "bg-[#1E56A0] text-white"
//                       : "border-slate-300 text-slate-600 hover:bg-[#1E56A0]/70"
//                   }`}
//                 >
//                   {pageNum}
//                 </Button>
//               ))}

//               <Button variant="outlined" size="small" onClick={goToNext} disabled={currentPage === totalPages || totalPages === 0}>
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//               <Button variant="outlined" size="small" onClick={goToLast} disabled={currentPage === totalPages || totalPages === 0}>
//                 <ChevronsRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PriceAnalysis;

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  X,
  Plus,
  Printer,
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";

interface AnalysisItem {
  id: number;
  employee_name: string;
  created_at: string;
  number: string;
  is_signed: boolean;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AnalysisItem[];
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const fetchList = useCallback(async (page: number, status: typeof statusFilter) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const params: any = { limit: ITEMS_PER_PAGE, offset };
      if (status !== "all") params.is_signed = status === "approved";
      const res = await axiosAPI.get<ApiResponse>(BASE_URL, { params });
      setData(res.data.results);
      setCount(res.data.count);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchList]);

  // Scroll pagination: detect when user scrolls near bottom of table
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 40 && nextUrl && !loading) {
        setCurrentPage((p) => p + 1);
        // smooth scroll back slightly so user sees new rows
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [nextUrl, loading]);

  // Accumulate rows across pages for scroll UX
  const [allData, setAllData] = useState<AnalysisItem[]>([]);
  useEffect(() => {
    if (currentPage === 1) {
      setAllData(data);
    } else {
      setAllData((prev) => {
        const ids = new Set(prev.map((d) => d.id));
        const fresh = data.filter((d) => !ids.has(d.id));
        return [...prev, ...fresh];
      });
    }
  }, [data]);

  // Reset accumulation on filter/search change
  useEffect(() => {
    setCurrentPage(1);
    setAllData([]);
  }, [statusFilter]);

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

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allData;
    return allData.filter(
      (item) =>
        item.number.toLowerCase().includes(q) ||
        item.employee_name.toLowerCase().includes(q)
    );
  }, [allData, searchTerm]);

  const approvedCount = allData.filter((d) => d.is_signed).length;
  const unapprovedCount = allData.filter((d) => !d.is_signed).length;

  const handleRefresh = () => {
    setCurrentPage(1);
    setAllData([]);
    fetchList(1, statusFilter);
  };

  const handlePrint = async () => {
    setPrintLoading(true);
    try {
      let allItems: AnalysisItem[] = [];
      let url: string | null = BASE_URL;
      while (url) {
        const res = await axiosAPI.get<ApiResponse>(url);
        allItems = [...allItems, ...res.data.results];
        url = res.data.next;
      }
      if (statusFilter !== "all")
        allItems = allItems.filter((i) => statusFilter === "approved" ? i.is_signed : !i.is_signed);
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        allItems = allItems.filter((i) => i.number.toLowerCase().includes(q) || i.employee_name.toLowerCase().includes(q));
      }
      const rows = allItems.map((item, idx) => `
        <tr><td>${idx + 1}</td><td>${item.number}</td><td>${formatDate(item.created_at)}</td>
        <td>${item.employee_name}</td><td>${item.is_signed ? "Tasdiqlangan" : "Tasdiqlanmagan"}</td></tr>
      `).join("");
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(`<html><head><title>Narx tahlili</title>
        <style>body{font-family:Arial;margin:20px}table{border-collapse:collapse;width:100%}
        th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#1e40af;color:white}</style>
        </head><body><h2>Narx tahlili hujjatlari</h2>
        <table><thead><tr><th>№</th><th>Hujjat raqami</th><th>Sana</th><th>Xodim</th><th>Holati</th></tr></thead>
        <tbody>${rows}</tbody></table><p>Jami: ${allItems.length} ta</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
    } catch (e) {
      console.error(e);
    } finally {
      setPrintLoading(false);
    }
  };

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <section className="space-y-4 animate-in fade-in duration-700">

      {/* ── Top bar ── */}
      <div
        className="rounded-2xl p-4 shadow-sm"
        style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "Barchasi", count: count, activeBg: "bg-white/20", activeText: "text-white", badge: "bg-white/30 text-white" },
              { key: "approved", label: "Tasdiqlangan", count: approvedCount, activeBg: "bg-emerald-500/30", activeText: "text-emerald-100", badge: "bg-emerald-400/40 text-emerald-100" },
              { key: "unapproved", label: "Tasdiqlanmagan", count: unapprovedCount, activeBg: "bg-rose-500/30", activeText: "text-rose-100", badge: "bg-rose-400/40 text-rose-100" },
            ].map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setStatusFilter(tab.key as any); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150
                    ${active ? `${tab.activeBg} ${tab.activeText} shadow-sm` : "text-white/70 hover:text-white hover:bg-white/10"}`}
                >
                  {tab.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? tab.badge : "bg-white/15 text-white/70"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("create")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 text-sm font-bold
                shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              <Plus size={15} />
              Yaratish
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 text-white text-sm font-semibold
                hover:bg-white/25 transition-all duration-150 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              {loading ? "Yangilanmoqda..." : "Yangilash"}
            </button>
            <button
              onClick={handlePrint}
              disabled={printLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 text-white text-sm font-semibold
                hover:bg-white/25 transition-all duration-150 disabled:opacity-50"
            >
              <Printer size={15} className={printLoading ? "animate-spin" : ""} />
              {printLoading ? "Chop etilmoqda..." : "Chop etish"}
            </button>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Qidirish (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-white/15 text-white text-sm placeholder:text-white/50 w-52
                  border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 220px)" }}>

        {/* Table header (sticky) */}
        <div className="shrink-0">
          <table className="w-full">
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)" }}>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100 w-16">
                  №
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                  Hujjat raqami
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                  Yaratilgan sana
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                  Xodim
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                  Tasdiqlanish holati
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable tbody */}
        <div ref={tableRef} className="flex-1 overflow-y-auto">
          <table className="w-full">
            <tbody>
              {filteredData.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <FileText size={48} className="mb-3 opacity-25" />
                      <p className="text-sm font-medium">Ma'lumot topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/price-analysis/${item.id}`)}
                      className={`cursor-pointer transition-colors group
                        ${isEven ? "bg-white" : "bg-slate-50/50"}
                        hover:bg-blue-50/60`}
                    >
                      <td className="px-5 py-3.5 border-b border-gray-100 w-16">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-b border-gray-100">
                        <span className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          {item.number}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-b border-gray-100 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-5 py-3.5 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          {/* avatar */}
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-indigo-100 text-indigo-700"
                          >
                            {item.employee_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{item.employee_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 border-b border-gray-100 text-center">
                        {item.is_signed ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <CheckCircle size={12} />
                            Tasdiqlangan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <X size={12} />
                            Tasdiqlanmagan
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Loading row at bottom */}
              {loading && (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center gap-2 py-6 text-blue-500">
                      <RefreshCw size={18} className="animate-spin" />
                      <span className="text-sm font-medium">Yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* End of list indicator */}
              {!loading && !nextUrl && allData.length > 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
                      <div className="h-px bg-gray-200 flex-1 mx-6" />
                      <span className="text-xs font-medium whitespace-nowrap">Ro'yxat tugadi</span>
                      <div className="h-px bg-gray-200 flex-1 mx-6" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer: stats + manual page nav ── */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Ko'rsatilmoqda: <span className="text-gray-800 font-bold">{filteredData.length}</span> / <span className="text-gray-800 font-bold">{count}</span> ta
            </span>
            {nextUrl && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                Pastga aylantiring
              </span>
            )}
          </div>

          {/* Minimal page indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); tableRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === 1 || loading}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
                hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Dot scroller */}
            <div className="flex items-center gap-1">
              {[...Array(Math.min(7, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                const active = pageNum === currentPage;
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(pageNum); setAllData([]); tableRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`rounded-full transition-all duration-200 ${active ? "w-6 h-2.5 bg-blue-600" : "w-2.5 h-2.5 bg-gray-300 hover:bg-blue-300"}`}
                    title={`Sahifa ${pageNum}`}
                  />
                );
              })}
              {totalPages > 7 && (
                <span className="text-xs text-gray-400 font-medium ml-1">···</span>
              )}
            </div>

            <button
              onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); tableRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === totalPages || totalPages === 0 || loading}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
                hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150"
            >
              <ChevronRight size={15} />
            </button>

            <span className="ml-2 text-xs text-gray-400 font-medium">
              {currentPage} / {totalPages || 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceAnalysis;