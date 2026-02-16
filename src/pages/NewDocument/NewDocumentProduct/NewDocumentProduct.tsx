import { useState, useRef, useEffect } from 'react';
import UstixatFormModal from '@/pages/NewDocument/UstixatFormModal/UstixatFormModal';
import {
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  Upload,
  File,
  X,
  ShoppingCart,
  Eye,
  Download,
  Paperclip,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Badge, Button, Card, Input } from 'antd';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

interface GoodItem {
  id: number;
  type: string;
  name: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  note: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface UploadedFile {
  file: File;
  id: string;
  url: string;
}

// Mock xodimlar - bo'lim boshliqlari
const mockEmployees: Employee[] = [
  { id: '1', name: 'Aliyev Jamshid Nuriddinovich', position: 'Bo\'lim boshlig\'i', department: 'Moliya bo\'limi' },
  { id: '2', name: 'Karimova Nodira Shavkatovna', position: 'Bo\'lim boshlig\'i', department: 'Kadrlar bo\'limi' },
  { id: '3', name: 'Rahimov Sardor Akmalovich', position: 'Bo\'lim boshlig\'i', department: 'Xo\'jalik bo\'limi' },
  { id: '4', name: 'Toshmatova Gulnora Botirovna', position: 'Bo\'lim boshlig\'i', department: 'Buxgalteriya' },
];

// Mock tovarlar ro'yxati
const mockProducts = [
  { id: 1, name: 'Kompyuter', model: 'Dell Optiplex 7090', size: 'Standart', unit: 'dona' },
  { id: 2, name: 'Monitor', model: 'Samsung 24"', size: '24 dyum', unit: 'dona' },
  { id: 3, name: 'Printer', model: 'HP LaserJet Pro', size: 'A4', unit: 'dona' },
  { id: 4, name: 'Qog\'oz', model: 'A4 80g/m²', size: 'A4', unit: 'quti' },
  { id: 5, name: 'Ruchka', model: 'Ballpoint', size: 'Standart', unit: 'dona' },
  { id: 6, name: 'Marker', model: 'Permanent', size: 'Standart', unit: 'dona' },
  { id: 7, name: 'Stol', model: 'Ofis stoli', size: '120x60 sm', unit: 'dona' },
  { id: 8, name: 'Stul', model: 'Ofis stuli', size: 'Standart', unit: 'dona' },
  { id: 9, name: 'Klaviatura', model: 'Logitech K120', size: 'Standart', unit: 'dona' },
  { id: 10, name: 'Sichqoncha', model: 'Logitech M90', size: 'Standart', unit: 'dona' },
  { id: 11, name: 'Telefon', model: 'Panasonic KX', size: 'Standart', unit: 'dona' },
  { id: 12, name: 'Skaner', model: 'Canon LiDE 300', size: 'A4', unit: 'dona' },
];

// Mock bo'limlar ro'yxati
const mockDepartments = [
  'Moliya bo\'limi',
  'Kadrlar bo\'limi',
  'Xo\'jalik bo\'limi',
  'Buxgalteriya',
  'IT bo\'limi',
  'Yuridik bo\'limi',
  'Marketing bo\'limi',
];

interface NewDocumentViewProps {
  onNavigateBack?: () => void;
  hideGoodsTable?: boolean; // YANGI: Tovarlar jadvalini yashirish uchun
}

const NewDocumentProduct: React.FC<NewDocumentViewProps> = ({ onNavigateBack, hideGoodsTable = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeDropdownRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [goods, setGoods] = useState<GoodItem[]>([
    { id: 1, type: 'Tovar', name: '', model: '', size: '', unit: '', quantity: 0, note: '' }
  ]);
  const [showTypeDropdown, setShowTypeDropdown] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showGoodsTable, setShowGoodsTable] = useState(false); // Default yopiq
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendReason, setSendReason] = useState('');
  const [showOnlyOffice, setShowOnlyOffice] = useState(false);
  const [currentPdfIndex, setCurrentPdfIndex] = useState<number>(0);
  const [mainDocument, setMainDocument] = useState<UploadedFile | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [recipientType, setRecipientType] = useState<'employee' | 'department'>('employee');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [sendType, setSendType] = useState<'signing' | 'archive' | 'execution' | 'agreement' | 'info'>('execution');
  const [sendDeadline, setSendDeadline] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('Barcha bo\'limlar');
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [showDocTypeDropdown, setShowDocTypeDropdown] = useState(false); // YANGI: Dropdown state
  const [showUstixatModal, setShowUstixatModal] = useState(false); // YANGI: Ustixat modal state
  const [showConfirmNoDocModal, setShowConfirmNoDocModal] = useState(false); // YANGI: Asosiy hujjatsiz tasdiqlash

  const { type } = useParams();
  console.log(type)

  // LocalStorage dan tovarlarni yuklash - component yuklanganda
  useEffect(() => {
    const savedGoods = localStorage.getItem('draftGoods');
    if (savedGoods) {
      try {
        const parsedGoods = JSON.parse(savedGoods);
        if (parsedGoods && parsedGoods.length > 0) {
          setGoods(parsedGoods);
          toast.success('Saqlangan tovarlar yuklandi', {
            delay: 2000
          });
        }
      } catch (error) {
        console.error('Tovarlarni yuklashda xatolik:', error);
      }
    }
  }, []);

  // Tovarlar o'zgarganda localStorage ga saqlash
  useEffect(() => {
    // Faqat bo'sh bo'lmagan tovarlarni saqlash
    const hasContent = goods.some(item => item.name || item.quantity > 0);
    if (hasContent) {
      localStorage.setItem('draftGoods', JSON.stringify(goods));
    }
  }, [goods]);

  const handleAddRow = () => {
    const newRow: GoodItem = {
      id: Date.now(),
      type: 'Tovar',
      name: '',
      model: '',
      size: '',
      unit: '',
      quantity: 0,
      note: ''
    };
    setGoods([...goods, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    if (goods.length === 1) {
      toast.error('Kamida bitta qator bo\'lishi kerak!');
      return;
    }
    setGoods(goods.filter(item => item.id !== id));
  };

  const handleUpdateRow = (id: number, field: keyof GoodItem, value: string | number) => {
    setGoods(goods.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length !== files.length) {
        toast.error('Faqat PDF fayllarni yuklash mumkin!');
      }

      const newFiles: UploadedFile[] = pdfFiles.map(file => ({
        file,
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file)
      }));

      setUploadedFiles([...uploadedFiles, ...newFiles]);
      toast.success(`${pdfFiles.length} ta fayl yuklandi`);
    }
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const handleViewPdf = (url: string) => {
    const index = uploadedFiles.findIndex(f => f.url === url);
    setCurrentPdfIndex(index >= 0 ? index : 0);
    setSelectedPdfUrl(url);
  };

  const handleNextPdf = () => {
    if (currentPdfIndex < uploadedFiles.length - 1) {
      const nextIndex = currentPdfIndex + 1;
      setCurrentPdfIndex(nextIndex);
      setSelectedPdfUrl(uploadedFiles[nextIndex].url);
    }
  };

  const handlePrevPdf = () => {
    if (currentPdfIndex > 0) {
      const prevIndex = currentPdfIndex - 1;
      setCurrentPdfIndex(prevIndex);
      setSelectedPdfUrl(uploadedFiles[prevIndex].url);
    }
  };

  const handleDownloadFile = (uploadedFile: UploadedFile) => {
    const link = document.createElement('a');
    link.href = uploadedFile.url;
    link.download = uploadedFile.file.name;
    link.click();
  };

  const handleOpenSendModal = () => {
    // XIZMAT oynasi (hideGoodsTable=true) uchun
    if (hideGoodsTable) {
      // Tovarlarni tekshirmaslik!
      // Faqat asosiy hujjatni tekshirish
      if (!mainDocument) {
        // Tasdiqlash so'rash
        setShowConfirmNoDocModal(true);
        return;
      }
      // Asosiy hujjat bor - modalini ochish
      setShowSendModal(true);
      return;
    }

    // TOVAR oynasi (hideGoodsTable=false) uchun
    // Tovarlarni tekshirish
    if (goods.some(item => !item.name || !item.quantity)) {
      toast.error('Barcha tovarlar uchun nom va sonini kiriting!');
      return;
    }
    setShowSendModal(true);
  };

  const handleSubmit = () => {
    if (recipientType === 'employee' && !selectedEmployee) {
      toast.error('Xodimni tanlang!');
      return;
    }

    if (recipientType === 'department' && !selectedDepartment) {
      toast.error('Bo\'limni tanlang!');
      return;
    }

    if (!sendReason.trim()) {
      toast.error('Yuborish sababini kiriting!');
      return;
    }

    if (!sendDeadline) {
      toast.error('Ijro muddatini kiriting!');
      return;
    }

    // Hujjat yaratish
    const now = new Date();
    const formattedDate = `${now.getDate()} ${['yan', 'fev', 'mart', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Yuborish turini aniqlash
    const sendTypeLabels = {
      'signing': 'Imzolash uchun',
      'archive': 'Ustixat uchun',
      'execution': 'Ijro uchun',
      'agreement': 'Kelishish uchun',
      'info': 'Ma\'lumot uchun'
    };

    // Barcha fayllarni birlashtirish (ilovalar + asosiy hujjat)
    const allFiles = [...uploadedFiles];
    if (mainDocument) {
      allFiles.push(mainDocument);
    }

    // Recipient nomini aniqlash
    const recipientName = recipientType === 'employee'
      ? selectedEmployee?.name
      : selectedDepartment;

    const recipientDept = recipientType === 'employee'
      ? selectedEmployee?.department
      : selectedDepartment;

    // Chiquvchi xatga qo'shish uchun yangi hujjat
    const newOutgoingLetter = {
      id: `OUT-${Date.now()}`,
      number: `CHQ-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}/2026`,
      outgoingNumber: `CHQ-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}/2026`,
      region: recipientDept,
      title: `Buyurtma: ${goods.map(g => g.name).filter(n => n).join(', ').substring(0, 50)}...`,
      deadline: sendDeadline,
      status: 'active' as const,
      type: sendTypeLabels[sendType],
      sentDate: formattedDate,
      recipient: recipientName,
      recipientType: recipientType,
      reason: sendReason,
      goods: goods,
      files: allFiles.map(f => ({
        name: f.file.name,
        size: f.file.size,
        url: f.url // Real backend da server URL bo'ladi
      })),
      hasMainDocument: mainDocument !== null
    };

    // LocalStorage ga saqlash
    const existingLetters = JSON.parse(localStorage.getItem('sentLetters') || '[]');
    existingLetters.unshift(newOutgoingLetter);
    localStorage.setItem('sentLetters', JSON.stringify(existingLetters));

    // YANGI: Custom event trigger - sahifani yangilash uchun
    window.dispatchEvent(new Event('sentLettersUpdated'));

    console.log('Chiquvchi xatga qo\'shildi:', newOutgoingLetter);

    toast.success('Hujjat muvaffaqiyatli yuborildi!', {
      description: `${recipientName} ga ${sendTypeLabels[sendType].toLowerCase()} yuborildi`,
      duration: 4000
    });

    // Formani tozalash
    setGoods([{ id: Date.now(), type: 'Tovar', name: '', model: '', size: '', unit: '', quantity: 0, note: '' }]);
    setSelectedEmployee(null);
    setSelectedDepartment(null);
    setSendReason('');
    setSendDeadline('');
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.url));
    setUploadedFiles([]);
    if (mainDocument) {
      URL.revokeObjectURL(mainDocument.url);
      setMainDocument(null);
    }
    setShowSendModal(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleTypeDropdownToggle = (itemId: number) => {
    const newState = showTypeDropdown === itemId ? null : itemId;
    setShowTypeDropdown(newState);

    // Scroll to dropdown if opening
    if (newState !== null) {
      setTimeout(() => {
        const dropdownElement = typeDropdownRef.current[itemId];
        if (dropdownElement) {
          dropdownElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 50);
    }
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.select();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Send Button */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateBack ? onNavigateBack() : window.history.back()}
              className="size-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              title="Orqaga"
            >
              <ArrowLeft className="size-6 text-white" />
            </button>
            <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Yangi hujjat yaratish</h1>
              <p className="text-sm text-blue-100">Buyurtma uchun tovarlar ro'yxati</p>
            </div>
          </div>
          <Button
            onClick={handleOpenSendModal}
            className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            <Send className="size-5" />
            Hujjatni yuborish
          </Button>
        </div>
      </div>

      {/* Tovarlar jadvali - ACCORDION */}
      {!hideGoodsTable && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowGoodsTable(!showGoodsTable)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="size-8 text-gray-700" strokeWidth={1.5} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Buyurtma uchun tovarlar ro'yxati</h3>
                <p className="text-sm text-gray-500">Jami: {goods.length} ta tovar</p>
              </div>
            </div>
            {showGoodsTable ? (
              <ChevronUp className="size-5 text-gray-500" />
            ) : (
              <ChevronDown className="size-5 text-gray-500" />
            )}
          </button>

          {showGoodsTable && (
            <div className="border-t border-gray-200 p-6 animate-in slide-in-from-top-2 duration-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">№</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Buyurtma turi</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Tovar nomi *</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Modeli</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">O'lchami</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">O'lchov birligi</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Soni *</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Izoh</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goods.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">{index + 1}</td>

                        {/* Buyurtma turi */}
                        <td className="border border-gray-300 px-4 py-3 relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => handleTypeDropdownToggle(item.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <Badge
                                className={`cursor-pointer transition-colors ${item.type === 'Tovar'
                                    ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                                    : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                                  }`}
                              >
                                {item.type}
                              </Badge>
                              <ChevronDown className="size-3 text-gray-500" />
                            </button>

                            {showTypeDropdown === item.id && (
                              <div
                                ref={el => { typeDropdownRef.current[item.id] = el; }}
                                className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateRow(item.id, 'type', 'Tovar');
                                    setShowTypeDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 rounded-t-lg transition-colors"
                                >
                                  <div className="size-2 rounded-full bg-blue-500"></div>
                                  Tovar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateRow(item.id, 'type', 'Xizmat');
                                    setShowTypeDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 rounded-b-lg transition-colors"
                                >
                                  <div className="size-2 rounded-full bg-purple-500"></div>
                                  Xizmat
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateRow(item.id, 'name', e.target.value)}
                            className="text-sm font-medium border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Nomi"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.model}
                            onChange={(e) => handleUpdateRow(item.id, 'model', e.target.value)}
                            className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Modeli"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.size}
                            onChange={(e) => handleUpdateRow(item.id, 'size', e.target.value)}
                            className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="O'lchami"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleUpdateRow(item.id, 'unit', e.target.value)}
                            className="text-sm text-center border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="dona"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateRow(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="text-sm text-center font-semibold border-0 focus:ring-1 focus:ring-blue-500"
                            min="0"
                            onFocus={handleQuantityFocus}
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.note}
                            onChange={(e) => handleUpdateRow(item.id, 'note', e.target.value)}
                            className="text-sm italic border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Izoh"
                          />
                        </td>

                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Yangi qator qo'shish */}
              <div className="mt-4">
                <Button
                  type="default"
                  variant="outlined"
                  className="gap-2"
                  onClick={handleAddRow}
                >
                  <Plus className="size-4" />
                  Tovar qo'shish
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Asosiy hujjat */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="size-8 text-blue-600" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Asosiy hujjat</h3>
              <p className="text-sm text-gray-500">Hujjat yaratish va tahrirlash</p>
            </div>
          </div>
          <div className="relative">
            <Button
              onClick={() => setShowDocTypeDropdown(!showDocTypeDropdown)}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="size-4" />
              Yangi hujjat yaratish
              <ChevronDown className="size-4" />
            </Button>

            {/* Dropdown menu */}
            {showDocTypeDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocTypeDropdown(false);
                    setShowOnlyOffice(true);
                    // Bu yerda Buyurtma xati yaratish logikasi
                    console.log('Buyurtma xati yaratilmoqda...');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
                >
                  <ShoppingCart className="size-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Buyurtma xati</p>
                    <p className="text-xs text-gray-500">Tovarlar buyurtmasi uchun</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDocTypeDropdown(false);
                    setShowOnlyOffice(true);
                    // Bu yerda Xizmat xati yaratish logikasi
                    console.log('Xizmat xati yaratilmoqda...');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
                >
                  <FileText className="size-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Xizmat xati</p>
                    <p className="text-xs text-gray-500">Rasmiy xizmat xati</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDocTypeDropdown(false);
                    setShowUstixatModal(true);
                    // Bu yerda Ustixat yaratish logikasi
                    console.log('Ustixat yaratilmoqda...');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-b-lg"
                >
                  <File className="size-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ustixat</p>
                    <p className="text-xs text-gray-500">Ustixat hujjat</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Yaratilgan hujjat PDF */}
        {mainDocument && (
          <div className="mt-4">
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">PDF</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-blue-600">{mainDocument.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(mainDocument.file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedPdfUrl(mainDocument.url)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Ko'rish"
                >
                  <Eye className="size-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(mainDocument)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Yuklab olish"
                >
                  <Download className="size-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setMainDocument(null)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="size-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Ilovalar - PDF yuklash */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={handleFileUpload}
            className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
            title="Fayl yuklash"
          >
            <Paperclip className="size-5 text-gray-700" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">Ilovalar</h3>
          {uploadedFiles.length > 0 && (
            <Badge className="bg-blue-100 text-blue-700">{uploadedFiles.length}</Badge>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
        />

        {/* Yuklangan fayllar ro'yxati - GORIZONTAL */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-row flex-wrap gap-3 mb-4">{uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all w-[30%]"
            >
              <div className="flex items-center gap-3">
                {/* PDF Icon - qizil kvadrat */}
                <div className="size-12 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">PDF</span>
                </div>

                {/* File info */}
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-blue-600 truncate max-w-[300px]" title={uploadedFile.file.name}>
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleViewPdf(uploadedFile.url)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Ko'rish"
                >
                  <Eye className="size-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(uploadedFile)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Yuklab olish"
                >
                  <Download className="size-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(uploadedFile.id)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="size-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        {uploadedFiles.length === 0 && (
          <div className="text-center py-4 text-gray-500 mb-4">
            <File className="size-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Hech qanday fayl yuklanmagan</p>
          </div>
        )}
      </Card>

      {/* Send Modal - RASMGA MOS */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hujjatni yuborish</h2>
                <p className="text-sm text-gray-500">CHQ-045/2026 - Moliyaviy hisobot tayyorlash bo'yicha ko'rstma</p>
              </div>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setSelectedEmployees([]);
                  setEmployeeSearchTerm('');
                  setSelectedDepartmentFilter('Barcha bo\'limlar');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Qidiruv */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  type="text"
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  placeholder="Ism, lavozim yoki bo'lim bo'yicha qidirish..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Bo'lim filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bo'lim</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex items-center justify-between transition-all hover:border-gray-300"
                  >
                    <span className="text-sm text-gray-900">{selectedDepartmentFilter}</span>
                    <ChevronDown className={`size-5 text-gray-400 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDepartmentDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDepartmentFilter('Barcha bo\'limlar');
                          setShowDepartmentDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedDepartmentFilter === 'Barcha bo\'limlar' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                          }`}
                      >
                        Barcha bo'limlar
                      </button>
                      {mockDepartments.map((dept, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSelectedDepartmentFilter(dept);
                            setShowDepartmentDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedDepartmentFilter === dept ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                            }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tanlangan xodimlar */}
              {selectedEmployees.length > 0 && (
                <div className="space-y-2">
                  {selectedEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="size-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">{employee.name}</p>
                          <p className="text-xs text-blue-700">{employee.position} <span className="text-blue-500">•</span> {employee.department}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmployees(selectedEmployees.filter(e => e.id !== employee.id));
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <X className="size-5 text-blue-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Xodimlar ro'yxati */}
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-2">
                {mockEmployees
                  .filter(emp => {
                    const searchLower = employeeSearchTerm.toLowerCase();
                    const matchesSearch = emp.name.toLowerCase().includes(searchLower) ||
                      emp.position.toLowerCase().includes(searchLower) ||
                      emp.department.toLowerCase().includes(searchLower);
                    const matchesDept = selectedDepartmentFilter === 'Barcha bo\'limlar' || emp.department === selectedDepartmentFilter;
                    const notSelected = !selectedEmployees.some(e => e.id === emp.id);
                    return matchesSearch && matchesDept && notSelected;
                  })
                  .map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmployees([...selectedEmployees, employee]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg flex items-center gap-3 border border-transparent hover:border-gray-200"
                    >
                      <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="size-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.position} • {employee.department}</p>
                      </div>
                    </button>
                  ))}
              </div>

              {/* Yuborish maqsadi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Yuborish maqsadi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSendType('signing')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${sendType === 'signing'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-sm font-semibold">Imzolash</div>
                    <div className="text-xs opacity-75">uchun</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendType('archive')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${sendType === 'archive'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-sm font-semibold">Ustixat</div>
                    <div className="text-xs opacity-75">uchun</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendType('execution')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${sendType === 'execution'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-sm font-semibold">Ijro</div>
                    <div className="text-xs opacity-75">uchun</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendType('info')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${sendType === 'info'
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                  >
                    <div className="text-sm font-semibold">Ma'lumot</div>
                    <div className="text-xs opacity-75">uchun</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                variant="outlined"
                onClick={() => {
                  setShowSendModal(false);
                  setSelectedEmployees([]);
                  setEmployeeSearchTerm('');
                  setSelectedDepartmentFilter('Barcha bo\'limlar');
                }}
                className="px-6"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={() => {
                  if (selectedEmployees.length === 0) {
                    toast.error('Kamida bitta xodimni tanlang!');
                    return;
                  }

                  // Hujjat raqamini avtomatik yaratish
                  const now = new Date();
                  const documentNumber = `CHQ-${now.getFullYear()}-${String(Date.now()).slice(-4)}`;
                  const formattedDate = now.toLocaleDateString('uz-UZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

                  // Yuborish turini aniqlash
                  const sendTypeLabels = {
                    'signing': 'Imzolash uchun',
                    'archive': 'Ustixat uchun',
                    'execution': 'Ijro uchun',
                    'agreement': 'Kelishish uchun',
                    'info': 'Ma\'lumot uchun'
                  };

                  // Har bir tanlangan xodim uchun alohida hujjat yaratish
                  selectedEmployees.forEach((employee) => {
                    // Chiquvchi xat obyekti - LettersView formatiga mos
                    const newOutgoingLetter = {
                      id: `OUT-${Date.now()}-${employee.id}`,
                      number: documentNumber,
                      region: '',
                      recipient: employee.name,
                      title: `Buyurtma: ${goods.map(g => g.name).filter(n => n).slice(0, 3).join(', ')}${goods.length > 3 ? '...' : ''}`,
                      status: sendType === 'signing' ? ('pending' as const) : ('overdue' as const), // Imzolash uchun - pending
                      type: 'outgoing' as const,
                      date: formattedDate,
                      documentType: 'outgoing' as const,
                      category: sendType === 'signing' ? 'not-signed' : // Imzolanmagan
                        sendType === 'archive' ? 'backup' :
                          sendType === 'info' ? 'for-info' : // Ma'lumot uchun
                            sendType === 'agreement' ? 'approval' : 'execution',
                      // Qo'shimcha ma'lumotlar
                      employeeDepartment: employee.department,
                      employeePosition: employee.position,
                      sendTypeLabel: sendTypeLabels[sendType],
                      goods: goods,
                      createdAt: now.toISOString(),
                      isSigned: false, // YANGI: Imzolash holati
                      isInfoAcknowledged: false // YANGI: Ma'lumot uchun tanishish holati
                    };

                    // LocalStorage ga saqlash
                    const existingLetters = JSON.parse(localStorage.getItem('sentLetters') || '[]');
                    existingLetters.unshift(newOutgoingLetter);
                    localStorage.setItem('sentLetters', JSON.stringify(existingLetters));

                    // YANGI: Custom event trigger - sahifani yangilash uchun
                    window.dispatchEvent(new Event('sentLettersUpdated'));

                    console.log('Chiquvchi xatga qo\'shildi:', newOutgoingLetter);
                  });

                  // Muvaffaqiyatli yuborish xabari
                  toast.success(`Hujjat ${selectedEmployees.length} ta xodimga yuborildi!`, {
                    description: `${documentNumber} raqami bilan saqlandi`,
                    duration: 4000
                  });

                  // Tovarlarni tozalash va localStorage dan o'chirish
                  setGoods([{ id: Date.now(), type: 'Tovar', name: '', model: '', size: '', unit: '', quantity: 0, note: '' }]);
                  localStorage.removeItem('draftGoods');

                  setShowSendModal(false);
                  setSelectedEmployees([]);
                  setEmployeeSearchTerm('');
                  setSelectedDepartmentFilter('Barcha bo\'limlar');
                }}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <Send className="size-4" />
                Yuborish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdfUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">PDF Ko'rish</h2>
              <button
                onClick={() => setSelectedPdfUrl(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedPdfUrl}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Button
                onClick={handlePrevPdf}
                disabled={currentPdfIndex === 0}
                className="gap-2 bg-gray-300 hover:bg-gray-400 text-white"
              >
                <ChevronLeft className="size-4" />
                Oldingi
              </Button>
              <Button
                onClick={handleNextPdf}
                disabled={currentPdfIndex === uploadedFiles.length - 1}
                className="gap-2 bg-gray-300 hover:bg-gray-400 text-white"
              >
                Keyingi
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OnlyOffice Modal */}
      {showOnlyOffice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="size-6 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">OnlyOffice Hujjat Muharriri</h2>
              </div>
              <button
                onClick={() => setShowOnlyOffice(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* OnlyOffice Iframe */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              <iframe
                src="https://personal.onlyoffice.com"
                className="w-full h-full border-0"
                title="OnlyOffice Document Editor"
                allow="fullscreen"
              />
            </div>

            {/* Info */}
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 text-sm text-blue-900">
              <strong>Eslatma:</strong> OnlyOffice demo sahifasi. Real loyihada OnlyOffice server integratsiyasi kerak bo'ladi.
            </div>
          </div>
        </div>
      )}

      {/* Ustixat Form Modal */}
      <UstixatFormModal
        isOpen={showUstixatModal}
        onClose={() => setShowUstixatModal(false)}
        onSubmit={(data: { performers: string | any[]; deadline: any; }) => {
          // Ustixat yaratilganida bajariladigan logika
          console.log('Yaratilgan ustixat:', data);
          toast.success('Ustixat muvaffaqiyatli yaratildi!', {
            description: `${data.performers.length} ta ijrochi va ${data.deadline} muddat bilan`,
            duration: 4000
          });
          setShowUstixatModal(false);
        }}
      />

      {/* YANGI: Asosiy hujjatsiz yuborish tasdiqlash modali */}
      {showConfirmNoDocModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Asosiy hujjat kiritilmagan</h2>
                  <p className="text-sm text-orange-100">Tasdiqlash talab qilinadi</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-2">
                Asosiy hujjat kiritilmadan yuborasizmi?
              </p>
              <p className="text-sm text-gray-500 text-center">
                Faqat ilovalar bilan hujjat yuboriladi
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                variant="outlined"
                className="flex-1 border-2"
                onClick={() => setShowConfirmNoDocModal(false)}
              >
                Yo'q, bekor qilish
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  setShowConfirmNoDocModal(false);
                  setShowSendModal(true);
                }}
              >
                <Send className="size-4 mr-2" />
                Ha, yuborish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewDocumentProduct;