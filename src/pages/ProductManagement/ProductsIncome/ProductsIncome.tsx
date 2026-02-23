import { useState, useEffect, useRef } from "react";
import ProductsBalanceReportModal from "@/pages/ProductManagement/components/ProductsBalanceReportModal";
import ConfirmDialog from "@/pages/ProductManagement/components/ConfirmDialog";
import TableLoadingSpinner from "@/pages/ProductManagement/components/TableLoadingSpinner";
import SuccessNotification from "@/pages/ProductManagement/components/SuccessNotification";
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  MapPin,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  Warehouse,
  X,
  Edit,
  TrendingUp,
  Package,
  Sheet,
  File,
  Clock,
  FileCheck,
  FileWarning,
  Users,
  FileSignature,
  ArrowUpDown,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, Input } from "antd";

interface ProductIncome {
  id: string;
  number: string;
  date: string;
  region: string;
  district: string;
  warehouse: string;
  responsiblePerson: string;
  contractor: string;
  contract: string;
  totalAmount: number;
  user: string;
  status: "active" | "archived";
  confirmStatus: "saved" | "confirmed";
}

interface Product {
  id: string;
  barcode: string;
  name: string;
  type: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

// Mock ma'lumotlar (50 ta - infinite scroll uchun)
const generateMockIncomes = (): ProductIncome[] => {
  const regions = [
    {
      name: "Buxoro viloyati",
      districts: ["Buxoro shahri", "Kogon tumani", "G'ijduvon tumani"],
    },
    {
      name: "Namangan viloyati",
      districts: ["Namangan shahri", "Pop tumani", "Uychi tumani"],
    },
    {
      name: "Toshkent shahar",
      districts: ["Yunusobod tumani", "Chilonzor tumani", "Mirobod tumani"],
    },
    {
      name: "Farg'ona viloyati",
      districts: ["Farg'ona shahri", "Qo'qon shahri", "Marg'ilon shahri"],
    },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
    "Namangan viloyati": ["Namangan ombori №1", "Pop ombori №2"],
    "Toshkent shahar": [
      "Markaziy ombor №1",
      "Yunusobod ombori №2",
      "Chilonzor ombori №3",
    ],
    "Farg'ona viloyati": ["Farg'ona ombori №1", "Qo'qon ombori №2"],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Buxoro ombori №1": [
      "Nazarov Dilshod Muzaffarovich",
      "Sultonova Madina Rustamovna",
    ],
    "Kogon ombori №2": [
      "Abdullayev Jamshid Akramovich",
      "Xolmatova Zilola Toxirovna",
    ],
    "Namangan ombori №1": [
      "Rahimov Otabek Shavkatovich",
      "Qodirova Sevara Ilhomovna",
    ],
    "Pop ombori №2": [
      "Nazarov Dilshod Muzaffarovich",
      "Azimova Gulnora Anvarovna",
    ],
    "Markaziy ombor №1": [
      "Karimov Jasur Akmalovich",
      "Alieva Nodira Shavkatovna",
    ],
    "Yunusobod ombori №2": [
      "Tursunov Aziz Bakhtiyorovich",
      "Yusupova Malika Rustamovna",
    ],
    "Chilonzor ombori №3": [
      "Rahimov Otabek Shavkatovich",
      "Nazarova Dilnoza Akramovna",
    ],
    "Farg'ona ombori №1": [
      "Tursunov Aziz Bakhtiyorovich",
      "Rahmonova Dildora Fazliddinovna",
    ],
    "Qo'qon ombori №2": [
      "Yuldashev Sardor Ulug'bekovich",
      "Karimova Feruza Toxirovna",
    ],
  };

  const contractors = [
    'MChJ "Texno Savdo"',
    'QMJ "Mebel Olami"',
    'MChJ "IT Solutions"',
    'MChJ "Office Pro"',
    'QMJ "Universal Trade"',
    'MChJ "Premium Furniture"',
    'MChJ "Tech World"',
  ];

  const contractsByContractor: { [key: string]: string[] } = {
    'MChJ "Texno Savdo"': ["TS-2025/001", "TS-2025/002", "TS-2025/003"],
    'QMJ "Mebel Olami"': ["MO-2025/001", "MO-2025/002"],
    'MChJ "IT Solutions"': [
      "IT-2025/001",
      "IT-2025/002",
      "IT-2025/003",
      "IT-2025/004",
    ],
    'MChJ "Office Pro"': ["OP-2025/001", "OP-2025/002"],
    'QMJ "Universal Trade"': ["UT-2025/001", "UT-2025/002", "UT-2025/003"],
    'MChJ "Premium Furniture"': ["PF-2025/001", "PF-2025/002"],
    'MChJ "Tech World"': ["TW-2025/001", "TW-2025/002", "TW-2025/003"],
  };

  const users = [
    "admin",
    "operator1",
    "operator2",
    "warehouse_manager",
    "manager1",
    "manager2",
  ];
  const statuses: ("active" | "archived")[] = [
    "active",
    "active",
    "active",
    "active",
    "archived",
  ];
  const confirmStatuses: ("saved" | "confirmed")[] = ["saved", "confirmed"];

  const incomes: ProductIncome[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData = regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district =
      regionData.districts[
        Math.floor(Math.random() * regionData.districts.length)
      ];
    const warehouseList = warehouses[region];
    const warehouse =
      warehouseList[Math.floor(Math.random() * warehouseList.length)];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson =
      responsibleList[Math.floor(Math.random() * responsibleList.length)];
    const contractor =
      contractors[Math.floor(Math.random() * contractors.length)];
    const contractList = contractsByContractor[contractor];
    const contract =
      contractList[Math.floor(Math.random() * contractList.length)];

    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const month = String(Math.floor(Math.random() * 2) + 1).padStart(2, "0");
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");

    incomes.push({
      id: String(i + 1),
      number: `KRM-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026 ${hour}:${minute}`,
      region,
      district,
      warehouse,
      responsiblePerson,
      contractor,
      contract,
      user: users[Math.floor(Math.random() * users.length)],
      totalAmount: (Math.floor(Math.random() * 800) + 100) * 1000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus:
        i < 3
          ? "confirmed"
          : confirmStatuses[Math.floor(Math.random() * confirmStatuses.length)],
    });
  }

  return incomes.sort(
    (a, b) =>
      parseInt(b.number.split("-")[2]) - parseInt(a.number.split("-")[2]),
  );
};

// Mock products for report
const generateMockProducts = (): Product[] => {
  const baseProducts = [
    {
      name: "Stol",
      type: "Mebel",
      model: "Standart-2024",
      size: "120x80",
      unit: "dona",
    },
    {
      name: "Stul",
      type: "Mebel",
      model: "Ofis-Pro",
      size: "50x50",
      unit: "dona",
    },
    {
      name: "Shkaf",
      type: "Mebel",
      model: "Premium-X",
      size: "200x100",
      unit: "dona",
    },
    {
      name: "Kompyuter",
      type: "Texnika",
      model: "Dell-5500",
      size: "-",
      unit: "dona",
    },
    {
      name: "Printer",
      type: "Texnika",
      model: "HP-3050",
      size: "-",
      unit: "dona",
    },
    {
      name: "Qog'oz A4",
      type: "Kanstovar",
      model: "Double A",
      size: "A4",
      unit: "paket",
    },
    {
      name: "Ruchka",
      type: "Kanstovar",
      model: "Pilot",
      size: "-",
      unit: "dona",
    },
    {
      name: "Monitor",
      type: "Texnika",
      model: 'Samsung 24"',
      size: "24 dyuym",
      unit: "dona",
    },
    {
      name: "Klaviatura",
      type: "Texnika",
      model: "Logitech K120",
      size: "-",
      unit: "dona",
    },
    {
      name: "Sichqoncha",
      type: "Texnika",
      model: "Logitech M90",
      size: "-",
      unit: "dona",
    },
  ];

  const products: Product[] = [];

  baseProducts.forEach((base, idx) => {
    for (let i = 0; i < 3; i++) {
      const index = products.length;
      const quantity = Math.floor(Math.random() * 500) + 10;
      const basePrice =
        [
          850000, 250000, 1500000, 4500000, 1200000, 35000, 3000, 2000000,
          450000, 180000,
        ][idx] || 100000;
      const price = basePrice + i * basePrice * 0.2;

      products.push({
        id: String(index + 1),
        barcode: `2026${String(index + 1).padStart(8, "0")}`,
        name: base.name,
        type: base.type,
        model: base.model,
        size: base.size,
        unit: base.unit,
        quantity: quantity,
        price: Math.floor(price),
        total: quantity * Math.floor(price),
      });
    }
  });

  return products;
};

const mockIncomes = generateMockIncomes();
const mockProducts = generateMockProducts();

// Viloyatga qarab omborlarni olish
const getWarehousesByRegions = (regions: string[]): string[] => {
  if (regions.length === 0) return [];

  const warehouses: { [key: string]: string[] } = {
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
    "Namangan viloyati": ["Namangan ombori №1", "Pop ombori №2"],
    "Toshkent shahar": [
      "Markaziy ombor №1",
      "Yunusobod ombori №2",
      "Chilonzor ombori №3",
    ],
    "Farg'ona viloyati": ["Farg'ona ombori №1", "Qo'qon ombori №2"],
  };

  const result: string[] = [];
  regions.forEach((region) => {
    if (warehouses[region]) {
      result.push(...warehouses[region]);
    }
  });

  return result;
};

// Omborga qarab javobgar shaxslarni olish
const getResponsiblesByWarehouses = (warehouses: string[]): string[] => {
  if (warehouses.length === 0) return [];

  const responsiblePersons: { [key: string]: string[] } = {
    "Buxoro ombori №1": [
      "Nazarov Dilshod Muzaffarovich",
      "Sultonova Madina Rustamovna",
    ],
    "Kogon ombori №2": [
      "Abdullayev Jamshid Akramovich",
      "Xolmatova Zilola Toxirovna",
    ],
    "Namangan ombori №1": [
      "Rahimov Otabek Shavkatovich",
      "Qodirova Sevara Ilhomovna",
    ],
    "Pop ombori №2": [
      "Nazarov Dilshod Muzaffarovich",
      "Azimova Gulnora Anvarovna",
    ],
    "Markaziy ombor №1": [
      "Karimov Jasur Akmalovich",
      "Alieva Nodira Shavkatovna",
    ],
    "Yunusobod ombori №2": [
      "Tursunov Aziz Bakhtiyorovich",
      "Yusupova Malika Rustamovna",
    ],
    "Chilonzor ombori №3": [
      "Rahimov Otabek Shavkatovich",
      "Nazarova Dilnoza Akramovna",
    ],
    "Farg'ona ombori №1": [
      "Tursunov Aziz Bakhtiyorovich",
      "Rahmonova Dildora Fazliddinovna",
    ],
    "Qo'qon ombori №2": [
      "Yuldashev Sardor Ulug'bekovich",
      "Karimova Feruza Toxirovna",
    ],
  };

  const result: string[] = [];
  warehouses.forEach((warehouse) => {
    if (responsiblePersons[warehouse]) {
      result.push(...responsiblePersons[warehouse]);
    }
  });

  return [...new Set(result)]; // Unique values
};

// Kontragentga qarab shartnomalarni olish
const getContractsByContractors = (contractors: string[]): string[] => {
  if (contractors.length === 0) return [];

  const contractsByContractor: { [key: string]: string[] } = {
    'MChJ "Texno Savdo"': ["TS-2025/001", "TS-2025/002", "TS-2025/003"],
    'QMJ "Mebel Olami"': ["MO-2025/001", "MO-2025/002"],
    'MChJ "IT Solutions"': [
      "IT-2025/001",
      "IT-2025/002",
      "IT-2025/003",
      "IT-2025/004",
    ],
    'MChJ "Office Pro"': ["OP-2025/001", "OP-2025/002"],
    'QMJ "Universal Trade"': ["UT-2025/001", "UT-2025/002", "UT-2025/003"],
    'MChJ "Premium Furniture"': ["PF-2025/001", "PF-2025/002"],
    'MChJ "Tech World"': ["TW-2025/001", "TW-2025/002", "TW-2025/003"],
  };

  const result: string[] = [];
  contractors.forEach((contractor) => {
    if (contractsByContractor[contractor]) {
      result.push(...contractsByContractor[contractor]);
    }
  });

  return result;
};

interface ProductsIncomeViewProps {
  onNavigate?: (view: string, id?: string, data?: any) => void;
}

const ProductsIncome: React.FC<ProductsIncomeViewProps> = ({ onNavigate }) => {
  const [incomes, setIncomes] = useState<ProductIncome[]>(mockIncomes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(
    [],
  );
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<ProductIncome | null>(
    null,
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [viewingIncome, setViewingIncome] = useState<ProductIncome | null>(
    null,
  );

  // Confirm dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "confirm" | "unconfirm";
    income: ProductIncome | null;
  }>({ isOpen: false, type: "delete", income: null });

  // Dropdown states
  const [openRegionDropdown, setOpenRegionDropdown] = useState(false);
  const [openWarehouseDropdown, setOpenWarehouseDropdown] = useState(false);
  const [openResponsibleDropdown, setOpenResponsibleDropdown] = useState(false);
  const [openContractorDropdown, setOpenContractorDropdown] = useState(false);
  const [openContractDropdown, setOpenContractDropdown] = useState(false);

  // Search states for dropdowns
  const [regionSearch, setRegionSearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [responsibleSearch, setResponsibleSearch] = useState("");
  const [contractorSearch, setContractorSearch] = useState("");
  const [contractSearch, setContractSearch] = useState("");

  // Infinite scroll states
  const [displayedItems, setDisplayedItems] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort states
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger";
  }>({ show: false, message: "", type: "success" });

  // Unique values
  const allRegions = Array.from(new Set(incomes.map((i) => i.region)));
  const allContractors = Array.from(new Set(incomes.map((i) => i.contractor)));

  // Cascade filters
  const availableWarehouses = getWarehousesByRegions(selectedRegions);
  const availableResponsibles = getResponsiblesByWarehouses(selectedWarehouses);
  const availableContracts = getContractsByContractors(selectedContractors);

  // Highlight text function
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-red-200 text-gray-900 px-0.5 rounded font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // Date conversion helper
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split(".");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filtrlash
  const filteredIncomes = incomes.filter((income) => {
    const matchesSearch =
      income.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.responsiblePerson
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      income.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegions.length === 0 || selectedRegions.includes(income.region);
    const matchesWarehouse =
      selectedWarehouses.length === 0 ||
      selectedWarehouses.includes(income.warehouse);
    const matchesResponsible =
      selectedResponsibles.length === 0 ||
      selectedResponsibles.includes(income.responsiblePerson);
    const matchesContractor =
      selectedContractors.length === 0 ||
      selectedContractors.includes(income.contractor);
    const matchesContract =
      selectedContracts.length === 0 ||
      selectedContracts.includes(income.contract);

    // Date filtering
    let matchesDate = true;
    const incomeDate = parseDate(income.date);

    if (dateFrom && incomeDate) {
      const fromDate = new Date(dateFrom);
      if (incomeDate < fromDate) matchesDate = false;
    }

    if (dateTo && incomeDate) {
      const toDate = new Date(dateTo);
      if (incomeDate > toDate) matchesDate = false;
    }

    return (
      matchesSearch &&
      matchesRegion &&
      matchesWarehouse &&
      matchesResponsible &&
      matchesContractor &&
      matchesContract &&
      matchesDate
    );
  });

  // Sort function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort filtered data
  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any = a[sortColumn as keyof ProductIncome];
    let bValue: any = b[sortColumn as keyof ProductIncome];

    // Handle date sorting
    if (sortColumn === "date") {
      const aDate = parseDate(a.date);
      const bDate = parseDate(b.date);
      if (!aDate || !bDate) return 0;
      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    // Handle number sorting
    if (sortColumn === "totalAmount" || sortColumn === "totalItems") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle status sorting
    if (sortColumn === "confirmStatus") {
      const statusOrder = { confirmed: 1, saved: 2 };
      const aOrder =
        statusOrder[a.confirmStatus as keyof typeof statusOrder] || 999;
      const bOrder =
        statusOrder[b.confirmStatus as keyof typeof statusOrder] || 999;
      return sortDirection === "asc" ? aOrder - bOrder : bOrder - aOrder;
    }

    // Handle string sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue, "uz")
        : bValue.localeCompare(aValue, "uz");
    }

    return 0;
  });

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (displayedItems < sortedIncomes.length) {
        setDisplayedItems((prev) => Math.min(prev + 10, sortedIncomes.length));
      }
    }
  };

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(10);

    // Filter loading
    if (
      searchQuery ||
      selectedRegions.length > 0 ||
      selectedWarehouses.length > 0 ||
      selectedResponsibles.length > 0 ||
      selectedContractors.length > 0 ||
      selectedContracts.length > 0 ||
      dateFrom ||
      dateTo
    ) {
      setFilterLoading(true);
      const timer = setTimeout(() => {
        setFilterLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [
    searchQuery,
    selectedRegions,
    selectedWarehouses,
    selectedResponsibles,
    selectedContractors,
    selectedContracts,
    dateFrom,
    dateTo,
  ]);

  // Sort loading
  useEffect(() => {
    if (sortColumn) {
      setSortLoading(true);
      const timer = setTimeout(() => {
        setSortLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sortColumn, sortDirection]);

  // Multiselect toggle
  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
    if (!selectedRegions.includes(region)) {
      setSelectedWarehouses([]);
      setSelectedResponsibles([]);
    }
  };

  const toggleWarehouse = (warehouse: string) => {
    setSelectedWarehouses((prev) =>
      prev.includes(warehouse)
        ? prev.filter((w) => w !== warehouse)
        : [...prev, warehouse],
    );
    if (!selectedWarehouses.includes(warehouse)) {
      setSelectedResponsibles([]);
    }
  };

  const toggleResponsible = (responsible: string) => {
    setSelectedResponsibles((prev) =>
      prev.includes(responsible)
        ? prev.filter((r) => r !== responsible)
        : [...prev, responsible],
    );
  };

  const toggleContractor = (contractor: string) => {
    setSelectedContractors((prev) =>
      prev.includes(contractor)
        ? prev.filter((c) => c !== contractor)
        : [...prev, contractor],
    );
    if (!selectedContractors.includes(contractor)) {
      setSelectedContracts([]);
    }
  };

  const toggleContract = (contract: string) => {
    setSelectedContracts((prev) =>
      prev.includes(contract)
        ? prev.filter((c) => c !== contract)
        : [...prev, contract],
    );
  };

  // Remove single filter
  const removeRegion = (region: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r !== region));
    setSelectedWarehouses([]);
    setSelectedResponsibles([]);
  };

  const removeWarehouse = (warehouse: string) => {
    setSelectedWarehouses((prev) => prev.filter((w) => w !== warehouse));
    setSelectedResponsibles([]);
  };

  const removeResponsible = (responsible: string) => {
    setSelectedResponsibles((prev) => prev.filter((r) => r !== responsible));
  };

  const removeContractor = (contractor: string) => {
    setSelectedContractors((prev) => prev.filter((c) => c !== contractor));
    setSelectedContracts([]);
  };

  const removeContract = (contract: string) => {
    setSelectedContracts((prev) => prev.filter((c) => c !== contract));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedWarehouses([]);
    setSelectedResponsibles([]);
    setSelectedContractors([]);
    setSelectedContracts([]);
    setDateFrom("");
    setDateTo("");
  };

  // Row selection function
  const handleRowClick = (incomeId: string) => {
    setSelectedRowId((prev) => (prev === incomeId ? null : incomeId));
  };

  const handleViewProducts = (income: ProductIncome) => {
    setViewingIncome(income);
    setShowProductsModal(true);
  };

  const handleConfirm = (income: ProductIncome) => {
    if (income.confirmStatus === "confirmed") {
      // Agar tasdiqlangan bo'lsa, bekor qilishni so'raymiz
      setConfirmDialog({
        isOpen: true,
        type: "unconfirm",
        income: income,
      });
    } else {
      // Agar saqlangan bo'lsa, tasdiqlashni so'raymiz
      setConfirmDialog({
        isOpen: true,
        type: "confirm",
        income: income,
      });
    }
  };

  const handleDelete = (income: ProductIncome) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      income: income,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.income) return;

    const docNumber = confirmDialog.income.number;

    if (confirmDialog.type === "confirm") {
      setIncomes((prev) =>
        prev.map((i) =>
          i.id === confirmDialog.income!.id
            ? { ...i, confirmStatus: "confirmed" as const }
            : i,
        ),
      );
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjatni tasdiqladingiz`,
        type: "success",
      });
    } else if (confirmDialog.type === "unconfirm") {
      setIncomes((prev) =>
        prev.map((i) =>
          i.id === confirmDialog.income!.id
            ? { ...i, confirmStatus: "saved" as const }
            : i,
        ),
      );
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjat tasdiqlashdan bekor qilindi`,
        type: "danger",
      });
    } else if (confirmDialog.type === "delete") {
      setIncomes((prev) =>
        prev.filter((i) => i.id !== confirmDialog.income!.id),
      );
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjat o'chirildi`,
        type: "danger",
      });
    }
  };

  const handleEdit = (income: ProductIncome) => {
    setSelectedIncome(income);
    // Navigate to detail view with document data
    onNavigate?.("products-income-detail", income.id.toString(), {
      number: income.number,
      date: income.date,
      region: income.region,
      district: income.district,
      warehouse: income.warehouse,
      responsiblePerson: income.responsiblePerson,
      confirmStatus: income.confirmStatus,
    });
  };

  // Formatlar
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("uz-UZ").format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("UZS", "so'm");
  };

  return (
    <>
      {/* Notification */}
      {notification.show && (
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ show: false, message: "", type: "success" })
          }
        />
      )}

      <div className="flex flex-col h-full overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 bg-gray-50 pb-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Maxsulotlar kirimi ro'yxati
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Jami:{" "}
                <span className="font-semibold text-gray-700">
                  {filteredIncomes.length}
                </span>{" "}
                ta kirim hujjati
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="size-4 mr-2" />
                {showFilters ? "Filtrlarni yashirish" : "Filtrlarni ko'rsatish"}
              </Button>
              <Button variant="outlined" size="small">
                <Download className="size-4 mr-2" />
                Excel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="small"
                onClick={() => onNavigate?.("products-income-detail", "new")}
              >
                <Plus className="size-4 mr-2" />
                Yangi kirim
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Jami hujjatlar */}
            <Card className="p-3 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Jami hujjatlar</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(filteredIncomes.length)}
                  </p>
                </div>
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="size-5 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Jami maxsulotlar - bosiladigan */}
            <Card
              className="p-3 bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setShowReportModal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Jami maxsulotlar</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(mockProducts.length)} ta
                  </p>
                </div>
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="size-5 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Umumiy summa */}
            <Card className="p-3 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Umumiy summa</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      filteredIncomes.reduce(
                        (sum, i) => sum + i.totalAmount,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="size-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="size-5 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="p-4 bg-gray-50 border border-gray-200 bg-[#ededed]">
              <div className="space-y-3">
                {/* Search and Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qidirish
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Hujjat raqam.."
                        className="pl-9 pr-9 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanadan
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="bg-white pr-9"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        max={dateTo || undefined}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanagacha
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="bg-white pr-9"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom || undefined}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 1: Viloyat, Ombor, MJSH */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Regions Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Viloyatlar
                    </label>
                    <button
                      onClick={() => {
                        setOpenRegionDropdown(!openRegionDropdown);
                        setOpenWarehouseDropdown(false);
                        setOpenResponsibleDropdown(false);
                        setOpenContractorDropdown(false);
                        setOpenContractDropdown(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                    >
                      <span className="text-gray-500">
                        {selectedRegions.length > 0
                          ? `${selectedRegions.length} ta tanlandi`
                          : "Avval viloyatni tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openRegionDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        <Input
                          type="text"
                          placeholder="Qidirish..."
                          className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                          value={regionSearch}
                          onChange={(e) => setRegionSearch(e.target.value)}
                        />
                        {allRegions
                          .filter((region) =>
                            region
                              .toLowerCase()
                              .includes(regionSearch.toLowerCase()),
                          )
                          .map((region) => (
                            <label
                              key={region}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedRegions.includes(region)}
                                onChange={() => toggleRegion(region)}
                                className="size-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {region}
                              </span>
                            </label>
                          ))}
                      </div>
                    )}

                    {/* Selected regions badges */}
                    {selectedRegions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRegions.map((region) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {region}
                            <button
                              onClick={() => removeRegion(region)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warehouses Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Omborlar
                    </label>
                    <button
                      onClick={() => {
                        if (availableWarehouses.length > 0) {
                          setOpenWarehouseDropdown(!openWarehouseDropdown);
                          setOpenRegionDropdown(false);
                          setOpenResponsibleDropdown(false);
                          setOpenContractorDropdown(false);
                          setOpenContractDropdown(false);
                        }
                      }}
                      disabled={availableWarehouses.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-500">
                        {availableWarehouses.length === 0
                          ? "Avval viloyatni tanlang"
                          : selectedWarehouses.length > 0
                            ? `${selectedWarehouses.length} ta tanlandi`
                            : "Avval omborni tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openWarehouseDropdown &&
                      availableWarehouses.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          <Input
                            type="text"
                            placeholder="Qidirish..."
                            className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                            value={warehouseSearch}
                            onChange={(e) => setWarehouseSearch(e.target.value)}
                          />
                          {availableWarehouses
                            .filter((warehouse) =>
                              warehouse
                                .toLowerCase()
                                .includes(warehouseSearch.toLowerCase()),
                            )
                            .map((warehouse) => (
                              <label
                                key={warehouse}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedWarehouses.includes(
                                    warehouse,
                                  )}
                                  onChange={() => toggleWarehouse(warehouse)}
                                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {warehouse}
                                </span>
                              </label>
                            ))}
                        </div>
                      )}

                    {/* Selected warehouses badges */}
                    {selectedWarehouses.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedWarehouses.map((warehouse) => (
                          <Badge
                            key={warehouse}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {warehouse}
                            <button
                              onClick={() => removeWarehouse(warehouse)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Responsible persons Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MJSH
                    </label>
                    <button
                      onClick={() => {
                        if (availableResponsibles.length > 0) {
                          setOpenResponsibleDropdown(!openResponsibleDropdown);
                          setOpenRegionDropdown(false);
                          setOpenWarehouseDropdown(false);
                          setOpenContractorDropdown(false);
                          setOpenContractDropdown(false);
                        }
                      }}
                      disabled={availableResponsibles.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-500">
                        {availableResponsibles.length === 0
                          ? "Avval omborni tanlang"
                          : selectedResponsibles.length > 0
                            ? `${selectedResponsibles.length} ta tanlandi`
                            : "Tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openResponsibleDropdown &&
                      availableResponsibles.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          <Input
                            type="text"
                            placeholder="Qidirish..."
                            className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                            value={responsibleSearch}
                            onChange={(e) =>
                              setResponsibleSearch(e.target.value)
                            }
                          />
                          {availableResponsibles
                            .filter((responsible) =>
                              responsible
                                .toLowerCase()
                                .includes(responsibleSearch.toLowerCase()),
                            )
                            .map((responsible) => (
                              <label
                                key={responsible}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedResponsibles.includes(
                                    responsible,
                                  )}
                                  onChange={() =>
                                    toggleResponsible(responsible)
                                  }
                                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {responsible}
                                </span>
                              </label>
                            ))}
                        </div>
                      )}

                    {/* Selected responsibles badges */}
                    {selectedResponsibles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedResponsibles.map((responsible) => (
                          <Badge
                            key={responsible}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {responsible}
                            <button
                              onClick={() => removeResponsible(responsible)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Kontragent, Shartnoma */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contractors Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontragent
                    </label>
                    <button
                      onClick={() => {
                        setOpenContractorDropdown(!openContractorDropdown);
                        setOpenRegionDropdown(false);
                        setOpenWarehouseDropdown(false);
                        setOpenResponsibleDropdown(false);
                        setOpenContractDropdown(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                    >
                      <span className="text-gray-500">
                        {selectedContractors.length > 0
                          ? `${selectedContractors.length} ta tanlandi`
                          : "Kontragent tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openContractorDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        <Input
                          type="text"
                          placeholder="Qidirish..."
                          className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                          value={contractorSearch}
                          onChange={(e) => setContractorSearch(e.target.value)}
                        />
                        {allContractors
                          .filter((contractor) =>
                            contractor
                              .toLowerCase()
                              .includes(contractorSearch.toLowerCase()),
                          )
                          .map((contractor) => (
                            <label
                              key={contractor}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedContractors.includes(
                                  contractor,
                                )}
                                onChange={() => toggleContractor(contractor)}
                                className="size-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {contractor}
                              </span>
                            </label>
                          ))}
                      </div>
                    )}

                    {/* Selected contractors badges */}
                    {selectedContractors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedContractors.map((contractor) => (
                          <Badge
                            key={contractor}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {contractor}
                            <button
                              onClick={() => removeContractor(contractor)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contracts Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shartnoma
                    </label>
                    <button
                      onClick={() => {
                        if (availableContracts.length > 0) {
                          setOpenContractDropdown(!openContractDropdown);
                          setOpenRegionDropdown(false);
                          setOpenWarehouseDropdown(false);
                          setOpenResponsibleDropdown(false);
                          setOpenContractorDropdown(false);
                        }
                      }}
                      disabled={availableContracts.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-500">
                        {availableContracts.length === 0
                          ? "Avval kontragent tanlang"
                          : selectedContracts.length > 0
                            ? `${selectedContracts.length} ta tanlandi`
                            : "Shartnoma tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openContractDropdown && availableContracts.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        <Input
                          type="text"
                          placeholder="Qidirish..."
                          className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                          value={contractSearch}
                          onChange={(e) => setContractSearch(e.target.value)}
                        />
                        {availableContracts
                          .filter((contract) =>
                            contract
                              .toLowerCase()
                              .includes(contractSearch.toLowerCase()),
                          )
                          .map((contract) => (
                            <label
                              key={contract}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedContracts.includes(contract)}
                                onChange={() => toggleContract(contract)}
                                className="size-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {contract}
                              </span>
                            </label>
                          ))}
                      </div>
                    )}

                    {/* Selected contracts badges */}
                    {selectedContracts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedContracts.map((contract) => (
                          <Badge
                            key={contract}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {contract}
                            <button
                              onClick={() => removeContract(contract)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear All Filters Button */}
                {(searchQuery ||
                  selectedRegions.length > 0 ||
                  selectedWarehouses.length > 0 ||
                  selectedResponsibles.length > 0 ||
                  selectedContractors.length > 0 ||
                  selectedContracts.length > 0 ||
                  dateFrom ||
                  dateTo) && (
                  <div className="flex justify-end">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={clearAllFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="size-4 mr-2" />
                      Barcha filtrlarni tozalash
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Scrollable Table */}
        <div
          className="flex-1 overflow-auto"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table
              className="w-full border-collapse"
            >
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th
                    className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10"
                  >
                    №
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("number")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Hujjat raqami</span>
                      {sortColumn === "number" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Sana soat</span>
                      {sortColumn === "date" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("region")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Viloyat</span>
                      {sortColumn === "region" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("warehouse")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Ombor</span>
                      {sortColumn === "warehouse" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("responsiblePerson")}
                  >
                    <div className="flex items-center gap-2">
                      <span>MJSH</span>
                      {sortColumn === "responsiblePerson" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("contractor")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Kontragent</span>
                      {sortColumn === "contractor" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("contract")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Shartnoma</span>
                      {sortColumn === "contract" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors min-w-max"
                    onClick={() => handleSort("totalAmount")}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      <span>Jami summa</span>
                      {sortColumn === "totalAmount" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 min-w-max"
                  >
                    Foydalanuvchi
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky right-[70px] top-0 bg-gray-100 z-20 cursor-pointer hover:bg-gray-200 transition-colors shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] min-w-max"
                    onClick={() => handleSort("confirmStatus")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Status</span>
                      {sortColumn === "confirmStatus" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider sticky right-0 top-0 bg-gray-100 z-20 min-w-max"
                  >
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialLoading || filterLoading || sortLoading ? (
                  <tr>
                    <td colSpan={12} className="p-0">
                      <TableLoadingSpinner
                        message={
                          initialLoading
                            ? "Ma'lumotlar yuklanmoqda..."
                            : filterLoading
                              ? "Filtrlanmoqda..."
                              : "Tartiblashmoqda..."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  sortedIncomes
                    .slice(0, displayedItems)
                    .map((income, index) => (
                      <tr
                        key={income.id}
                        className={`transition-colors ${selectedRowId === income.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                      >
                        <td
                          className={`px-2 py-2 whitespace-nowrap text-xs text-gray-500 border-r border-gray-200 ${selectedRowId === income.id ? "bg-blue-50" : "bg-white"}`}
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap border-r border-gray-200 cursor-pointer ${selectedRowId === income.id ? "bg-blue-50" : "bg-white"} min-w-max`}
                          onClick={() => handleRowClick(income.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-6 rounded flex items-center justify-center flex-shrink-0 ${
                                income.confirmStatus === "confirmed"
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                              }`}
                            >
                              <FileCheck
                                className={`size-3.5 ${
                                  income.confirmStatus === "confirmed"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                                }`}
                              />
                            </div>
                            <span
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-600 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(income);
                              }}
                            >
                              {highlightText(income.number, searchQuery)}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.date}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.region}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.warehouse}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.responsiblePerson}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.contractor}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.contract}
                        </td>
                        <td
                          className="px-3 py-2 whitespace-nowrap text-xs text-right border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          <div className="font-bold text-green-600">
                            {formatCurrency(income.totalAmount)}
                          </div>
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer min-w-max"
                          onClick={() => handleRowClick(income.id)}
                        >
                          {income.user}
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap text-center border-r border-gray-200 sticky right-[70px] z-10 cursor-pointer shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] ${selectedRowId === income.id ? "bg-blue-50" : "bg-white"} min-w-max`}
                          onClick={() => handleRowClick(income.id)}
                        >
                          <Badge
                            className={
                              income.confirmStatus === "confirmed"
                                ? "bg-blue-100 text-blue-700 border-0 px-2 py-0.5 text-xs"
                                : "bg-yellow-100 text-yellow-700 border-0 px-2 py-0.5 text-xs"
                            }
                          >
                            {income.confirmStatus === "confirmed"
                              ? "Tasdiqlangan"
                              : "Saqlangan"}
                          </Badge>
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap text-center sticky right-0 z-10 ${selectedRowId === income.id ? "bg-blue-50" : "bg-white"} min-w-max`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outlined"
                              size="small"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProducts(income);
                              }}
                              title="Ko'rish"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(income);
                              }}
                              title="O'chirish"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              className={
                                income.confirmStatus === "confirmed"
                                  ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-7 px-2"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirm(income);
                              }}
                              title={
                                income.confirmStatus === "confirmed"
                                  ? "Bekor qilish"
                                  : "Tasdiqlash"
                              }
                            >
                              {income.confirmStatus === "confirmed" ? (
                                <XCircle className="size-3.5" />
                              ) : (
                                <CheckCircle className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

            {/* Loading more indicator */}
            {displayedItems < sortedIncomes.length && (
              <div className="text-center py-4 text-gray-500 text-xs border-t border-gray-200">
                Yuklanmoqda... ({displayedItems} / {sortedIncomes.length})
              </div>
            )}

            {/* Empty state */}
            {filteredIncomes.length === 0 && (
              <div className="text-center py-12">
                <Package className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Hech qanday ma'lumot topilmadi
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Modal */}
        <ProductsBalanceReportModal
          isOpen={showReportModal}
          products={mockProducts}
          onClose={() => setShowReportModal(false)}
          title="Jami maxsulotlar kirimi"
          initialBarcodeFilter={searchQuery}
        />

        {/* Products View Modal */}
        {showProductsModal && viewingIncome && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
            onClick={() => setShowProductsModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full h-full max-h-[90vh] md:max-w-5xl overflow-hidden flex flex-col mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Package className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {viewingIncome.number}
                    </h2>
                    <p className="text-sm text-blue-100">
                      Hujjat raqamiga tegishli maxsulotlar ro'yxati
                    </p>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowProductsModal(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Products Table */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          №
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          Shtrix kod
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          Tovar turi
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          Model
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          O'lcham
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          O'lchov birligi
                        </th>
                        <th
                          className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          Soni
                        </th>
                        <th
                          className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-max"
                        >
                          Narxi
                        </th>
                        <th
                          className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-max"
                        >
                          Summasi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockProducts.slice(0, 15).map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-500 border-r border-gray-200">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 font-mono border-r border-gray-200">
                            {product.barcode}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-200">
                            {product.name}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.model}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.size}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.unit}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 text-right font-semibold border-r border-gray-200">
                            {formatNumber(product.quantity)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 text-right font-semibold border-r border-gray-200">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-3 py-2 text-xs text-green-600 text-right font-bold">
                            {formatCurrency(product.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-3 text-sm font-bold text-gray-900 text-right"
                        >
                          Jami:
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-gray-900 text-right border-r border-gray-200">
                          {formatNumber(
                            mockProducts
                              .slice(0, 15)
                              .reduce((sum, p) => sum + p.quantity, 0),
                          )}
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-gray-900 text-right border-r border-gray-200">
                          -
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-green-600 text-right">
                          {formatCurrency(
                            mockProducts
                              .slice(0, 15)
                              .reduce((sum, p) => sum + p.total, 0),
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                <Button
                  variant="outlined"
                  onClick={() => setShowProductsModal(false)}
                >
                  Yopish
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedIncome && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full h-full max-h-[90vh] md:max-w-4xl overflow-hidden flex flex-col mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedIncome.number}
                    </h2>
                    <p className="text-sm text-blue-100">
                      Maxsulotlar kirimi ma'lumotlari
                    </p>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSelectedIncome(null)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Sana soat
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.date}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Viloyat
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.region}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tuman
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.district}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Ombor
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.warehouse}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      MJSH
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.responsiblePerson}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Kontragent
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.contractor}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Shartnoma
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.contract}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Foydalanuvchi
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedIncome.user}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <Badge
                      className={
                        selectedIncome.confirmStatus === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {selectedIncome.confirmStatus === "confirmed"
                        ? "Tasdiqlangan"
                        : "Saqlangan"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Jami summa
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(selectedIncome.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <Button
                  variant="outlined"
                  onClick={() => setSelectedIncome(null)}
                >
                  Yopish
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="size-4 mr-2" />
                  Yuklab olish
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() =>
            setConfirmDialog({ isOpen: false, type: "delete", income: null })
          }
          onConfirm={handleConfirmAction}
          title={
            confirmDialog.type === "delete"
              ? "Hujjatni o'chirish"
              : confirmDialog.type === "unconfirm"
                ? "Tasdiqlashni bekor qilish"
                : "Hujjatni tasdiqlash"
          }
          message={
            confirmDialog.type === "delete"
              ? `"${confirmDialog.income?.number}" hujjatini o'chirmoqchimisiz?`
              : confirmDialog.type === "unconfirm"
                ? `"${confirmDialog.income?.number}" hujjatini tasdiqlashni bekor qilmoqchimisiz?`
                : `"${confirmDialog.income?.number}" hujjatini tasdiqlashni xohlaysizmi?`
          }
          confirmText="Ha"
          cancelText="Yo'q"
          type={confirmDialog.type === "delete" ? "danger" : "info"}
        />
      </div>
    </>
  );
};

export default ProductsIncome;
