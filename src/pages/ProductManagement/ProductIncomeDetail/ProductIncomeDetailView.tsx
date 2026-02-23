import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  X,
  Plus,
  Barcode,
  FileSpreadsheet,
  Printer,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
  ArrowUpDown,
  Upload,
  File,
  Link as LinkIcon,
} from "lucide-react";
import ProductSelectModal from "../components/ProductSelectModal";
import ProductCreateModal, { type ProductItem } from "../components/ProductCreateModal";
import TableLoadingSpinner from "../components/TableLoadingSpinner";
import SuccessNotification from "../components/SuccessNotification";
import SearchableSelect from "../components/SearchableSelect";
import BarcodePrintModal from "../components/BarcodePrintModal";
import { Button } from "antd";

interface DetailProduct {
  id: string;
  productId: string;
  productName: string;
  productType: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  batchNumber: string;
  batchDate: string;
  account: string;
  productCode: string;
  barcode: string;
  shouldPrint: boolean;
  printCount: number;
}

interface ProductIncomeDetailViewProps {
  onNavigate?: (view: string) => void;
  documentId?: string;
  title?: string;
  backView?: string;
  documentData?: {
    number: string;
    date: string;
    region: string;
    district: string;
    warehouse: string;
    responsiblePerson: string;
    confirmStatus?: "saved" | "confirmed";
  };
}

// Mock spravochnik data
const mockProductTypes = [
  "Регулятор",
  "Труба",
  "Шланг",
  "Адаптер",
  "Фильтр газовый",
];
const mockModels = ["РДНК-100", "РДНК-50", "Д-219", "ДУ-32"];
const mockSizes = ["60x60", "40x40", "50x50"];
const mockUnits = ["Шт", "п/м", "комп", "м", "кг"];

const mockCounterparties = [
  "OOO \"Gazprom\"",
  "OOO \"Lukoil\"",
  "OOO \"Rosneft\"",
  "OOO \"Transneft\"",
  "OOO \"Tatneft\"",
];

const mockContracts = [
  "SH-2026-001",
  "SH-2026-002",
  "SH-2026-003",
  "SH-2026-004",
];

const mockBaseDocuments = [
  { number: "XOR-22-3422", type: "Buyurtma xati" },
  { number: "XOR-22-3423", type: "Buyurtma xati" },
  { number: "SH-2026-001", type: "Shartnoma" },
];

// iOS-style Toggle Switch Component
function IOSToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out
        ${checked ? "bg-blue-500" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-4.5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

const ProductIncomeDetailView: React.FC<ProductIncomeDetailViewProps> = ({ onNavigate, documentId,   title: propTitle, backView = "products-income", documentData }) => {
 
  // Use documentData if provided, otherwise generate new document
  const [docNumber, setDocNumber] = useState(
    documentData?.number || `QLD-2026-${documentId || "051"}`,
  );

  // Dinamik title - agar documentData bo'lsa "o'zgartirish", aks holda "yaratish"
  const title = documentData
    ? `№ ${documentData.number} Maxsulotlar kirimi hujjatini o'zgartirish`
    : propTitle || "Maxsulotlar kirimi yaratish";
  const [docDate, setDocDate] = useState(
    documentData?.date
      ? new Date(
        documentData.date.split(".").reverse().join("-"),
      )
        .toISOString()
        .slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Read-only rejim - tasdiqlangan hujjatlar uchun
  const isReadOnly = documentData?.confirmStatus === "confirmed";

  // New fields for Income
  const [counterparty, setCounterparty] = useState("");
  const [contract, setContract] = useState("");
  const [incomeType, setIncomeType] = useState<"main" | "regional">("main");
  const [powerOfAttorney, setPowerOfAttorney] = useState<File | null>(null);
  const [baseDocument, setBaseDocument] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters with cascade - filled from documentData if editing existing
  const [selectedRegion, setSelectedRegion] = useState(
    documentData?.region || "",
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    documentData?.district || "",
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    documentData?.warehouse || "",
  );
  const [selectedPerson, setSelectedPerson] = useState(
    documentData?.responsiblePerson || "",
  );

  const [products, setProducts] = useState<DetailProduct[]>([]);
  const [isProductSelectOpen, setIsProductSelectOpen] =
    useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] =
    useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);
  const [selectAllPrint, setSelectAllPrint] = useState(false);

  // Mock data for cascading dropdowns
  const regions = [
    "Jizzax viloyati",
    "Toshkent shahar",
    "Farg'ona viloyati",
    "Namangan viloyati",
  ];
  const districtsByRegion: Record<string, string[]> = {
    "Jizzax viloyati": [
      "Dustlik tumani",
      "Mirzacho'l tumani",
      "Zarbdor tumani",
    ],
    "Toshkent shahar": [
      "Chilonzor tumani",
      "Yunusobod tumani",
      "Shayxontohur tumani",
    ],
    "Farg'ona viloyati": [
      "Farg'ona shahri",
      "Qo'qon shahri",
      "Marg'ilon shahri",
    ],
    "Namangan viloyati": [
      "Namangan shahri",
      "Pop tumani",
      "Uychi tumani",
    ],
  };
  const warehousesByDistrict: Record<string, string[]> = {
    "Dustlik tumani": [
      "Dustlik tumani markaziy ombor",
      "Dustlik filial ombor",
    ],
    "Mirzacho'l tumani": ["Mirzacho'l markaziy ombor"],
    "Chilonzor tumani": [
      "Chilonzor ombor №1",
      "Chilonzor ombor №2",
    ],
    "Pop tumani": ["Pop ombori №2"],
  };
  const personsByWarehouse: Record<string, string[]> = {
    "Dustlik tumani markaziy ombor": [
      "Jŭraev Sharoб Toxirovich",
      "Karimov Aziz Rustamovich",
    ],
    "Chilonzor ombor №1": [
      "Yuldashev Sardor Ulug'bekovich",
      "Alimov Bobur Shavkatovich",
    ],
    "Pop ombori №2": [" Xolmatov Bekzod Shuxratovich"],
  };

  // Initial loading - sahifa ochilganda spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset cascade when parent changes (only if not editing)
  useEffect(() => {
    if (!documentData) {
      setSelectedDistrict("");
      setSelectedWarehouse("");
      setSelectedPerson("");
    }
  }, [selectedRegion, documentData]);

  useEffect(() => {
    if (!documentData) {
      setSelectedWarehouse("");
      setSelectedPerson("");
    }
  }, [selectedDistrict, documentData]);

  useEffect(() => {
    if (!documentData) {
      setSelectedPerson("");
    }
  }, [selectedWarehouse, documentData]);

  const handleCalendarClick = () => {
    dateInputRef.current?.showPicker?.();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPowerOfAttorney(file);
      setNotification({
        message: "Ishonchnoma muvaffaqiyatli yuklandi!",
        type: "success",
      });
    } else {
      setNotification({
        message: "Faqat PDF formatdagi fayllarni yuklash mumkin!",
        type: "danger",
      });
    }
  };

  const handleProductSelect = (product: ProductItem) => {
    const newProduct: DetailProduct = {
      id: `ITEM-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productType: product.type,
      model: product.model,
      size: product.size,
      unit: product.unit,
      quantity: 1,
      price: product.price,
      total: product.price,
      batchNumber: "",
      batchDate: "",
      account: "",
      productCode: "",
      barcode: "",
      shouldPrint: false,
      printCount: 0,
    };

    setProducts([...products, newProduct]);
  };

  const handleBarcodeSearch = (
    barcode: string,
    rowId: string,
  ) => {
    // Simulate searching product by barcode
    if (barcode.length >= 13) {
      // Mock: find product by barcode
      const foundProduct: ProductItem = {
        id: "5191",
        name: "РДБК-1.25 (Галлаорол)",
        type: "Регулятор",
        model: "РДНК-100",
        size: "60x60",
        unit: "Шт",
        price: 150000,
        code: barcode,
      };

      setProducts(
        products.map((p) =>
          p.id === rowId
            ? {
              ...p,
              productName: foundProduct.name,
              productType: foundProduct.type,
              model: foundProduct.model,
              size: foundProduct.size,
              unit: foundProduct.unit,
              price: foundProduct.price,
              total: p.quantity * foundProduct.price,
            }
            : p,
        ),
      );
    }
  };

  const handleGenerateBarcodes = () => {
    setLoading(true);
    setTimeout(() => {
      let barcodeCounter = 1;
      setProducts(
        products.map((p) => ({
          ...p,
          barcode:
            p.barcode ||
            `2${String(barcodeCounter++).padStart(12, "0")}`,
        })),
      );
      setLoading(false);
      setNotification({
        message: "Shtrix kodlar muvaffaqiyatli yuklandi!",
        type: "success",
      });
    }, 500);
  };

  const handleQuantityChange = (
    id: string,
    quantity: number,
  ) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, quantity, total: quantity * p.price }
          : p,
      ),
    );
  };

  const handlePriceChange = (id: string, price: number) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, price, total: p.quantity * price }
          : p,
      ),
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotification({
        message: "Hujjat muvaffaqiyatli saqlandi!",
        type: "success",
      });
    }, 600);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotification({
        message: "Hujjat muvaffaqiyatli tasdiqlandi!",
        type: "success",
      });
      setTimeout(() => {
        onNavigate?.(backView);
      }, 1000);
    }, 600);
  };

  const handlePrintBarcodes = () => {
    const printableProducts = products.filter(
      (p) => p.shouldPrint && p.barcode && p.printCount > 0,
    );
    if (printableProducts.length === 0) {
      setNotification({
        message: "Chop etish uchun mahsulot topilmadi!",
        type: "danger",
      });
      return;
    }
    setIsPrintModalOpen(true);
  };

  const handleSelectAllPrint = (checked: boolean) => {
    setSelectAllPrint(checked);
    setProducts(
      products.map((p) => ({
        ...p,
        shouldPrint: checked,
        printCount: checked ? p.quantity : 0,
      })),
    );
  };

  const totalSum = products.reduce(
    (sum, p) => sum + p.total,
    0,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount);
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        {/* Read-Only Warning Notification */}
        {isReadOnly && (
          <div className="flex-shrink-0 bg-yellow-50 border-b-2 border-yellow-200 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="size-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-900">
                  Hujjat tasdiqlanganligi sababli faqat ko'rish rejimi
                </h3>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Tasdiqlangan hujjatlarni o'zgartirish mumkin emas. Faqat ma'lumotlarni ko'rishingiz va chop etishingiz mumkin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header - Clean and Modern */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.(backView)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="size-4" />
              </button>
              <h1 className="font-bold text-gray-900 text-[14px]">
                {title}
              </h1>

              {/* Action Buttons - Moved here */}
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-3 mr-3">
                  <div>
                    <p className="text-[9px] font-medium text-gray-500 uppercase">
                      Jami maxsulotlar
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {products.length} ta
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-gray-500 uppercase">
                      Umumiy summa
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {formatCurrency(totalSum)} so'm
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsProductSelectOpen(true)}
                  disabled={isReadOnly}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                >
                  <Plus className="size-3.5" />
                  Kiritish
                </button>
                <button
                  onClick={handleGenerateBarcodes}
                  disabled={isReadOnly}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-[10px] font-medium text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Barcode className="size-3.5" />
                  Shtrix
                </button>
                <button
                  onClick={handlePrintBarcodes}
                  disabled={isReadOnly}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-[10px] font-medium text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="size-3.5" />
                  Chop etish
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className="text-gray-600 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                title={isHeaderExpanded ? "Yopish" : "Ochish"}
              >
                {isHeaderExpanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
              <Button
                variant="solid"
                onClick={() => onNavigate?.(backView)}
                className="gap-1.5 hover:bg-gray-100 h-7 px-2.5 text-xs"
              >
                <X className="size-3.5" />
                Yopish
              </Button>
            </div>
          </div>

          {/* Document Info Grid - Collapsible */}
          {isHeaderExpanded && (
            <div className="pb-3 border-t border-gray-100 pt-3 space-y-3">
              {/* Row 1: Hujjat raqami, Sana, Kontragent, Shartnoma, Tovarlar kirimi turi */}
              <div className="grid grid-cols-5 gap-3">
                {/* Hujjat raqami */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Hujjat raqami
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sana */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Sana
                  </label>
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="datetime-local"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleCalendarClick}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Calendar className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Kontragent */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Kontragent
                  </label>
                  <div className="relative">
                    <select
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Tanlang</option>
                      {mockCounterparties.map((cp) => (
                        <option key={cp} value={cp}>
                          {cp}
                        </option>
                      ))}
                    </select>
                    {counterparty && (
                      <button
                        type="button"
                        onClick={() => setCounterparty("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Shartnoma */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Shartnoma
                  </label>
                  <div className="relative">
                    <select
                      value={contract}
                      onChange={(e) => setContract(e.target.value)}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Tanlang</option>
                      {mockContracts.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {contract && (
                      <button
                        type="button"
                        onClick={() => setContract("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tovarlar kirimi turi */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Tovarlar kirimi turi
                  </label>
                  <div className="relative">
                    <select
                      value={incomeType}
                      onChange={(e) => setIncomeType(e.target.value as "main" | "regional")}
                      className="w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="main">Asosiy ombor</option>
                      <option value="regional">Viloyat ombori</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Viloyat, Tuman, Ombor, MJSH, Ishonchnoma (if regional) */}
              <div className={`grid ${incomeType === "regional" ? "grid-cols-5" : "grid-cols-4"} gap-3`}>
                {/* Viloyat */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Viloyat
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) =>
                        setSelectedRegion(e.target.value)
                      }
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Tanlang</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {selectedRegion && (
                      <button
                        type="button"
                        onClick={() => setSelectedRegion("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tuman */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Tuman
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDistrict}
                      onChange={(e) =>
                        setSelectedDistrict(e.target.value)
                      }
                      disabled={!selectedRegion}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Tanlang</option>
                      {selectedRegion &&
                        districtsByRegion[selectedRegion]?.map(
                          (district) => (
                            <option
                              key={district}
                              value={district}
                            >
                              {district}
                            </option>
                          ),
                        )}
                    </select>
                    {selectedDistrict && (
                      <button
                        type="button"
                        onClick={() => setSelectedDistrict("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ombor */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Ombor
                  </label>
                  <div className="relative">
                    <select
                      value={selectedWarehouse}
                      onChange={(e) =>
                        setSelectedWarehouse(e.target.value)
                      }
                      disabled={!selectedDistrict}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Tanlang</option>
                      {selectedDistrict &&
                        warehousesByDistrict[
                          selectedDistrict
                        ]?.map((warehouse) => (
                          <option
                            key={warehouse}
                            value={warehouse}
                          >
                            {warehouse}
                          </option>
                        ))}
                    </select>
                    {selectedWarehouse && (
                      <button
                        type="button"
                        onClick={() => setSelectedWarehouse("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* MJSH */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    M.J.SH
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPerson}
                      onChange={(e) =>
                        setSelectedPerson(e.target.value)
                      }
                      disabled={!selectedWarehouse}
                      className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Tanlang</option>
                      {selectedWarehouse &&
                        personsByWarehouse[
                          selectedWarehouse
                        ]?.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
                        ))}
                    </select>
                    {selectedPerson && (
                      <button
                        type="button"
                        onClick={() => setSelectedPerson("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ishonchnoma kiriting - Only show if regional */}
                {incomeType === "regional" && (
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      Ishonchnoma kiriting
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="size-3" />
                      {powerOfAttorney ? (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <File className="size-3" />
                          {powerOfAttorney.name}
                        </span>
                      ) : (
                        <span className="text-gray-600">PDF yuklash</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Row 3: Asosiy hujjat */}
              <div className="border-t border-gray-200 pt-3">
                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                  Asos bo'luvchi hujjat
                </label>
                <div className="relative">
                  <select
                    value={baseDocument}
                    onChange={(e) => setBaseDocument(e.target.value)}
                    className="w-full px-2 py-1.5 pr-7 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Hujjat tanlang</option>
                    {mockBaseDocuments.map((doc) => (
                      <option key={doc.number} value={doc.number}>
                        {doc.number} - {doc.type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                </div>
                {baseDocument && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-blue-600">
                    <LinkIcon className="size-3" />
                    <a href="#" className="hover:underline font-medium">
                      {baseDocument} buyurtma xujjatiga asosan
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading Progress Bar */}
        {loading && (
          <div className="h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-loading-bar"></div>
          </div>
        )}

        {/* Initial Loading Progress Bar - Sahifa ochilganda */}
        {initialLoading && (
          <div className="h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-loading-bar"></div>
          </div>
        )}

        {/* Table with Custom Scrollbar and Shadow */}
        <div className="flex-1 overflow-auto relative custom-scrollbar rounded-t-lg border border-gray-200 border-b-0 bg-white ml-[4px] mr-[-3px] mt-[9px] mb-[1px]">
          <div className="table-wrapper">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr className="border-b-2 border-gray-300">
                  <th className="sticky left-0 z-20 bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-1.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-16 border-r border-gray-200">
                    №
                  </th>
                  <th className="px-3 py-1 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">
                    <div className="flex flex-col items-center gap-0.5">
                      <input
                        type="checkbox"
                        checked={selectAllPrint}
                        onChange={(e) => handleSelectAllPrint(e.target.checked)}
                        className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-[9px]">Chop</span>
                    </div>
                  </th>
                  <th className="px-3 py-1 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    chop soni
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-36 border-r border-gray-200">
                    Shtrix
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider min-w-64 border-r border-gray-200">
                    Maxsulot nomi
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-36 border-r border-gray-200">
                    Maxs. turi
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-28 border-r border-gray-200">
                    Model
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    O'cham
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">
                    O'l.bir
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">
                    Soni
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-28 border-r border-gray-200">
                    Narxi
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-32 border-r border-gray-200">
                    Summa
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    Part.№
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-28 border-r border-gray-200">
                    Part.sana
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    Schet
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    Kod
                  </th>
                  <th className="sticky right-0 z-20 bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-1.5 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-16 border-l border-gray-300">
                    Amal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-blue-50 transition-colors border-b border-gray-200"
                  >
                    <td className="sticky left-0 z-10 bg-white px-2 py-1 text-[10px] text-gray-900 font-medium border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1 text-center border-r border-gray-200">
                      <div className="flex justify-center">
                        <IOSToggle
                          checked={product.shouldPrint}
                          onChange={(checked) =>
                            setProducts(
                              products.map((p) =>
                                p.id === product.id
                                  ? {
                                    ...p,
                                    shouldPrint: checked,
                                  }
                                  : p,
                              ),
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        value={product.printCount}
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  printCount:
                                    parseInt(
                                      e.target.value,
                                    ) || 0,
                                }
                                : p,
                            ),
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="text"
                        value={product.barcode}
                        onChange={(e) => {
                          const newBarcode = e.target.value;
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, barcode: newBarcode }
                                : p,
                            ),
                          );
                          if (newBarcode.length === 13) {
                            handleBarcodeSearch(
                              newBarcode,
                              product.id,
                            );
                          }
                        }}
                        placeholder="13 xonali"
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <button
                        onClick={() =>
                          setIsProductSelectOpen(true)
                        }
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                      >
                        {product.productName || "Tanlash..."}
                      </button>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <SearchableSelect
                        options={mockProductTypes}
                        value={product.productType}
                        onChange={(value) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, productType: value }
                                : p,
                            ),
                          )
                        }
                        placeholder="Tanlang"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <SearchableSelect
                        options={mockModels}
                        value={product.model}
                        onChange={(value) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, model: value }
                                : p,
                            ),
                          )
                        }
                        placeholder="Tanlang"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <SearchableSelect
                        options={mockSizes}
                        value={product.size}
                        onChange={(value) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, size: value }
                                : p,
                            ),
                          )
                        }
                        placeholder="Tanlang"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <SearchableSelect
                        options={mockUnits}
                        value={product.unit}
                        onChange={(value) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, unit: value }
                                : p,
                            ),
                          )
                        }
                        placeholder="Tanlang"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        value={product.price}
                        onChange={(e) =>
                          handlePriceChange(
                            product.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 text-[10px] font-semibold text-gray-900 border-r border-gray-200">
                      {formatCurrency(product.total)}
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="text"
                        value={product.batchNumber}
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  batchNumber: e.target.value,
                                }
                                : p,
                            ),
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="date"
                        value={product.batchDate}
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  batchDate: e.target.value,
                                }
                                : p,
                            ),
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="text"
                        value={product.account}
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  account: e.target.value,
                                }
                                : p,
                            ),
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="text"
                        value={product.productCode}
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  productCode: e.target.value,
                                }
                                : p,
                            ),
                          )
                        }
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-2 py-1 text-center border-l border-gray-300">
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id)
                        }
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">
                Maxsulot qo'shish uchun quyidagi tugmalarni
                ishlating
              </p>
            </div>
          )}
        </div>

        {/* Footer 2 - Bottom Actions */}
        <div className="flex-shrink-0 bg-white rounded-b-lg shadow-md border border-gray-200 ml-[4px] mr-[-3px] mb-4">
          <div className="px-6 py-3">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleSave}
                disabled={isReadOnly}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 text-xs font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-yellow-400 disabled:hover:to-yellow-500"
              >
                <Save className="size-4" />
                Saqlash
              </button>
              <button
                onClick={handleConfirm}
                disabled={isReadOnly}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600"
              >
                <CheckCircle2 className="size-4" />
                Tasdiqlash
              </button>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-medium text-gray-700 rounded-lg transition-all"
              >
                <Printer className="size-4" />
                Chop etish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Select Modal */}
      <ProductSelectModal
        isOpen={isProductSelectOpen}
        onClose={() => setIsProductSelectOpen(false)}
        onSelect={handleProductSelect}
      />

      {/* Barcode Print Modal - Rulon etiketka */}
      <BarcodePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        products={products}
      />

      {/* Notification */}
      {notification && (
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 5px;
          border: 2px solid #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default ProductIncomeDetailView;