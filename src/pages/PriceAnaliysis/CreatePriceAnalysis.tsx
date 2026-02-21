import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Info,
  Link2,
  Package,
  Plus,
  RefreshCw,
  Search,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { axiosAPI } from "@/service/axiosAPI"; // Loyihangizdagi yo‘l

// ------------------ TURLAR ------------------
interface Product {
  id: number;
  product_name: string;
  product_type: { id: number; name: string } | null;
  product_model: { id: number; name: string } | null;
  unit: { id: number; name: string } | null;
  size: { id: number; name: string } | null;
  quantity: number;
  price_analysis_quantity: number;
  cancel_quantity: number;
  is_cancel: boolean;
  comment: string;
  posted_website: any;
  attached_employee: number | null;
}

interface SelectedProduct extends Product {
  selectedQuantity: number;
}

interface ProductsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Xodim (imzolovchi) – /staff/by-name/
interface Staff {
  id: number;
  full_name: string;
  position: string;
}

interface StaffApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Staff[];
}

interface SelectedSigner extends Staff {
  signed_at?: string; // imzolangan vaqt, agar backenddan kelsa
}

// Tijoriy taklif (GET /document/analysis/commercial/)
interface CommercialOffer {
  id: number;
  number: string;
  date: string;            // ISO format
  organization: string;
  stir: string;
  delivery_day: number;
  description: string;
  status: string;
  file_name: string | null;
  org_info_name: string | null;
  stat_name: string | null;
  employee_name: string | null;
  delivery_condition_name: string | null;
  created_at: string;
}

interface CommercialApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommercialOffer[];
}

// Yetkazib berish sharti (GET /directory/delivery/)
interface DeliveryCondition {
  id: number;
  name: string;
}

// (Agar API paginated bo‘lsa, quyidagi interfeys ishlatiladi)
interface DeliveryConditionsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DeliveryCondition[];
}

// ------------------ ASOSIY KOMPONENT ------------------
const CreatePriceAnalysis: React.FC = () => {
  const navigate = useNavigate();

  // Wizard qadami
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);

  // Modallarni ochish
  const [chooseProductsOpen, setChooseProductsOpen] = useState(false);
  const [chooseOffersOpen, setChooseOffersOpen] = useState(false);
  const [uploadOfferOpen, setUploadOfferOpen] = useState(false);
  const [chooseEmployeesOpen, setChooseEmployeesOpen] = useState(false);

  // ------------------ 1-QADAM: TOVARLAR ------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsNextUrl, setProductsNextUrl] = useState<string | null>(null);
  const [productsPrevUrl, setProductsPrevUrl] = useState<string | null>(null);
  const [productsTotalCount, setProductsTotalCount] = useState(0);
  const [selectedProductsMap, setSelectedProductsMap] = useState<Map<number, number>>(new Map());
  const [mainSelectedProducts, setMainSelectedProducts] = useState<SelectedProduct[]>([]);

  // ------------------ 2-QADAM: TIJORIY TAKLIFLAR ------------------
  const [commercialOffers, setCommercialOffers] = useState<CommercialOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [offersNextUrl, setOffersNextUrl] = useState<string | null>(null);
  const [offersPrevUrl, setOffersPrevUrl] = useState<string | null>(null);
  const [offersTotalCount, setOffersTotalCount] = useState(0);
  // Tanlangan takliflar (modal ichida)
  const [selectedOffersMap, setSelectedOffersMap] = useState<Map<number, CommercialOffer>>(new Map());
  // Asosiy jadvalda ko‘rsatiladigan tanlangan takliflar
  const [mainSelectedOffers, setMainSelectedOffers] = useState<CommercialOffer[]>([]);

  // Yetkazib berish shartlari (select uchun)
  const [deliveryConditions, setDeliveryConditions] = useState<DeliveryCondition[]>([]);
  const [deliveryConditionsLoading, setDeliveryConditionsLoading] = useState(false);

  // ------------------ 3-QADAM: XODIMLAR ------------------
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [staffNextUrl, setStaffNextUrl] = useState<string | null>(null);
  const [staffPrevUrl, setStaffPrevUrl] = useState<string | null>(null);
  const [staffTotalCount, setStaffTotalCount] = useState(0);
  const [selectedStaffMap, setSelectedStaffMap] = useState<Map<number, Staff>>(new Map());
  const [mainSelectedSigners, setMainSelectedSigners] = useState<SelectedSigner[]>([]);

  // Yuklash formasi
  const [uploadForm, setUploadForm] = useState({
    number: "",
    date: "",
    organization: "",
    stir: "",
    delivery_condition: "", // saqlashda ID
    delivery_day: "",
    description: "",
  });
  const [orgInfoFile, setOrgInfoFile] = useState<File | null>(null);
  const [statFile, setStatFile] = useState<File | null>(null);
  const [commercialFile, setCommercialFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ------------------ 3-QADAM: XODIMLAR (placeholder) ------------------
  // (o‘zgarishsiz qoldirilgan, kerak bo‘lsa keyin to‘ldiriladi)

  // ------------------ EFFECTLAR ------------------
  // Tovarlar modal ochilganda yuklash
  useEffect(() => {
    if (chooseProductsOpen) {
      fetchProducts("/document/orders/products/");
    }
  }, [chooseProductsOpen]);

  // Tijoriy takliflar modal ochilganda yuklash
  useEffect(() => {
    if (chooseOffersOpen) {
      fetchCommercialOffers("/document/analysis/commercial/");
    }
  }, [chooseOffersOpen]);

  // Yuklash modal ochilganda delivery conditionlarni yuklash
  useEffect(() => {
    if (uploadOfferOpen) {
      fetchDeliveryConditions();
    }
  }, [uploadOfferOpen]);

  useEffect(() => {
    if (chooseEmployeesOpen) fetchStaff("/staff/by-name/");
  }, [chooseEmployeesOpen]);

  // ------------------ API FUNKSIYALAR ------------------
  const fetchProducts = async (url: string) => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const response = await axiosAPI.get<ProductsApiResponse>(url);
      const data = response.data;
      setProducts(data.results);
      setProductsNextUrl(data.next);
      setProductsPrevUrl(data.previous);
      setProductsTotalCount(data.count);
      setSelectedProductsMap(new Map()); // tanlovni tozalash
    } catch (err: any) {
      setProductsError(err.message || "Mahsulotlarni yuklashda xatolik");
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCommercialOffers = async (url: string) => {
    setOffersLoading(true);
    setOffersError(null);
    try {
      const response = await axiosAPI.get<CommercialApiResponse>(url);
      const data = response.data;
      setCommercialOffers(data.results);
      setOffersNextUrl(data.next);
      setOffersPrevUrl(data.previous);
      setOffersTotalCount(data.count);
      setSelectedOffersMap(new Map()); // tanlovni tozalash
    } catch (err: any) {
      setOffersError(err.message || "Tijoriy takliflarni yuklashda xatolik");
    } finally {
      setOffersLoading(false);
    }
  };

  const fetchDeliveryConditions = async () => {
    setDeliveryConditionsLoading(true);
    try {
      const response = await axiosAPI.get<any>("/directory/delivery/");
      // API javobi to'g'ridan-to'g'ri massiv yoki { results: [...] } ko'rinishida bo'lishi mumkin
      if (Array.isArray(response.data)) {
        setDeliveryConditions(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setDeliveryConditions(response.data.results);
      } else {
        console.error("Kutilmagan javob formati:", response.data);
        setDeliveryConditions([]);
      }
    } catch (err) {
      console.error("Yetkazib berish shartlarini yuklashda xatolik", err);
      setDeliveryConditions([]);
    } finally {
      setDeliveryConditionsLoading(false);
    }
  };


  const fetchStaff = async (url: string) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const response = await axiosAPI.get<any>(url); // StaffApiResponse o‘rniga any, chunki ba'zida noto‘g‘ri kelishi mumkin
      const data = response.data;
      // API javobi { count, next, previous, results } ko‘rinishida bo‘lishi kerak
      if (data && Array.isArray(data.results)) {
        setStaff(data.results);
        setStaffNextUrl(data.next || null);
        setStaffPrevUrl(data.previous || null);
        setStaffTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        // agar to‘g‘ridan-to‘g‘ri massiv qaytsa (kam ehtimol)
        setStaff(data);
        setStaffNextUrl(null);
        setStaffPrevUrl(null);
        setStaffTotalCount(data.length);
      } else {
        console.error("Kutilmagan javob formati:", data);
        setStaff([]);
        setStaffNextUrl(null);
        setStaffPrevUrl(null);
        setStaffTotalCount(0);
      }
      setSelectedStaffMap(new Map());
    } catch (err: any) {
      setStaffError(err.message || "Xodimlarni yuklashda xatolik");
      setStaff([]);
    } finally {
      setStaffLoading(false);
    }
  };

  // ------------------ TOVARLAR BILAN ISHLASH ------------------
  const toggleProductSelection = (productId: number, checked: boolean) => {
    setSelectedProductsMap(prev => {
      const newMap = new Map(prev);
      if (checked) {
        const product = products.find(p => p.id === productId);
        const defaultQty = product?.price_analysis_quantity || 1;
        newMap.set(productId, defaultQty);
      } else {
        newMap.delete(productId);
      }
      return newMap;
    });
  };

  const updateSelectedQuantity = (productId: number, quantity: number) => {
    setSelectedProductsMap(prev => {
      const newMap = new Map(prev);
      newMap.set(productId, quantity);
      return newMap;
    });
  };

  const toggleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, number>();
      products.forEach(p => newMap.set(p.id, p.price_analysis_quantity || 1));
      setSelectedProductsMap(newMap);
    } else {
      setSelectedProductsMap(new Map());
    }
  };

  const handleAddSelectedProducts = () => {
    const selected: SelectedProduct[] = [];
    selectedProductsMap.forEach((quantity, id) => {
      const product = products.find(p => p.id === id);
      if (product) selected.push({ ...product, selectedQuantity: quantity });
    });
    setMainSelectedProducts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newProducts = selected.filter(p => !existingIds.has(p.id));
      return [...prev, ...newProducts];
    });
    setChooseProductsOpen(false);
  };

  const handleCloseProductsModal = () => {
    setChooseProductsOpen(false);
    setProducts([]);
    setProductsError(null);
    setSelectedProductsMap(new Map());
  };

  const toggleSelectAllStaff = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, Staff>();
      staff.forEach(s => newMap.set(s.id, s));
      setSelectedStaffMap(newMap);
    } else {
      setSelectedStaffMap(new Map());
    }
  };

  const handleAddSelectedStaff = () => {
    const selected = Array.from(selectedStaffMap.values()).map(s => ({
      ...s,
      signed_at: undefined, // agar kerak bo‘lsa keyin backenddan olinadi
    }));
    setMainSelectedSigners(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newStaff = selected.filter(p => !existingIds.has(p.id));
      return [...prev, ...newStaff];
    });
    setChooseEmployeesOpen(false);
  };

  const handleCloseStaffModal = () => {
    setChooseEmployeesOpen(false);
    setStaff([]);
    setStaffError(null);
    setSelectedStaffMap(new Map());
  };


  const handleAddSelectedOffers = () => {
    const selected = Array.from(selectedOffersMap.values());
    setMainSelectedOffers(prev => {
      const existingIds = new Set(prev.map(o => o.id));
      const newOffers = selected.filter(o => !existingIds.has(o.id));
      return [...prev, ...newOffers];
    });
    setChooseOffersOpen(false);
  };

  // ------------------ XODIMLAR BILAN ISHLASH ------------------
  const toggleStaffSelection = (person: Staff, checked: boolean) => {
    setSelectedStaffMap(prev => {
      const newMap = new Map(prev);
      if (checked) newMap.set(person.id, person);
      else newMap.delete(person.id);
      return newMap;
    });
  };

  // ------------------ TIJORIY TAKLIFLAR BILAN ISHLASH ------------------
  const toggleOfferSelection = (offer: CommercialOffer, checked: boolean) => {
    setSelectedOffersMap(prev => {
      const newMap = new Map(prev);
      if (checked) newMap.set(offer.id, offer);
      else newMap.delete(offer.id);
      return newMap;
    });
  };

  const toggleSelectAllOffers = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, CommercialOffer>();
      commercialOffers.forEach(o => newMap.set(o.id, o));
      setSelectedOffersMap(newMap);
    } else {
      setSelectedOffersMap(new Map());
    }
  };


  const handleCloseOffersModal = () => {
    setChooseOffersOpen(false);
    setCommercialOffers([]);
    setOffersError(null);
    setSelectedOffersMap(new Map());
  };

  // ------------------ YUKLASH FORMASI ------------------
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleUploadSubmit = async () => {
    if (
      !uploadForm.number ||
      !uploadForm.date ||
      !uploadForm.organization ||
      !uploadForm.stir ||
      !uploadForm.delivery_day
    ) {
      setUploadError("Iltimos, barcha majburiy maydonlarni to‘ldiring");
      return;
    }

    const formData = new FormData();
    formData.append("number", uploadForm.number);
    formData.append("date", uploadForm.date);
    formData.append("organization", uploadForm.organization);
    formData.append("stir", uploadForm.stir);
    formData.append("delivery_condition", uploadForm.delivery_condition);
    formData.append("delivery_day", uploadForm.delivery_day);
    formData.append("description", uploadForm.description);

    if (orgInfoFile) formData.append("org_info", orgInfoFile);
    if (statFile) formData.append("stat", statFile);
    if (commercialFile) formData.append("file", commercialFile);

    setUploading(true);
    setUploadError(null);
    try {
      const response = await axiosAPI.post<any>("/document/analysis/commercial/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Muvaffaqiyatli yuklandi – modalni yopish va formalarni tozalash
      setUploadOfferOpen(false);
      setUploadForm({
        number: "",
        date: "",
        organization: "",
        stir: "",
        delivery_condition: "",
        delivery_day: "",
        description: "",
      });
      setOrgInfoFile(null);
      setStatFile(null);
      setCommercialFile(null);

      // Yangi yaratilgan taklifni asosiy jadvalga qo'shamiz
      const newOffer: CommercialOffer = {
        ...response.data,
        // POST javobida delivery_condition_name bo'lmasa, null qo'yamiz
        delivery_condition_name: response.data.delivery_condition_name || null,
        employee_name: response.data.employee_name || null,
        file_name: response.data.file_name || null,
        org_info_name: response.data.org_info_name || null,
        stat_name: response.data.stat_name || null,
      };
      setMainSelectedOffers(prev => {
        // Takrorlanmasligi uchun tekshiramiz
        if (prev.some(o => o.id === newOffer.id)) return prev;
        return [...prev, newOffer];
      });

      // Ro'yxatni yangilash (modal uchun)
      fetchCommercialOffers("/document/analysis/commercial/");
    } catch (err: any) {
      setUploadError(err.response?.data?.message || "Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  // ------------------ STEP BOSHQARISH ------------------
  const stepTitles: Record<
    1 | 2 | 3 | 4,
    { title: string; subtitle: string; icon: React.ReactNode }
  > = {
    1: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Tovarlar - Qadam 1/4",
      icon: <Package className="h-4 w-4" />,
    },
    2: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Tijoriy takliflar - Qadam 2/4",
      icon: <FileText className="h-4 w-4" />,
    },
    3: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Imzolovchilar - Qadam 3/4",
      icon: <Users className="h-4 w-4" />,
    },
    4: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Narx tahlili - Qadam 4/4",
      icon: <FileText className="h-4 w-4" />,
    },
  };

  const nextStep = () => setCreateStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s));
  const prevStep = () => setCreateStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
  const closeCreate = () => navigate("/price-analysis");

  // ------------------ UI YORDAMCHI KOMPONENTLAR ------------------
  const Btn = ({ children, onClick, variant = "primary", className = "", disabled, title }: any) => {
    const base =
      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
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

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
  );

  const ModalShell = ({ open, title, onClose, children, size = "lg" }: any) => {
    if (!open) return null;
    const width = size === "sm" ? "max-w-xl" : size === "xl" ? "max-w-5xl" : "max-w-3xl";
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`w-full ${width} overflow-hidden rounded-xl bg-white shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="text-sm font-semibold text-slate-800">{title}</div>
              <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto p-5">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  // ------------------ RENDER ------------------
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Asosiy wizard */}
      <div className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                {stepTitles[createStep].icon}
              </span>
              {stepTitles[createStep].title}
            </div>
            <div className="mt-1 text-sm text-slate-500">{stepTitles[createStep].subtitle}</div>
          </div>
          <button onClick={closeCreate} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-5">
          {/* QADAM 1: Tovarlar */}
          {createStep === 1 && (
            <Card className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-semibold text-slate-800">Tovarlar</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Qidirish (Ctrl+F)" />
                  </div>
                  <Btn variant="primary" onClick={() => setChooseProductsOpen(true)}>
                    <Package className="h-4 w-4" />
                    Tovarlarni to'ldirish
                  </Btn>
                </div>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-200 px-4 py-3">№</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kiruvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Chiquvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar turi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Model</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lcham</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lchov birligi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Qoldiq</th>
                      <th className="border-b border-slate-200 px-4 py-3">Yangi miqdor</th>
                      <th className="border-b border-slate-200 px-4 py-3">Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainSelectedProducts.length > 0 ? (
                      mainSelectedProducts.map((product, index) => (
                        <tr key={product.id} className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">{product.product_name}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.product_type?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.product_model?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.size?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.unit?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.quantity}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.selectedQuantity}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.comment || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="px-4 py-12 text-center text-sm text-slate-500">
                          Hali hech qanday tovar qo'shilmagan. “Tovarlarni to'ldirish" tugmasini bosing.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* QADAM 2: Tijoriy takliflar */}
          {createStep === 2 && (
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Btn variant="secondary" onClick={() => setUploadOfferOpen(true)}>
                  <UploadCloud className="h-4 w-4" />
                  TK yuklash
                </Btn>
                <Btn variant="secondary" onClick={() => setChooseOffersOpen(true)}>
                  <FileText className="h-4 w-4" />
                  Mavjud TK yuklash
                </Btn>
                <Btn variant="secondary" onClick={() => { }}>
                  <Link2 className="h-4 w-4" />
                  Tovarlarga biriktirish
                </Btn>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="w-10 border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" /></th>
                      <th className="border-b border-slate-200 px-4 py-3">N</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kirish nomer</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kirish sanasi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tashkilot nomi</th>
                      <th className="border-b border-slate-200 px-4 py-3">INN</th>
                      <th className="border-b border-slate-200 px-4 py-3">TK sanasi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tijoriy taklif</th>
                      <th className="border-b border-slate-200 px-4 py-3">STAT</th>
                      <th className="border-b border-slate-200 px-4 py-3">Org info</th>
                      <th className="border-b border-slate-200 px-4 py-3">Xodimlar</th>
                      <th className="border-b border-slate-200 px-4 py-3">Yetkazib berish turi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovarlarga biriktirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainSelectedOffers.length > 0 ? (
                      mainSelectedOffers.map((offer, index) => (
                        <tr key={offer.id} className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3">
                            <input type="checkbox" className="h-4 w-4" />
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.number}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {new Date(offer.date).toLocaleDateString("uz-UZ")}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.organization}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.stir}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {new Date(offer.date).toLocaleDateString("uz-UZ")}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {offer.file_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.file_name}</span> : '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {offer.stat_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.stat_name}</span> : '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {offer.org_info_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.org_info_name}</span> : '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {offer.employee_name || '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {offer.delivery_condition_name || '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            <button className="text-blue-600 hover:underline">Biriktirish</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={13} className="px-4 py-12 text-center text-sm text-slate-500">
                          Tijoriy takliflar mavjud emas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* QADAM 3: Imzolovchilar */}
          {createStep === 3 && (
            <Card className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Поиск (Ctrl+F)" />
                </div>
                <Btn variant="primary" onClick={() => setChooseEmployeesOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Kiritish
                </Btn>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-200 px-4 py-3">N</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZOLOVCHI XODIM</th>
                      <th className="border-b border-slate-200 px-4 py-3">LAVOZIM</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZO</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZOLANGAN VAQT</th>
                      <th className="border-b border-slate-200 px-4 py-3">HARAKATLAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainSelectedSigners.length > 0 ? (
                      mainSelectedSigners.map((signer, index) => (
                        <tr key={signer.id} className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">{signer.full_name}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{signer.position}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            {signer.signed_at ? new Date(signer.signed_at).toLocaleString('uz-UZ') : '-'}
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                            <button
                              onClick={() => {
                                setMainSelectedSigners(prev => prev.filter(s => s.id !== signer.id));
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="O'chirish"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-14">
                          <div className="mx-auto flex max-w-md flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                              <Users className="h-7 w-7" />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-slate-800">Imzolovchilar mavjud emas</div>
                            <div className="mt-1 text-sm text-slate-500">Imzolovchi qo'shish uchun “Kiritish” tugmasini bosing</div>
                            <Btn className="mt-4" variant="primary" onClick={() => setChooseEmployeesOpen(true)}>
                              <Plus className="h-4 w-4" />
                              Imzolovchi qo'shish
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {/* QADAM 4: PDF Preview */}
          {createStep === 4 && (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-slate-800">Narx tahlili fayl</div>
                <div className="flex items-center gap-2">
                  <Btn variant="secondary" onClick={() => { }}>
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </Btn>
                  <Btn variant="primary" onClick={() => { }}>
                    <RefreshCw className="h-4 w-4" />
                    Yangilash
                  </Btn>
                </div>
              </div>
              <div className="bg-slate-900/5 p-4">
                <div className="h-[68vh] w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <div className="max-w-md text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <FileText className="h-7 w-7" />
                      </div>
                      <div className="mt-3 text-sm font-semibold text-slate-800">PDF preview</div>
                      <div className="mt-1 text-sm text-slate-500">Bu joyda PDF viewer turadi.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info className="h-4 w-4" />
            Qadam {createStep}/4
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" onClick={prevStep} disabled={createStep === 1}>
              <ChevronLeft className="h-4 w-4" />
              Orqaga
            </Btn>
            <Btn variant="primary" onClick={nextStep} disabled={createStep === 4}>
              Davom etish
              <ChevronRight className="h-4 w-4" />
            </Btn>
          </div>
        </div>
      </div>

      {/* MODAL: Tovarlarni tanlash */}
      <ModalShell open={chooseProductsOpen} title="Tovarlarni tanlang" onClose={handleCloseProductsModal} size="xl">
        <div className="relative">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Tovarlarni qidirish..." />
          </div>

          {productsLoading && <div className="mt-4 text-center py-8 text-slate-500">Yuklanmoqda...</div>}
          {productsError && <div className="mt-4 text-center py-8 text-red-500">Xatolik: {productsError}</div>}

          {!productsLoading && !productsError && (
            <>
              <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[1100px] bg-white">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="w-10 border-b border-slate-200 px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={products.length > 0 && selectedProductsMap.size === products.length}
                          onChange={(e) => toggleSelectAllProducts(e.target.checked)}
                        />
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">№</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kiruvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Chiquvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar turi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Model</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lcham</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lchov birligi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Qoldiq</th>
                      <th className="border-b border-slate-200 px-4 py-3">Yangi miqdor</th>
                      <th className="border-b border-slate-200 px-4 py-3">Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => {
                      const isSelected = selectedProductsMap.has(product.id);
                      return (
                        <tr key={product.id} className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={isSelected}
                              onChange={(e) => toggleProductSelection(product.id, e.target.checked)}
                            />
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">{product.product_name}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.product_type?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.product_model?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.size?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.unit?.name || '-'}</td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.quantity}</td>
                          <td className="border-b border-slate-200 px-4 py-3">
                            <input
                              className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
                              value={selectedProductsMap.get(product.id) || product.price_analysis_quantity || 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                updateSelectedQuantity(product.id, val);
                              }}
                              disabled={!isSelected}
                            />
                          </td>
                          <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{product.comment || '-'}</td>
                        </tr>
                      );
                    })}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={12} className="px-4 py-12 text-center text-sm text-slate-500">
                          Hech qanday tovar topilmadi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                <div>
                  Jami: <span className="font-medium text-slate-800">{productsTotalCount}</span> ta tovar
                </div>
                <div className="flex items-center gap-2">
                  <Btn variant="secondary" disabled={!productsPrevUrl} onClick={() => productsPrevUrl && fetchProducts(productsPrevUrl)}>
                    Oldingi
                  </Btn>
                  <Btn variant="secondary" disabled={!productsNextUrl} onClick={() => productsNextUrl && fetchProducts(productsNextUrl)}>
                    Keyingi
                  </Btn>
                </div>
              </div>
            </>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
            <div>
              Tanlangan: <span className="font-medium text-slate-800">{selectedProductsMap.size}</span> ta tovar
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="secondary" onClick={handleCloseProductsModal}>
                Bekor qilish
              </Btn>
              <Btn variant="primary" onClick={handleAddSelectedProducts} disabled={selectedProductsMap.size === 0}>
                Tanlash ({selectedProductsMap.size})
              </Btn>
            </div>
          </div>
        </div>
      </ModalShell>

      {/* MODAL: Mavjud tijoriy takliflar */}
      <ModalShell open={chooseOffersOpen} title="Mavjud tijoriy takliflar" onClose={handleCloseOffersModal} size="xl">
        <div className="flex items-center justify-between gap-2">
          <Btn variant="secondary" onClick={() => fetchCommercialOffers("/document/analysis/commercial/")}>
            <RefreshCw className="h-4 w-4" />Yangilash
          </Btn>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Qidirish" />
          </div>
        </div>

        {offersLoading && <div className="mt-4 text-center py-8 text-slate-500">Yuklanmoqda...</div>}
        {offersError && <div className="mt-4 text-center py-8 text-red-500">Xatolik: {offersError}</div>}

        {!offersLoading && !offersError && (
          <>
            <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[1100px] bg-white">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="w-10 border-b border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={commercialOffers.length > 0 && selectedOffersMap.size === commercialOffers.length}
                        onChange={(e) => toggleSelectAllOffers(e.target.checked)}
                      />
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3">№</th>
                    <th className="border-b border-slate-200 px-4 py-3">Kirish nomer</th>
                    <th className="border-b border-slate-200 px-4 py-3">Kirish sanasi</th>
                    <th className="border-b border-slate-200 px-4 py-3">Tashkilot nomi</th>
                    <th className="border-b border-slate-200 px-4 py-3">INN</th>
                    <th className="border-b border-slate-200 px-4 py-3">TK sanasi</th>
                    <th className="border-b border-slate-200 px-4 py-3">Tijoriy taklif</th>
                    <th className="border-b border-slate-200 px-4 py-3">STAT</th>
                    <th className="border-b border-slate-200 px-4 py-3">Org info</th>
                    <th className="border-b border-slate-200 px-4 py-3">Xodimlar</th>
                    <th className="border-b border-slate-200 px-4 py-3">Yetkazib berish turi</th>
                    <th className="border-b border-slate-200 px-4 py-3">Tovarlarga biriktirish</th>
                  </tr>
                </thead>
                <tbody>
                  {commercialOffers.map((offer, index) => {
                    const isSelected = selectedOffersMap.has(offer.id);
                    return (
                      <tr key={offer.id} className={isSelected ? "bg-blue-50" : "hover:bg-slate-50"}>
                        <td className="border-b border-slate-200 px-4 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={isSelected}
                            onChange={(e) => toggleOfferSelection(offer, e.target.checked)}
                          />
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.number}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {new Date(offer.date).toLocaleDateString("uz-UZ")}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.organization}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.stir}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {new Date(offer.date).toLocaleDateString("uz-UZ")}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {offer.file_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.file_name}</span> : '-'}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {offer.stat_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.stat_name}</span> : '-'}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {offer.org_info_name ? <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">{offer.org_info_name}</span> : '-'}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.employee_name || '-'}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{offer.delivery_condition_name || '-'}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                          <button className="text-blue-600 hover:underline">Biriktirish</button>
                        </td>
                      </tr>
                    );
                  })}
                  {commercialOffers.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-sm text-slate-500">
                        Hech qanday tijoriy taklif topilmadi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <div>
                Jami: <span className="font-medium text-slate-800">{offersTotalCount}</span> ta taklif
              </div>
              <div className="flex items-center gap-2">
                <Btn variant="secondary" disabled={!offersPrevUrl} onClick={() => offersPrevUrl && fetchCommercialOffers(offersPrevUrl)}>
                  Oldingi
                </Btn>
                <Btn variant="secondary" disabled={!offersNextUrl} onClick={() => offersNextUrl && fetchCommercialOffers(offersNextUrl)}>
                  Keyingi
                </Btn>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <div>
            Tanlangan: <span className="font-medium text-slate-800">{selectedOffersMap.size}</span> ta taklif
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" onClick={handleCloseOffersModal}>
              Bekor qilish
            </Btn>
            <Btn variant="primary" onClick={handleAddSelectedOffers} disabled={selectedOffersMap.size === 0}>
              Tanlash ({selectedOffersMap.size})
            </Btn>
          </div>
        </div>
      </ModalShell>

      {/* MODAL: TK yuklash */}
      <ModalShell open={uploadOfferOpen} title="Tijoriy taklif yuklash" onClose={() => setUploadOfferOpen(false)} size="lg">
        <div className="space-y-4">
          {uploadError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {uploadError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Kirish № <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Masalan: 0001"
                value={uploadForm.number}
                onChange={(e) => setUploadForm({ ...uploadForm, number: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Kirish sanasi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={uploadForm.date}
                onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Tashkilot nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Masalan: Andijon Shahar"
                value={uploadForm.organization}
                onChange={(e) => setUploadForm({ ...uploadForm, organization: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                STIR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Masalan: 190"
                value={uploadForm.stir}
                onChange={(e) => setUploadForm({ ...uploadForm, stir: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Yetkazib berish sharti
              </label>
              <select
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                value={uploadForm.delivery_condition}
                onChange={(e) => setUploadForm({ ...uploadForm, delivery_condition: e.target.value })}
                disabled={deliveryConditionsLoading}
              >
                <option value="">Tanlang</option>
                {deliveryConditions.map((cond) => (
                  <option key={cond.id} value={cond.id}>
                    {cond.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Yetkazib berish muddati (kun) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Masalan: 10"
                value={uploadForm.delivery_day}
                onChange={(e) => setUploadForm({ ...uploadForm, delivery_day: e.target.value })}
              />
            </div>
          </div>

          {/* Fayl yuklash maydonlari */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Org info (fayl)</label>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="flex-1 truncate text-slate-600">
                  {orgInfoFile ? orgInfoFile.name : "Fayl tanlanmagan"}
                </span>
                <label className="cursor-pointer text-blue-600 hover:underline">
                  <span>Tanlash</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setOrgInfoFile)} />
                </label>
                {orgInfoFile && (
                  <button onClick={() => setOrgInfoFile(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">STAT (fayl)</label>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="flex-1 truncate text-slate-600">
                  {statFile ? statFile.name : "Fayl tanlanmagan"}
                </span>
                <label className="cursor-pointer text-blue-600 hover:underline">
                  <span>Tanlash</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setStatFile)} />
                </label>
                {statFile && (
                  <button onClick={() => setStatFile(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Tijoriy taklif fayli <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="flex-1 truncate text-slate-600">
                  {commercialFile ? commercialFile.name : "Fayl tanlanmagan"}
                </span>
                <label className="cursor-pointer text-blue-600 hover:underline">
                  <span>Tanlash</span>
                  <input type="file" className="hidden" required onChange={(e) => handleFileChange(e, setCommercialFile)} />
                </label>
                {commercialFile && (
                  <button onClick={() => setCommercialFile(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
            <Btn variant="secondary" onClick={() => setUploadOfferOpen(false)} disabled={uploading}>
              Bekor qilish
            </Btn>
            <Btn variant="primary" onClick={handleUploadSubmit} disabled={uploading}>
              {uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                "Saqlash"
              )}
            </Btn>
          </div>
        </div>
      </ModalShell>

      {/* MODAL: Xodimlar (placeholder) */}
      <ModalShell open={chooseEmployeesOpen} title="Barcha xodimlar ro'yxati" onClose={handleCloseStaffModal} size="xl">
        <div className="flex items-center justify-between gap-2">
          <Btn variant="secondary" onClick={() => fetchStaff("/staff/by-name/")}>
            <RefreshCw className="h-4 w-4" />Yangilash
          </Btn>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Xodimlarni qidirish..." />
          </div>
        </div>

        {staffLoading && <div className="mt-4 text-center py-8 text-slate-500">Yuklanmoqda...</div>}
        {staffError && <div className="mt-4 text-center py-8 text-red-500">Xatolik: {staffError}</div>}

        {!staffLoading && !staffError && (
          <>
            <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[900px] bg-white">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="w-10 border-b border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={staff.length > 0 && selectedStaffMap.size === staff.length}
                        onChange={(e) => toggleSelectAllStaff(e.target.checked)}
                      />
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3">№</th>
                    <th className="border-b border-slate-200 px-4 py-3">F.I.Sh</th>
                    <th className="border-b border-slate-200 px-4 py-3">Lavozim</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((person, index) => {
                    const isSelected = selectedStaffMap.has(person.id);
                    return (
                      <tr key={person.id} className={isSelected ? "bg-blue-50" : "hover:bg-slate-50"}>
                        <td className="border-b border-slate-200 px-4 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={isSelected}
                            onChange={(e) => toggleStaffSelection(person, e.target.checked)}
                          />
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">{person.full_name}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{person.position}</td>
                      </tr>
                    );
                  })}
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-500">
                        Hech qanday xodim topilmadi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <div>
                Jami: <span className="font-medium text-slate-800">{staffTotalCount}</span> ta xodim
              </div>
              <div className="flex items-center gap-2">
                <Btn variant="secondary" disabled={!staffPrevUrl} onClick={() => staffPrevUrl && fetchStaff(staffPrevUrl)}>
                  Oldingi
                </Btn>
                <Btn variant="secondary" disabled={!staffNextUrl} onClick={() => staffNextUrl && fetchStaff(staffNextUrl)}>
                  Keyingi
                </Btn>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <div>
            Tanlangan: <span className="font-medium text-slate-800">{selectedStaffMap.size}</span> ta xodim
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" onClick={handleCloseStaffModal}>
              Bekor qilish
            </Btn>
            <Btn variant="primary" onClick={handleAddSelectedStaff} disabled={selectedStaffMap.size === 0}>
              Tanlash ({selectedStaffMap.size})
            </Btn>
          </div>
        </div>
      </ModalShell>
    </div>
  );
};

export default CreatePriceAnalysis;