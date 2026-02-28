import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  FileText,
  Download,
  Trash2,
  Eye,
  ChevronsRight,
  FileSignature,
  FilePlus2,
  Send,
  AlertTriangle,
  ShoppingCart,
  KeyRound,
  UserCheck,
  Building,
  CalendarDays,
  BadgeCheck,
  ArrowLeft,
  ArrowDown,
  User,
} from "lucide-react";
import { axiosAPI } from "../../service/axiosAPI";

// --- Interfeyslar (o'zgarishsiz) ---
interface AppealLetter {
  id: string;
  number: string;
  sender: string;
  subject: string;
  date: string;
  status: "new" | "in-progress" | "resolved";
  category: string;
}
interface SignatureKey {
  id: string;
  fullName: string;
  type: "Yuridik shaxs" | "Jismoniy shaxs";
  inn: string;
  series: string;
  organization: string;
  validity: string;
}
interface ExecutionStep {
  id: number;
  actor: string;
  position: string;
  department: string;
  action?: string;
  date: string;
  isCurrent?: boolean;
}

// --- Komponentlar ---

// --- Ijro Qadamlari Modali ---
const ExecutionStepsModal = ({
  onClose,
  steps,
}: {
  onClose: () => void;
  steps: ExecutionStep[];
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-2xl m-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="size-5 text-gray-600" />
            </button>
            <h3 className="font-semibold text-lg text-gray-800">
              Ijro harakati
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {steps.map((step, index) => (
            <div key={step.id}>
              {" "}
              <div
                className={`flex items-center justify-between p-4 rounded-lg ${step.isCurrent ? "bg-blue-50 border border-blue-200" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center size-10 rounded-full ${step.isCurrent ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{step.actor}</p>
                    <p className="text-sm text-gray-600">{step.position}</p>
                    <p className="text-sm text-gray-500">{step.department}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1 bg-white">
                  {step.date}
                </div>
              </div>
              {step.action && (
                <div className="flex items-center gap-3 ml-8 mt-3">
                  <ArrowDown className="size-4 text-red-500" />
                  <span className="text-sm text-gray-600">{step.action}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// --- Imzolash Modali ---
const SignatureModal = ({
  letter,
  onClose,
  onSignSuccess,
  signatureKeys,
}: {
  letter: AppealLetter;
  onClose: () => void;
  onSignSuccess: (msg: string) => void;
  signatureKeys: SignatureKey[];
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const handleSign = () => {
    if (!selectedKey) {
      alert("Iltimos, imzo kalitini tanlang");
      return;
    }
    onSignSuccess(`Hujjat (${letter.number}) muvaffaqiyatli imzolandi!`);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-2xl m-4">
        <div className="flex items-center justify-between rounded-t-lg bg-red-600 px-5 py-3 text-white">
          <div className="flex items-center gap-3">
            <KeyRound className="size-6" />
            <div>
              <h3 className="font-bold text-lg">Elektron raqamli imzo</h3>
              <p className="text-sm opacity-80">DSKEYS - E-IMZO 3.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 mb-6">
            <p className="text-sm font-medium text-blue-800">
              Imzolash uchun hujjat:
            </p>
            <p className="font-semibold text-blue-900">{letter.number}</p>
          </div>
          <h4 className="font-semibold text-gray-800 mb-3">Kalitni tanlang:</h4>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
            {signatureKeys.map((key) => (
              <label
                key={key.id}
                className={`flex items-start gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${selectedKey === key.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900">{key.fullName}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${key.type === "Yuridik shaxs" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                    >
                      {key.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserCheck className="size-4 text-gray-400" /> INN:{" "}
                      <span className="font-medium text-gray-800">
                        {key.inn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="size-4 text-gray-400" /> Seriya:{" "}
                      <span className="font-medium text-gray-800">
                        {key.series}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Building className="size-4 text-gray-400" /> Tashkilot:{" "}
                      <span className="font-medium text-gray-800">
                        {key.organization}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <CalendarDays className="size-4 text-gray-400" /> Amal
                      qiladi:{" "}
                      <span className="font-medium text-gray-800">
                        {key.validity}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="signatureKey"
                  value={key.id}
                  checked={selectedKey === key.id}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  className="mt-1 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSign}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            disabled={!selectedKey}
          >
            <KeyRound className="size-4" /> Imzolash
          </button>
        </div>
      </div>
    </div>
  );
};
const AccordionItem = ({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-lg bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={`size-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};
const DocumentCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white">
    <div className="p-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Icon className="size-6 text-blue-600" />
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {title === "Asosiy hujjat" && (
        <button className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <FilePlus2 className="size-4" />
          Yangi hujjat yaratish
        </button>
      )}
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </div>
);

// --- FileItem Komponenti (YANGILANGAN) ---
const FileItem = ({
  name,
  size,
  date,
  url,
}: {
  name: string;
  size: string;
  date?: string;
  url: string;
}) => {
  // Faylni yangi oynada ochish
  const handleView = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Faylni yuklab olish
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name); // Fayl nomini belgilash
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    // O'chirish logikasi
    if (confirm(`"${name}" faylini haqiqatdan ham o'chirmoqchimisiz?`)) {
      console.log("O'chirilmoqda:", name);
      // Bu yerda API ga o'chirish so'rovi yuboriladi
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-red-600 text-white font-bold text-sm">
        PDF
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{name}</div>
        <div className="text-xs text-gray-500">
          {size}
          {date && ` • ${date}`}
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <button
          onClick={handleView}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Ko'rish"
        >
          <Eye className="size-4" />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Yuklab olish"
        >
          <Download className="size-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-gray-100 text-red-600 hover:text-red-700"
          title="O'chirish"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
};

// --- Asosiy Komponent ---
function AppealLettersView({ onLetterClick }: AppealLettersViewProps) {
  const [selectedLetter, setSelectedLetter] = useState<AppealLetter | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  // API data states
  const [appealLetters, setAppealLetters] = useState<AppealLetter[]>([]);
  const [signatureKeys, setSignatureKeys] = useState<SignatureKey[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Appeal Letters data from API
  useEffect(() => {
    const fetchAppealLetters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosAPI.get("/document/appeal/");
        if (response.data && Array.isArray(response.data)) {
          setAppealLetters(response.data);
          // Extract unique categories from the data
          const uniqueCategories = Array.from(
            new Set(response.data.map((letter: AppealLetter) => letter.category)),
          ) as string[];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching appeal letters:", err);
        setError("Ma'lumotni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchAppealLetters();
  }, []);

  // Test uchun PDF URL manzili
  const samplePdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  const statuses = [
    { value: "new", label: "Yangi" },
    { value: "in-progress", label: "Ko'rib chiqilmoqda" },
    { value: "resolved", label: "Hal qilindi" },
  ];
  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
    switch (status) {
      case "new":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>Yangi</span>
        );
      case "in-progress":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            Ko'rib chiqilmoqda
          </span>
        );
      case "resolved":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Hal qilindi
          </span>
        );
      default:
        return null;
    }
  };
  const toggleStatus = (status: string) =>
    setSelectedStatus((p) =>
      p.includes(status) ? p.filter((s) => s !== status) : [...p, status],
    );
  const toggleCategory = (category: string) =>
    setSelectedCategory((p) =>
      p.includes(category) ? p.filter((c) => c !== category) : [...p, category],
    );
  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedCategory([]);
  };
  const filteredLetters = appealLetters.filter((letter) => {
    const matchesSearch =
      searchQuery === "" ||
      letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(letter.status);
    const matchesCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(letter.category);
    return matchesSearch && matchesStatus && matchesCategory;
  });
  const activeFiltersCount = selectedStatus.length + selectedCategory.length;
  const handleLetterClick = (letter: AppealLetter) => {
    if (onLetterClick) {
      onLetterClick(letter);
    } else {
      setSelectedLetter(letter);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ma'lumot yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/3 max-w-md border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="pl-9 text-sm w-full rounded-md border border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${showFilters ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
            >
              <Filter className="size-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {" "}
              {/* Filter UI */}{" "}
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-600">
              Jami: {filteredLetters.length} ta
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Qidiruvni tozalash
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredLetters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Search className="size-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Natija topilmadi
              </p>
              <p className="text-xs text-gray-500">
                Qidiruv so'rovingizni o'zgartiring yoki filtrlarni tozalang
              </p>
            </div>
          ) : (
            filteredLetters.map((letter) => (
              <div
                key={letter.id}
                onClick={() => handleLetterClick(letter)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedLetter?.id === letter.id ? "bg-blue-100" : "hover:bg-gray-50"}`}
              >
                {" "}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {letter.number}
                    </p>
                    <p className="text-xs text-gray-500">{letter.sender}</p>
                  </div>
                  {getStatusBadge(letter.status)}
                </div>{" "}
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {letter.subject}
                </p>{" "}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{letter.date}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {letter.category}
                  </span>
                </div>{" "}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col h-full">
        {!selectedLetter ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-1">
                Murojaat xatini tanlang
              </p>
              <p className="text-sm">
                Tafsilotlarni ko'rish uchun chap paneldan xat tanlang
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gray-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                Xat tafsilotlari
              </h2>
              <button
                onClick={() => setSelectedLetter(null)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <X className="size-4" />
                Yopish
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-md border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50">
                  <ChevronsRight className="size-4" /> Kelishish
                </button>
                <button
                  onClick={() => setShowExecutionModal(true)}
                  className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  <ChevronsRight className="size-4" /> Ijro qadamlari
                </button>
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="flex items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  <FileSignature className="size-4" /> Imzolash
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50">
                  <AlertTriangle className="size-4" /> Bekor qilish
                </button>
                <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  <Send className="size-4" /> Yuborish
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AccordionItem
                title="Buyurtma uchun kelgan tovarlar ro'yxati"
                subtitle="Jami: 7 ta tovar"
                icon={ShoppingCart}
              >
                <p>Bu yerda tovarlar ro'yxati bo'ladi.</p>
              </AccordionItem>
              <AccordionItem
                title={`Chiquvchi hujjat - ${selectedLetter.number}`}
                subtitle={new Date().toLocaleDateString("uz-UZ", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                icon={FileText}
              >
                <p>Bu yerda chiquvchi hujjat ma'lumotlari bo'ladi.</p>
              </AccordionItem>

              {/* FileItem komponentiga 'url' prop'i uzatildi */}
              <DocumentCard
                title="Asosiy hujjat"
                subtitle="Hujjat yaratish va tahrirlash"
                icon={FileText}
              >
                <FileItem
                  name={`Ustixat_${selectedLetter.number}.pdf`}
                  size="245.8 KB"
                  url={samplePdfUrl}
                />
              </DocumentCard>
              <DocumentCard title="Ilovalar" subtitle="" icon={FileText}>
                <FileItem
                  name="Kadrlar_jadvali_-001.pdf"
                  size="0.35 MB"
                  date="2026 M02 16"
                  url={samplePdfUrl}
                />
              </DocumentCard>
            </div>
          </div>
        )}
      </div>

      {/* Modallar */}
      {showSignatureModal && selectedLetter && (
        <SignatureModal
          letter={selectedLetter}
          onClose={() => setShowSignatureModal(false)}
          onSignSuccess={(message) => {
            alert(message);
          }}
          signatureKeys={signatureKeys}
        />
      )}
      {showExecutionModal && (
        <ExecutionStepsModal
          onClose={() => setShowExecutionModal(false)}
          steps={executionSteps}
        />
      )}
    </div>
  );
}

export default AppealLettersView;
