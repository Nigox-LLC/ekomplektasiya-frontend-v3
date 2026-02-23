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
  Filter,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import  SearchableSelect  from "./SearchableSelect";
import  BarcodePrintModal  from "./BarcodePrintModal";
import { toast } from "react-toastify";
import { Button } from "antd";

interface DetailProduct {
  id: string;
  productId: string;
  productName: string;
  productType: string;
  model: string;
  size: string;
  unit: string;
  stockQuantity: number; // Qoldiq soni (o'zgarmas)
  quantity: number; // Chiqim soni
  price: number;
  total: number;
  barcode: string;
  batchNumber: string;
  batchDate: string;
  account: string;
  productCode: string;
  status: "active" | "defective"; // Tovar holati
  note: string; // Izoh
  shouldPrint: boolean;
  printCount: number;
  returnType?: "warehouse" | "supplier"; // Qaytarish turi
  outcomeDocNumber?: string; // Chiqimi hujjati raqami
}

interface WarehouseProduct {
  id: string;
  name: string;
  type: string;
  model: string;
  size: string;
  unit: string;
  stockQuantity: number;
  price: number;
  barcode: string;
  batchNumber: string;
  batchDate: string;
  account: string;
  productCode: string;
}

interface ProductOutcomeDetailViewProps {
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
    returnType?: "warehouse" | "supplier"; // Qaytarish turi
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

// Mock ombordagi qoldiq tovarlar
const mockWarehouseProducts: WarehouseProduct[] = [
  {
    id: "1",
    name: "РДБК-1.25 (Галлаорол)",
    type: "Регулятор",
    model: "РДНК-100",
    size: "60x60",
    unit: "Шт",
    stockQuantity: 250,
    price: 150000,
    barcode: "2000000000001",
    batchNumber: "PT-001",
    batchDate: "2026-01-15",
    account: "10.01.02",
    productCode: "PRD-001",
  },
  {
    id: "2",
    name: "Труба стальная",
    type: "Труба",
    model: "Д-219",
    size: "219x8",
    unit: "п/м",
    stockQuantity: 500,
    price: 85000,
    barcode: "2000000000002",
    batchNumber: "PT-002",
    batchDate: "2026-01-20",
    account: "10.01.03",
    productCode: "PRD-002",
  },
  {
    id: "3",
    name: "Шланг газовый",
    type: "Шланг",
    model: "ДУ-32",
    size: "32мм",
    unit: "м",
    stockQuantity: 1200,
    price: 25000,
    barcode: "2000000000003",
    batchNumber: "PT-003",
    batchDate: "2026-02-01",
    account: "10.01.04",
    productCode: "PRD-003",
  },
  {
    id: "4",
    name: "Адаптер переходной",
    type: "Адаптер",
    model: "АП-50",
    size: "50x40",
    unit: "Шт",
    stockQuantity: 350,
    price: 45000,
    barcode: "2000000000004",
    batchNumber: "PT-004",
    batchDate: "2026-01-25",
    account: "10.01.05",
    productCode: "PRD-004",
  },
  {
    id: "5",
    name: "Фильтр газовый",
    type: "Фильтр газовый",
    model: "ФГ-100",
    size: "100мм",
    unit: "Шт",
    stockQuantity: 180,
    price: 120000,
    barcode: "2000000000005",
    batchNumber: "PT-005",
    batchDate: "2026-02-05",
    account: "10.01.06",
    productCode: "PRD-005",
  },
  {
    id: "6",
    name: "Кран шаровой",
    type: "Регулятор",
    model: "КШ-50",
    size: "50мм",
    unit: "Шт",
    stockQuantity: 420,
    price: 95000,
    barcode: "2000000000006",
    batchNumber: "PT-006",
    batchDate: "2026-01-18",
    account: "10.01.07",
    productCode: "PRD-006",
  },
  {
    id: "7",
    name: "Манометр",
    type: "Регулятор",
    model: "МТ-100",
    size: "100",
    unit: "Шт",
    stockQuantity: 150,
    price: 35000,
    barcode: "2000000000007",
    batchNumber: "PT-007",
    batchDate: "2026-02-10",
    account: "10.01.08",
    productCode: "PRD-007",
  },
  {
    id: "8",
    name: "Редуктор давления",
    type: "Регулятор",
    model: "РД-200",
    size: "200x150",
    unit: "Шт",
    stockQuantity: 90,
    price: 250000,
    barcode: "2000000000008",
    batchNumber: "PT-008",
    batchDate: "2026-01-28",
    account: "10.01.09",
    productCode: "PRD-008",
  },
];

const mockExpenseTypes = [
  "Sotish",
  "Sinov",
  "Nuqson",
  "Qaytarish",
  "Boshqa",
];

const mockBaseDocuments = [
  { number: "QLD-2026-001", type: "Maxsulotlar qoldig'i" },
  { number: "QLD-2026-002", type: "Maxsulotlar qoldig'i" },
  { number: "KRM-2026-015", type: "Maxsulotlar kirimi" },
  { number: "KRM-2026-016", type: "Maxsulotlar kirimi" },
];

// Mock Maxsulotlar chiqimi hujjatlari va tovarlari
interface OutcomeDocument {
  id: string;
  number: string;
  date: string;
  warehouse: string;
  products: WarehouseProduct[];
}

const mockOutcomeDocuments: OutcomeDocument[] = [
  {
    id: "1",
    number: "CHQ-2026-001",
    date: "15.01.2026",
    warehouse: "Markaziy ombor №1",
    products: [
      mockWarehouseProducts[0], // РДБК-1.25
      mockWarehouseProducts[1], // Труба стальная
      mockWarehouseProducts[2], // Шланг газовый
    ]
  },
  {
    id: "2",
    number: "CHQ-2026-002",
    date: "18.01.2026",
    warehouse: "Yunusobod ombori №2",
    products: [
      mockWarehouseProducts[3], // Адаптер переходной
      mockWarehouseProducts[4], // Фильтр газовый
    ]
  },
  {
    id: "3",
    number: "CHQ-2026-003",
    date: "20.01.2026",
    warehouse: "Markaziy ombor №1",
    products: [
      mockWarehouseProducts[5], // Кран шаровой
      mockWarehouseProducts[6], // Манометр
      mockWarehouseProducts[7], // Редуктор давления
    ]
  },
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
const ProductOutcomeDetailView: React.FC<ProductOutcomeDetailViewProps> = ({ onNavigate, documentId,   title: propTitle, backView = "products-outcome", documentData }) => {
  // Hujjat prefixini title ga qarab aniqlash
  const getDocPrefix = () => {
    if (propTitle?.includes("qaytarish")) return "QYT";
    if (propTitle?.includes("o'tkazish")) return "OTK";
    if (propTitle?.includes("to'g'irlash")) return "TGR";
    return "CHQ"; // Maxsulotlar chiqimi
  };
  
  // Qaytarish turi (getTitle() dan oldin e'lon qilish kerak)
  const returnType = documentData?.returnType || null;
  const isWarehouseReturn = returnType === "warehouse";
  const isSupplierReturn = returnType === "supplier";
  
  const [docNumber, setDocNumber] = useState(
    documentData?.number || `${getDocPrefix()}-2026-${documentId || "051"}`,
  );
  
  // Dinamik title - agar documentData bo'lsa "o'zgartirish", aks holda "yaratish"
  const getTitle = () => {
    // Yangi hujjat yaratish - documentData yo'q
    if (!documentData) {
      // Agar qaytarish bo'lsa
      if (propTitle?.includes("qaytarish")) {
        if (isWarehouseReturn) return "Omborga qaytarish yaratish";
        if (isSupplierReturn) return "Etkazib beruvchiga qaytarish yaratish";
      }
      return propTitle || "Maxsulotlar chiqimi yaratish";
    }
    
    // Mavjud hujjatni o'zgartirish - documentData bor
    return `№ ${documentData.number} ${propTitle?.replace("yaratish", "hujjatini o'zgartirish") || "Maxsulotlar chiqimi hujjatini o'zgartirish"}`;
  };
  
  const title = getTitle();
  const [docDate, setDocDate] = useState(
    documentData?.date
      ? new Date(
          documentData.date.split(".").reverse().join("-"),
        )
          .toISOString()
          .slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );

  // Read-only rejim - tasdiqlangan hujjatlar uchun
  const isReadOnly = documentData?.confirmStatus === "confirmed";

  const [expenseType, setExpenseType] = useState("");
  const [selectedContractor, setSelectedContractor] = useState("");
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(documentData?.region || "");
  const [selectedDistrict, setSelectedDistrict] = useState(documentData?.district || "");
  const [selectedWarehouse, setSelectedWarehouse] = useState(documentData?.warehouse || "");
  const [selectedPerson, setSelectedPerson] = useState(documentData?.responsiblePerson || "");

  const [products, setProducts] = useState<DetailProduct[]>([]);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectAllPrint, setSelectAllPrint] = useState(false);
  const [isBarcodePrintModalOpen, setIsBarcodePrintModalOpen] = useState(false);

  // Qoldiqlar modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalProducts, setModalProducts] = useState<WarehouseProduct[]>(mockWarehouseProducts);
  const [selectedModalProducts, setSelectedModalProducts] = useState<Set<string>>(new Set());
  const [modalProductQuantities, setModalProductQuantities] = useState<Record<string, number>>({});
  const [selectedOutcomeDoc, setSelectedOutcomeDoc] = useState<string>("");  // Tanlangan chiqim hujjati
  
  // Modal filtrlar - dropdown multiselect
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterBarcode, setFilterBarcode] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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
      "Jŭraev Sharof Toxirovich",
      "Karimov Aziz Rustamovich",
    ],
    "Chilonzor ombor №1": [
      "Yuldashev Sardor Ulug'bekovich",
      "Alimov Bobur Shavkatovich",
    ],
    "Pop ombori №2": ["Xolmatov Bekzod Shuxratovich"],
  };

  // Mock kontragentlar va shartnomalar (etkazib beruvchidan qaytarish uchun)
  const mockContractors = [
    "OOO \"GazTechService\"",
    "OOO \"UzGasComplect\"",
    "OOO \"EnergoSnab\"",
    "OOO \"TechnoGaz\"",
  ];

  const mockContracts = [
    "№ 2026/001 - 15.01.2026",
    "№ 2026/002 - 20.01.2026",
    "№ 2026/003 - 25.01.2026",
  ];

  // Tovar turlari
  const productTypes = Array.from(new Set(mockWarehouseProducts.map(p => p.type)));

  // Initial loading - sahifa ochilganda spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  // Qoldiqlar modal ochish
  const handleOpenModal = () => {
    setModalLoading(true);
    setIsModalOpen(true);
    
    // Agar warehouse return bo'lsa, birinchi chiqim hujjatini tanlash
    if (isWarehouseReturn && mockOutcomeDocuments.length > 0) {
      const firstDoc = mockOutcomeDocuments[0];
      setSelectedOutcomeDoc(firstDoc.number);
      setModalProducts(firstDoc.products);
    } else {
      setModalProducts(mockWarehouseProducts);
    }
    
    setTimeout(() => {
      setModalLoading(false);
    }, 600);
  };

  // Modal filtrlarni qo'llash
  const filteredModalProducts = modalProducts.filter(product => {
    const typeMatch = filterTypes.length === 0 || filterTypes.includes(product.type);
    const barcodeMatch = !filterBarcode || product.barcode.includes(filterBarcode);
    return typeMatch && barcodeMatch;
  });

  // Tovar turini filterga qo'shish/olib tashlash
  const toggleFilterType = (type: string) => {
    setFilterTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Barcha filtrlarni tozalash
  const clearAllFilters = () => {
    setFilterTypes([]);
  };

  // Modal tovarni tanlash/tanlashni bekor qilish
  const toggleModalProductSelection = (productId: string) => {
    const newSelected = new Set(selectedModalProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      const newQuantities = { ...modalProductQuantities };
      delete newQuantities[productId];
      setModalProductQuantities(newQuantities);
    } else {
      newSelected.add(productId);
    }
    setSelectedModalProducts(newSelected);
  };

  // Modal tovar sonini o'zgartirish
  const handleModalQuantityChange = (productId: string, quantity: number) => {
    const product = modalProducts.find(p => p.id === productId);
    if (product && quantity > product.stockQuantity) {
      toast.error(`Chiqim soni qoldiq sonidan ortiq bo'lishi mumkin emas!`, {
        duration: 3000,
      });
      // Avtomatik qoldiq soniga teng qilish
      setModalProductQuantities({
        ...modalProductQuantities,
        [productId]: product.stockQuantity,
      });
      return;
    }
    
    setModalProductQuantities({
      ...modalProductQuantities,
      [productId]: Math.max(0, quantity),
    });
  };

  // OK bosilganda tanlangan tovarlarni jadvalga qo'shish
  const handleAddSelectedProducts = () => {
    const productsToAdd: DetailProduct[] = [];
    
    selectedModalProducts.forEach(productId => {
      const product = modalProducts.find(p => p.id === productId);
      const quantity = modalProductQuantities[productId] || 0;
      
      if (product && quantity > 0) {
        // Jadvalda mavjudligini tekshirish
        const existingProduct = products.find(p => p.barcode === product.barcode);
        
        if (!existingProduct) {
          productsToAdd.push({
            id: `ITEM-${Date.now()}-${productId}`,
            productId: product.id,
            productName: product.name,
            productType: product.type,
            model: product.model,
            size: product.size,
            unit: product.unit,
            stockQuantity: product.stockQuantity,
            quantity: quantity,
            price: product.price,
            total: quantity * product.price,
            barcode: product.barcode,
            batchNumber: product.batchNumber,
            batchDate: product.batchDate,
            account: product.account,
            productCode: product.productCode,
            status: "active",
            note: "",
            shouldPrint: true,
            printCount: quantity,
            returnType: returnType || undefined,
            outcomeDocNumber: isWarehouseReturn ? selectedOutcomeDoc : undefined,
          });
        }
      }
    });

    if (productsToAdd.length > 0) {
      setProducts([...products, ...productsToAdd]);
      toast.success(`${productsToAdd.length} ta tovar jadvalga qo'shildi!`);
      
      // Reset modal
      setIsModalOpen(false);
      setSelectedModalProducts(new Set());
      setModalProductQuantities({});
      setFilterTypes([]);
      setFilterBarcode("");
    } else {
      toast.warning("Hech qanday tovar tanlanmagan yoki son kiritilmagan!");
    }
  };

  // Jadvalda chiqim sonini o'zgartirish
  const handleQuantityChange = (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (product && quantity > product.stockQuantity) {
      toast.error(`Chiqim soni qoldiq sonidan oshib ketdi! Qoldiq: ${product.stockQuantity} ${product.unit}`, {
        duration: 3000,
      });
      // Avtomatik qoldiq soniga teng qilish
      setProducts(
        products.map(p =>
          p.id === id
            ? { ...p, quantity: product.stockQuantity, total: product.stockQuantity * p.price }
            : p,
        ),
      );
      return;
    }
    
    setProducts(
      products.map(p =>
        p.id === id
          ? { ...p, quantity: Math.max(0, quantity), total: Math.max(0, quantity) * p.price }
          : p,
      ),
    );
  };

  // Izoh o'zgartirish
  const handleNoteChange = (id: string, note: string) => {
    setProducts(
      products.map(p =>
        p.id === id ? { ...p, note } : p,
      ),
    );
  };

  // Tovar holatini o'zgartirish
  const toggleProductStatus = (id: string) => {
    setProducts(
      products.map(p =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "defective" : "active" }
          : p,
      ),
    );
  };

  // Hammasini belgilash
  const handleSelectAllPrint = (checked: boolean) => {
    setSelectAllPrint(checked);
    setProducts(
      products.map(p => ({
        ...p,
        shouldPrint: checked,
        printCount: checked ? p.quantity : 0, // Chop etish soni = Chiqim soni
      }))
    );
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Hujjat muvaffaqiyatli saqlandi!");
    }, 600);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Hujjat muvaffaqiyatli tasdiqlandi!");
      setTimeout(() => {
        onNavigate?.(backView);
      }, 1000);
    }, 600);
  };

  const handlePrintBarcodes = () => {
    const printableProducts = products.filter(p => p.shouldPrint && p.printCount > 0);
    if (printableProducts.length === 0) {
      toast.warning("Chop etish uchun tovar tanlanmagan!");
      return;
    }
    setIsBarcodePrintModalOpen(true);
  };

  const totalSum = products.reduce((sum, p) => sum + p.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
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
                  onClick={handleOpenModal}
                  disabled={isReadOnly}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                >
                  <Plus className="size-3.5" />
                  {isWarehouseReturn ? "Chiqim tovarlar" : "Qoldiqlar"}
                </button>
                
                <button
                  onClick={handlePrintBarcodes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-[10px] font-medium text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={products.length === 0}
                >
                  <Printer className="size-3.5" />
                  Chop etish
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setIsHeaderExpanded(!isHeaderExpanded)
                }
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
                variant="outlined"
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
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-3">
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
                      type="datetime-local"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {docDate && (
                      <button
                        onClick={() => setDocDate('')}
                        className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tovar xarajat turlari */}
                
              </div>

              {/* Row 2 */}
              <div className="space-y-3">
                {/* Agar etkazib beruvchidan qaytarish bo'lsa - Kontragent va Shartnoma */}
                {isSupplierReturn && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Kontragent */}
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 mb-1">
                        Kontragent
                      </label>
                      <div className="relative">
                        <select
                          value={selectedContractor}
                          onChange={(e) => setSelectedContractor(e.target.value)}
                          className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Tanlang</option>
                          {mockContractors.map((contractor) => (
                            <option key={contractor} value={contractor}>
                              {contractor}
                            </option>
                          ))}
                        </select>
                        {selectedContractor && (
                          <button
                            onClick={() => setSelectedContractor('')}
                            className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                          >
                            <X className="size-3.5" />
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
                          value={selectedContract}
                          onChange={(e) => setSelectedContract(e.target.value)}
                          className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Tanlang</option>
                          {mockContracts.map((contract) => (
                            <option key={contract} value={contract}>
                              {contract}
                            </option>
                          ))}
                        </select>
                        {selectedContract && (
                          <button
                            onClick={() => setSelectedContract('')}
                            className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Viloyat, Tuman, Ombor, M.J.SH */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Viloyat va Tuman */}
                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                          onClick={() => {
                            setSelectedRegion('');
                            setSelectedDistrict('');
                            setSelectedWarehouse('');
                            setSelectedPerson('');
                          }}
                          className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        >
                          <X className="size-3.5" />
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
                        className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                          onClick={() => {
                            setSelectedDistrict('');
                            setSelectedWarehouse('');
                            setSelectedPerson('');
                          }}
                          className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Ombor va M.J.SH */}
                <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Tanlang</option>
                        {selectedDistrict &&
                          warehousesByDistrict[selectedDistrict]?.map(
                            (warehouse) => (
                              <option
                                key={warehouse}
                                value={warehouse}
                              >
                                {warehouse}
                              </option>
                            ),
                          )}
                      </select>
                      {selectedWarehouse && (
                        <button
                          onClick={() => {
                            setSelectedWarehouse('');
                            setSelectedPerson('');
                          }}
                          className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* M.J.SH */}
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
                        className="w-full px-2 py-1.5 pr-14 text-[11px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Tanlang</option>
                        {selectedWarehouse &&
                          personsByWarehouse[selectedWarehouse]?.map(
                            (person) => (
                              <option
                                key={person}
                                value={person}
                              >
                                {person}
                              </option>
                            ),
                          )}
                      </select>
                      {selectedPerson && (
                        <button
                          onClick={() => setSelectedPerson('')}
                          className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                    </div>
                    </div>
                  </div>
                </div>
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
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
            .table-wrapper {
              min-height: 100%;
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
                        onChange={(e) =>
                          handleSelectAllPrint(e.target.checked)
                        }
                        className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-[9px]">Chop</span>
                    </div>
                  </th>
                  <th className="px-4 py-1 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    chop soni
                  </th>
                  <th className="px-3 py-1 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">
                    tovar holati
                  </th>
                  <th className="px-7 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-36 border-r border-gray-200">
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
                  <th className="px-3 py-1 text-center text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200 bg-yellow-50">
                    Qoldiq soni
                  </th>
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">
                    Chiqim soni
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
                  <th className="px-3 py-1 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider min-w-48 border-r border-gray-200">
                    Izoh
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
                                      printCount: checked ? p.quantity : 0,
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
                    <td className="px-2 py-1 text-center border-r border-gray-200">
                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors mx-auto"
                      >
                        {product.status === "active" ? (
                          <>
                            <CheckCircle className="size-4 text-green-600" />
                            <span className="text-[10px] text-green-700 font-medium">Faol</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-4 text-red-600" />
                            <span className="text-[10px] text-red-700 font-medium">Yaroqsiz</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] font-mono text-gray-600 px-2 py-1">
                        {product.barcode}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-900 font-medium px-2 py-1">
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.productType}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.model}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.size}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.unit}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center border-r border-gray-200 bg-yellow-50">
                      <div className="text-[10px] font-bold text-gray-900 px-2 py-1">
                        {product.stockQuantity}
                      </div>
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
                      <div className="text-[10px] text-gray-600 px-2 py-1 text-right">
                        {formatCurrency(product.price)}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-900 font-semibold px-2 py-1 text-right">
                        {formatCurrency(product.total)}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.batchNumber}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {formatDate(product.batchDate)}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.account}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <div className="text-[10px] text-gray-600 px-2 py-1">
                        {product.productCode}
                      </div>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-200">
                      <input
                        type="text"
                        value={product.note}
                        onChange={(e) =>
                          handleNoteChange(product.id, e.target.value)
                        }
                        placeholder="Izoh..."
                        className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-2 py-1 text-center border-l border-gray-300">
                      <button
                        onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer - Sticky at Bottom */}
        <div className="flex-shrink-0 bg-white border-t-2 border-gray-300 shadow-lg">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-gray-500">Jami maxsulotlar</p>
                <p className="text-sm font-bold text-gray-900">
                  {products.length} ta
                </p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <p className="text-[10px] text-gray-500">Umumiy summa</p>
                <p className="text-sm font-bold text-blue-600">
                  {formatCurrency(totalSum)} so'm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isReadOnly || loading || products.length === 0}
                variant="outlined"
                className="gap-2 h-8"
              >
                <Save className="size-4" />
                Saqlash
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isReadOnly || loading || products.length === 0}
                className="gap-2 bg-blue-600 hover:bg-blue-700 h-8"
              >
                <CheckCircle2 className="size-4" />
                Tasdiqlash
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Qoldiqlar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/30">
          <div className="bg-white rounded-lg shadow-2xl w-[900px] max-h-[85vh] flex flex-col border border-gray-300 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base">
                    {isWarehouseReturn ? "Maxsulotlar chiqimi hujjatlari va tovarlari ro'yxati" : "Ombordagi qoldiq tovarlar ro'yxati"}
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Bugungi sana: {formatDate(new Date().toISOString())}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Filtrlar */}
              <div className="grid grid-cols-2 gap-3">
                {/* Agar warehouse return bo'lsa - Hujjat raqami dropdown */}
                {isWarehouseReturn ? (
                  <div>
                    <label className="block text-[10px] font-medium text-blue-100 mb-1">
                      Hujjat raqami
                    </label>
                    <select
                      value={selectedOutcomeDoc}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setSelectedOutcomeDoc(selected);
                        const doc = mockOutcomeDocuments.find(d => d.number === selected);
                        if (doc) {
                          setModalProducts(doc.products);
                          setSelectedModalProducts(new Set());
                          setModalProductQuantities({});
                        }
                      }}
                      className="w-full px-3 py-2 text-[11px] border border-blue-400 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                    >
                      {mockOutcomeDocuments.map((doc) => (
                        <option key={doc.number} value={doc.number} className="text-gray-900">
                          {doc.number} - {doc.date}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  // Tovar turi - Dropdown Multi-select
                  <div>
                    <label className="block text-[10px] font-medium text-blue-100 mb-1">
                      Tovar turi (Multi-select)
                    </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="w-full px-3 py-2 text-left text-sm border border-blue-400 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm flex items-center justify-between"
                    >
                      <span className="text-[11px]">
                        {filterTypes.length === 0
                          ? "Tanlang..."
                          : `${filterTypes.length} ta tanlangan`}
                      </span>
                      <ChevronDown className="size-4" />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-auto">
                        {/* Qidirish */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Qidirish..."
                              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                          </div>
                        </div>

                        {/* Ko'pini tanlash */}
                        <div className="border-b border-gray-200 p-2">
                          <button
                            onClick={() => {
                              if (filterTypes.length === productTypes.length) {
                                clearAllFilters();
                              } else {
                                setFilterTypes([...productTypes]);
                              }
                            }}
                            className="w-full px-2 py-1.5 text-xs text-left hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={filterTypes.length === productTypes.length}
                              readOnly
                              className="size-3.5"
                            />
                            <span className="font-medium text-gray-900">
                              Hammasini tanlash
                            </span>
                          </button>
                        </div>

                        {/* Ro'yxat */}
                        <div className="p-1">
                          {productTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => toggleFilterType(type)}
                              className="w-full px-2 py-1.5 text-xs text-left hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={filterTypes.includes(type)}
                                readOnly
                                className="size-3.5"
                              />
                              <span className="text-gray-900">{type}</span>
                            </button>
                          ))}
                        </div>

                        {/* Footer */}
                        {filterTypes.length > 0 && (
                          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-2 flex items-center justify-between">
                            <button
                              onClick={clearAllFilters}
                              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <X className="size-3" />
                              Tozalash
                            </button>
                            <button
                              onClick={() => setIsFilterDropdownOpen(false)}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            >
                              OK
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  </div>
                )}
                
                {/* Shtrix kod qidirish */}
                <div>
                  <label className="block text-[10px] font-medium text-blue-100 mb-1">
                    Shtrix kod qidirish
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filterBarcode}
                      onChange={(e) => setFilterBarcode(e.target.value)}
                      placeholder="Qidirish..."
                      className="w-full px-3 py-2 pr-8 text-sm border border-blue-400 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content - Jadval */}
            <div className="flex-1 overflow-auto">
              {modalLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="size-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-600 uppercase w-12">
                        <input
                          type="checkbox"
                          className="size-3.5"
                          checked={selectedModalProducts.size === filteredModalProducts.length && filteredModalProducts.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedModalProducts(new Set(filteredModalProducts.map(p => p.id)));
                            } else {
                              setSelectedModalProducts(new Set());
                              setModalProductQuantities({});
                            }
                          }}
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase">
                        Tovar nomi
                      </th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase">
                        Shtrix
                      </th>
                      {(isWarehouseReturn || isSupplierReturn) && (
                        <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase w-32">
                          {isWarehouseReturn ? "Chiqim hujjat" : "Kirim hujjat"}
                        </th>
                      )}
                      <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-600 uppercase w-24">
                        {isWarehouseReturn || isSupplierReturn ? "Manba soni" : "Chiqim soni"}
                      </th>
                      <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-600 uppercase w-28">
                        Qaytarish soni
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModalProducts.map((product) => {
                      const isSelected = selectedModalProducts.has(product.id);
                      const quantity = modalProductQuantities[product.id] || 0;
                      const isBarcodeMatch = filterBarcode && product.barcode.includes(filterBarcode);

                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                          onClick={() => toggleModalProductSelection(product.id)}
                        >
                          <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="size-3.5"
                              checked={isSelected}
                              onChange={() => toggleModalProductSelection(product.id)}
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-[11px] font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {product.type} • {product.model} • {product.unit}
                            </div>
                          </td>
                          <td className={`px-3 py-2.5 text-[11px] font-mono ${isBarcodeMatch ? 'bg-red-200 text-red-900 font-bold' : 'text-gray-600'}`}>
                            {product.barcode}
                          </td>
                          {isWarehouseReturn && (
                            <td className="px-3 py-2.5 text-[11px] text-gray-600">
                              {selectedOutcomeDoc}
                            </td>
                          )}
                          <td className="px-3 py-2.5 text-center text-sm font-bold text-gray-900">
                            {product.stockQuantity}
                          </td>
                          <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                            {isSelected ? (
                              <input
                                type="number"
                                value={quantity || ""}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleModalQuantityChange(
                                    product.id,
                                    parseInt(e.target.value) || 0,
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                max={product.stockQuantity}
                                placeholder="0"
                                className="w-full px-2 py-1 text-center text-sm border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-center text-sm text-gray-400">-</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-gray-500">Tanlangan tovarlar</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedModalProducts.size} ta
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-sm h-9"
                >
                  Yopish
                </Button>
                <Button
                  onClick={handleAddSelectedProducts}
                  disabled={selectedModalProducts.size === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
                >
                  <CheckCircle2 className="size-4 mr-1" />
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shtrix chop etish modal */}
      <BarcodePrintModal
        isOpen={isBarcodePrintModalOpen}
        onClose={() => setIsBarcodePrintModalOpen(false)}
        products={products
          .filter(p => p.shouldPrint && p.printCount > 0)
          .map(p => ({
            barcode: p.barcode,
            name: p.productName,
            printCount: p.printCount,
          }))}
      />
    </>
  );
}

export default ProductOutcomeDetailView;