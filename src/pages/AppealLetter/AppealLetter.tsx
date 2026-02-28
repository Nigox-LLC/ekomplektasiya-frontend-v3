import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  Search,
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
interface AppealLettersViewProps {
  onLetterClick?: (letter: AppealLetter) => void;
  onCreateNew?: () => void;
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
          {steps.map((step) => (
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-600 text-white font-bold text-sm">
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
function AppealLettersView({
  onLetterClick,
  onCreateNew,
}: AppealLettersViewProps) {
  const [selectedLetter, setSelectedLetter] = useState<AppealLetter | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus] = useState<string[]>([]);
  const [selectedCategory] = useState<string[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  // API data states
  const [appealLetters, setAppealLetters] = useState<AppealLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Letter detail states
  const [letterDetail, setLetterDetail] = useState<any>(null);
  const [signatureKeys, setSignatureKeys] = useState<SignatureKey[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch Appeal Letters data from API
  useEffect(() => {
    const fetchAppealLetters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosAPI.get("/document/appeal/");
        if (response.status === 200) {
          setAppealLetters(response.data.results);
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

  // Fetch letter details when a letter is selected
  useEffect(() => {
    const fetchLetterDetails = async () => {
      if (!selectedLetter) {
        setLetterDetail(null);
        setSignatureKeys([]);
        setExecutionSteps([]);
        return;
      }

      try {
        setDetailLoading(true);
        const response = await axiosAPI.get(
          `/document/appeal/${selectedLetter.id}/`,
        );
        if (response.status === 200) {
          const data = response.data;
          setLetterDetail(data);

          // Extract signature keys from API response
          if (data.signature_keys && Array.isArray(data.signature_keys)) {
            setSignatureKeys(data.signature_keys);
          } else {
            setSignatureKeys([]);
          }

          // Extract execution steps from API response
          if (data.execution_steps && Array.isArray(data.execution_steps)) {
            setExecutionSteps(data.execution_steps);
          } else {
            setExecutionSteps([]);
          }
        }
      } catch (err) {
        console.error("Error fetching letter details:", err);
        setLetterDetail(null);
        setSignatureKeys([]);
        setExecutionSteps([]);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchLetterDetails();
  }, [selectedLetter]);

  // Test uchun PDF URL manzili
  const samplePdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xatlar</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <FilePlus2 className="size-4" />
            Yangi xat yaratish
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Hujjat raqami bo'yicha qidirish..."
            className="pl-10 pr-4 text-sm w-full rounded-lg border border-gray-300 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        {/* <div className="flex items-center gap-2 mt-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Barchasi <span className="ml-1.5 text-xs">5</span>
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "outgoing"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Chiquvchi hujjatlar <span className="ml-1.5 text-xs">1</span>
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "response"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Javob xati <span className="ml-1.5 text-xs">2</span>
          </button>
          <button
            onClick={() => setActiveTab("internal")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "internal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Ichki hujjatlar <span className="ml-1.5 text-xs">1</span>
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "others"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Boshqalar <span className="ml-1.5 text-xs">1</span>
          </button>
        </div> */}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Letter List */}
        <div className="w-120 border-r border-gray-200 bg-white overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              MUROJAAT XATI
            </h3>
            <p className="text-xs text-gray-500">
              Jami: {filteredLetters.length} ta xat
            </p>
          </div>

          {filteredLetters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="size-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Natija topilmadi
              </p>
              <p className="text-xs text-gray-500">
                Qidiruv so'rovingizni o'zgartiring
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLetters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => handleLetterClick(letter)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedLetter?.id === letter.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-blue-600">
                          {letter.number}
                        </span>
                        <span className="text-xs text-gray-400">
                          {letter.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                        {letter.subject}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {letter.category === "Javob xati" && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                        Javob xati
                      </span>
                    )}
                    {letter.category === "Chiquvchi xat" && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        Chiquvchi xat
                      </span>
                    )}
                    {letter.status === "in-progress" && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-700">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Jarayonda
                      </span>
                    )}
                    {letter.status === "resolved" && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Qabul qilingan
                      </span>
                    )}
                  </div>

                  {letter.status === "new" && (
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                        <ChevronsRight className="size-3" />
                        Yuborilgan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Letter Details or Empty State */}
        <div className="flex-1 flex flex-col">
          {!selectedLetter ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hujjat tanlanmadi
                </h3>
                <p className="text-sm text-gray-500">
                  Chap tomondan ro'yxatdan xatni tanlang
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
              {detailLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Ma'lumot yuklanmoqda...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Products Section */}
                  {letterDetail?.products && letterDetail.products.length > 0 && (
                    <AccordionItem
                      title="Buyurtma uchun kelgan tovarlar ro'yxati"
                      subtitle={`Jami: ${letterDetail.products.length} ta tovar`}
                      icon={ShoppingCart}
                    >
                      <div className="space-y-2">
                        {letterDetail.products.map(
                          (product: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name || `Tovar ${idx + 1}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Miqdori: {product.quantity || "-"}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {product.price || "-"}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </AccordionItem>
                  )}

                  {/* Letter Information Section */}
                  <AccordionItem
                    title={`Chiquvchi hujjat - ${selectedLetter.number}`}
                    subtitle={letterDetail?.date || new Date().toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    icon={FileText}
                  >
                    <div className="space-y-3">
                      {letterDetail?.subject && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Mavzu:
                          </p>
                          <p className="text-sm text-gray-600">
                            {letterDetail.subject}
                          </p>
                        </div>
                      )}
                      {letterDetail?.sender && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Yuboruvchi:
                          </p>
                          <p className="text-sm text-gray-600">
                            {letterDetail.sender}
                          </p>
                        </div>
                      )}
                      {letterDetail?.status && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Holat:
                          </p>
                          <p className="text-sm text-gray-600">
                            {letterDetail.status === "new" && "Yangi"}
                            {letterDetail.status === "in-progress" && "Jarayonda"}
                            {letterDetail.status === "resolved" && "Qabul qilingan"}
                          </p>
                        </div>
                      )}
                      {letterDetail?.category && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Kategoriya:
                          </p>
                          <p className="text-sm text-gray-600">
                            {letterDetail.category}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionItem>

                  {/* Main Document Section */}
                  {letterDetail?.main_document && (
                    <DocumentCard
                      title="Asosiy hujjat"
                      subtitle="Hujjat yaratish va tahrirlash"
                      icon={FileText}
                    >
                      <FileItem
                        name={
                          letterDetail.main_document.name ||
                          `Ustixat_${selectedLetter.number}.pdf`
                        }
                        size={letterDetail.main_document.size || "0 KB"}
                        url={letterDetail.main_document.url || letterDetail.main_document.file || samplePdfUrl}
                      />
                    </DocumentCard>
                  )}

                  {/* Attachments Section */}
                  {letterDetail?.attachments && letterDetail.attachments.length > 0 && (
                    <DocumentCard
                      title="Ilovalar"
                      subtitle={`Jami: ${letterDetail.attachments.length} ta ilova`}
                      icon={FileText}
                    >
                      <div className="space-y-2">
                        {letterDetail.attachments.map((attachment: any, idx: number) => (
                          <FileItem
                            key={idx}
                            name={attachment.name || `Ilova_${idx + 1}.pdf`}
                            size={attachment.size || "0 KB"}
                            date={attachment.date || attachment.created_at || attachment.uploaded_at}
                            url={attachment.url || attachment.file || samplePdfUrl}
                          />
                        ))}
                      </div>
                    </DocumentCard>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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

function AppealLetterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatePage = location.pathname.endsWith("/new");

  if (isCreatePage) {
    return <Outlet />;
  }

  return <AppealLettersView onCreateNew={() => navigate("new")} />;
}

export default AppealLetterPage;
