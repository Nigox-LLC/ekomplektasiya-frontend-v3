// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router";
// import {
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Download,
//   FileText,
//   Info,
//   Link2,
//   Package,
//   Plus,
//   Printer,
//   RefreshCw,
//   Search,
//   UploadCloud,
//   Users,
//   X,
// } from "lucide-react";

// const PriceAnalysis: React.FC = () => {
//   // --- List state ---
//   const [activeTab, setActiveTab] = useState<"all" | "approved" | "rejected">("all");

//   const tableRows = useMemo(
//     () => [
//       {
//         id: "000000091",
//         date: "12.02.2026 18:50:41",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: false,
//       },
//       {
//         id: "000000090",
//         date: "12.02.2026 18:21:48",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: false,
//       },
//       {
//         id: "000000089",
//         date: "12.02.2026 18:20:35",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: false,
//       },
//       {
//         id: "000000088",
//         date: "12.02.2026 18:19:19",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: false,
//       },
//       {
//         id: "000000087",
//         date: "12.02.2026 18:07:56",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: false,
//       },
//       {
//         id: "000000086",
//         date: "12.02.2026 16:08:45",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: true,
//       },
//       {
//         id: "000000085",
//         date: "12.02.2026 15:56:56",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: true,
//       },
//       {
//         id: "000000077",
//         date: "09.02.2026 18:35:47",
//         name: "",
//         employee: "Zubaydullaeva Adiba Urinbaevna",
//         formed: true,
//         approved: true,
//       },
//     ],
//     [],
//   );

//   const filteredRows = useMemo(() => {
//     if (activeTab === "approved") return tableRows.filter((r) => r.approved);
//     if (activeTab === "rejected") return tableRows.filter((r) => !r.approved);
//     return tableRows;
//   }, [activeTab, tableRows]);

//   const navigate = useNavigate();

//   const stepTitles: Record<
//     1 | 2 | 3 | 4,
//     { title: string; subtitle: string; icon: React.ReactNode }
//   > = {
//     1: {
//       title: "Yangi narx tahlili yaratish",
//       subtitle: "Tovarlar - Qadam 1/4",
//       icon: <Package className="h-4 w-4" />,
//     },
//     2: {
//       title: "Yangi narx tahlili yaratish",
//       subtitle: "Tijoriy takliflar - Qadam 2/4",
//       icon: <FileText className="h-4 w-4" />,
//     },
//     3: {
//       title: "Yangi narx tahlili yaratish",
//       subtitle: "Imzolovchilar - Qadam 3/4",
//       icon: <Users className="h-4 w-4" />,
//     },
//     4: {
//       title: "Yangi narx tahlili yaratish",
//       subtitle: "Narx tahlili - Qadam 4/4",
//       icon: <FileText className="h-4 w-4" />,
//     },
//   };

//   // when user wants to create, we navigate to the create page route
//   const openCreate = () => navigate("create");

//   const Btn = ({
//     children,
//     onClick,
//     variant = "primary",
//     className = "",
//     disabled,
//     title,
//   }: {
//     children: React.ReactNode;
//     onClick?: () => void;
//     variant?: "primary" | "secondary" | "ghost" | "danger";
//     className?: string;
//     disabled?: boolean;
//     title?: string;
//   }) => {
//     const base =
//       "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants: Record<string, string> = {
//       primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
//       secondary:
//         "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
//       ghost: "text-slate-700 hover:bg-slate-100",
//       danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
//     };

//     return (
//       <button
//         title={title}
//         disabled={disabled}
//         onClick={onClick}
//         className={`${base} ${variants[variant]} ${className}`}
//       >
//         {children}
//       </button>
//     );
//   };

//   const Badge = ({ ok }: { ok: boolean }) => (
//     <span
//       className={`inline-flex items-center justify-center rounded-full p-1 ${ok ? "text-emerald-600" : "text-rose-500"}`}
//     >
//       {ok ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
//     </span>
//   );

//   const Card = ({
//     children,
//     className = "",
//   }: {
//     children: React.ReactNode;
//     className?: string;
//   }) => (
//     <div
//       className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
//     >
//       {children}
//     </div>
//   );

//   // ModalShell and the create modal content are moved into a dedicated page component

//   return (
//     <div className="w-full h-full bg-slate-100 rounded-2xl p-2">
//       <Card className="overflow-hidden w-full h-full">
//         {/* Top tabs + actions */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setActiveTab("all")}
//               className={`rounded-full px-3 py-1 text-sm font-medium ${activeTab === "all" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
//             >
//               Barchasi{" "}
//               <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
//                 {tableRows.length}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab("approved")}
//               className={`rounded-full px-3 py-1 text-sm font-medium ${activeTab === "approved" ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}
//             >
//               Tasdiqlangan{" "}
//               <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
//                 {tableRows.filter((r) => r.approved).length}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab("rejected")}
//               className={`rounded-full px-3 py-1 text-sm font-medium ${activeTab === "rejected" ? "bg-rose-50 text-rose-800" : "text-slate-600 hover:bg-slate-50"}`}
//             >
//               Tasdiqlanmagan{" "}
//               <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
//                 {tableRows.filter((r) => !r.approved).length}
//               </span>
//             </button>
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//             <Btn variant="primary" onClick={openCreate}>
//               <Plus className="h-4 w-4" />
//               Yaratish
//             </Btn>
//             <Btn variant="secondary" onClick={() => {}}>
//               <RefreshCw className="h-4 w-4" />
//               Yangilash
//             </Btn>
//             <Btn variant="secondary" onClick={() => {}}>
//               <Printer className="h-4 w-4" />
//               Chop etish
//             </Btn>
//             <div className="relative w-full sm:w-72">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Qidirish (Ctrl+F)"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-auto">
//           <table className="w-full h-full min-w-[1000px] border-collapse">
//             <thead className="bg-slate-50">
//               <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                 <th className="w-10 border-b border-slate-200 px-4 py-3">
//                   <input type="checkbox" className="h-4 w-4" />
//                 </th>
//                 <th className="border-b border-slate-200 px-4 py-3">Nomer</th>
//                 <th className="border-b border-slate-200 px-4 py-3">Sana</th>
//                 <th className="border-b border-slate-200 px-4 py-3">Nomi</th>
//                 <th className="border-b border-slate-200 px-4 py-3">Xodim</th>
//                 <th className="border-b border-slate-200 px-4 py-3">
//                   Shakllanish holati
//                 </th>
//                 <th className="border-b border-slate-200 px-4 py-3">
//                   Tasdiqlanish holati
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRows.map((r) => (
//                 <tr key={r.id} className="hover:bg-slate-50">
//                   <td className="border-b border-slate-200 px-4 py-3">
//                     <input type="checkbox" className="h-4 w-4" />
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">
//                     {r.id}
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
//                     {r.date}
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
//                     {r.name || "-"}
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
//                     {r.employee}
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3">
//                     <Badge ok={r.formed} />
//                   </td>
//                   <td className="border-b border-slate-200 px-4 py-3">
//                     <Badge ok={r.approved} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer pagination */}
//         <div className="flex flex-col gap-2 border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
//           <div>
//             Jami: <span className="font-medium text-slate-800">{filteredRows.length}</span>
//             ta buyurtma &nbsp;|&nbsp; Ko'rsatilmoqda:{" "}
//             <span className="font-medium text-slate-800">
//               1-{Math.min(8, filteredRows.length)}
//             </span>
//           </div>
//           <div className="flex items-center justify-between gap-2 md:justify-end">
//             <div className="flex items-center gap-1">
//               <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
//                 <ChevronsLeft className="h-4 w-4" />
//               </button>
//               <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <span className="mx-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
//                 1
//               </span>
//               <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//               <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
//                 <ChevronsRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* create wizard moved to a dedicated page at /price-analysis/create */}
//     </div>
//   );
// };

// export default PriceAnalysis;

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  Info,
  Link2,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI"; // ⚠️ Yo‘lni o‘zingizning loyihangizga moslang!

// API javobi uchun TypeScript tiplari
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

// Sanani formatlash (dd.mm.yyyy HH:MM:SS)
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

const ANALYSIS_ENDPOINT = "/document/analysis/"; // BaseURL avtomatik qo‘shiladi

const PriceAnalysis: React.FC = () => {
  const navigate = useNavigate();

  // --- Maʼlumotlar holati ---
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(ANALYSIS_ENDPOINT);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // --- UI holati ---
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Infinite scroll uchun reflar
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  // --- Maʼlumotlarni yuklash funksiyasi (append qilish imkoniyati bilan) ---
  const fetchItems = useCallback(async (url: string, append = false) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      // axiosAPI yordamida GET so‘rov
      const response = await axiosAPI.get<ApiResponse>(url);
      const data = response.data;

      setTotalCount(data.count);
      setNextPageUrl(data.next);
      setHasMore(!!data.next);

      setItems(prev => (append ? [...prev, ...data.results] : data.results));
    } catch (err: any) {
      setError(err.message || "Nomaʼlum xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  // Dastlabki yuklash
  useEffect(() => {
    fetchItems(ANALYSIS_ENDPOINT, false);
  }, [fetchItems]);

  // --- Infinite scroll observer ---
  useEffect(() => {
    if (loading || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && nextPageUrl) {
        fetchItems(nextPageUrl, true);
      }
    });

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, nextPageUrl, fetchItems]);

  // --- Tab va qidiruv bo‘yicha filtratsiya ---
  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeTab === "approved") {
      filtered = filtered.filter(item => item.is_signed);
    } else if (activeTab === "rejected") {
      filtered = filtered.filter(item => !item.is_signed);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.number.toLowerCase().includes(term) ||
        item.employee_name.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [items, activeTab, searchTerm]);

  // --- Event handlerlar ---
  const handleRefresh = () => {
    fetchItems(ANALYSIS_ENDPOINT, false);
  };

  const openCreate = () => navigate("create");

  // --- Qayta ishlatiladigan UI komponentlar (asl holicha qoldirildi) ---
  const Btn = ({ children, onClick, variant = "primary", className = "", disabled, title }: any) => {
    const base = "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: Record<string, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
      ghost: "text-slate-700 hover:bg-slate-100",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };
    return (
      <button title={title} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  const Badge = ({ ok }: { ok: boolean }) => (
    <span className={`inline-flex items-center justify-center rounded-full p-1 ${ok ? "text-emerald-600" : "text-rose-500"}`}>
      {ok ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
    </span>
  );

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
  );

  return (
    <div className="w-full h-full bg-slate-100 rounded-2xl p-2">
      <Card className="overflow-hidden w-full h-full flex flex-col">
        {/* Yuqori panel: tablar va tugmalar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeTab === "all" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Barchasi{" "}
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                {totalCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeTab === "approved" ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Tasdiqlangan{" "}
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                {items.filter(i => i.is_signed).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeTab === "rejected" ? "bg-rose-50 text-rose-800" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Tasdiqlanmagan{" "}
              <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                {items.filter(i => !i.is_signed).length}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Btn variant="primary" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Yaratish
            </Btn>
            <Btn variant="secondary" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Yangilash
            </Btn>
            <Btn variant="secondary" onClick={() => {}}>
              <Printer className="h-4 w-4" />
              Chop etish
            </Btn>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Qidirish (№ yoki xodim)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Jadval (infinite scroll) */}
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="border-b border-slate-200 px-4 py-3">Nomer</th>
                <th className="border-b border-slate-200 px-4 py-3">Sana</th>
                <th className="border-b border-slate-200 px-4 py-3">Xodim</th>
                <th className="border-b border-slate-200 px-4 py-3">Tasdiqlanish holati</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  ref={index === filteredItems.length - 1 ? lastItemRef : null}
                  className="hover:bg-slate-50"
                >
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">
                    {item.number}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                    {item.employee_name}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3">
                    <Badge ok={item.is_signed} />
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-slate-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">
                    Xatolik: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-slate-500">
                    Maʼlumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pastki holat qatori (paginatsiya oʻrniga) */}
        <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 flex justify-between items-center">
          <div>
            Jami: <span className="font-medium text-slate-800">{totalCount}</span> ta buyurtma
            {filteredItems.length !== totalCount && (
              <> | Koʻrsatilmoqda: {filteredItems.length}</>
            )}
          </div>
          {/* {!hasMore && <div className="text-slate-400">Barcha maʼlumotlar yuklandi</div>} */}
        </div>
      </Card>
    </div>
  );
};

export default PriceAnalysis;