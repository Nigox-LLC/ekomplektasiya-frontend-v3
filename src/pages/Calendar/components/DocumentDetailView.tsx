import { useRef, useState } from 'react';
import {
  ArrowLeft,
  Send,
  Edit2,
  Plus,
  Eye,
  Download,
  MoreVertical,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileText as FileTextIcon
} from 'lucide-react';
import RelatedDocumentModal from './RelatedDocumentModal';
// import { IjroHarakatiModal, IjroStep } from './IjroHarakatiModal';
import IjroHarakatiModal from './IjroHarakatiModal';
import { IjroStep } from './IjroHarakatiModal';
import YearPlanModal from './YearPlanModal';
import AddGoodsModal from './AddGoodsModal';
import { KelishishModal } from './KelishishModal';
import SearchFilterPanel from './SearchFilterPanel';
import ImzolashModal from './ImzolashModal';
import SendDocumentModal from './SendDocumentModal';
import cartIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import ijroIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import flowIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import handshakeIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import kelishishIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import imzolashIcon from '@/assets/0312ad68ca29e1bdf3c70bebc3eb506c0733a300.png'; // Figma dan olingan ikonani import qilish
import { Badge, Button, Card, Input } from 'antd';

interface Document {
  id: string;
  number: string;
  title: string;
  category: string;
  date: string;
  tags?: string[];
  isRead: boolean;
  isReceived: boolean;
  year?: string;
  hasAttachment?: boolean;
}

interface DocumentDetailViewProps {
  document?: Document;
  onBack?: () => void;
  onClose?: () => void;
  category?: 'execution' | 'signing' | 'resolution' | 'info' | 'approval' | 'for-signing' | 'backup';
  onSuccess?: (message: string) => void;
}

const DocumentDetailView = ({ document, onBack, onClose, category, onSuccess }: DocumentDetailViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRelatedDocModal, setShowRelatedDocModal] = useState(false);
  const [showIjroHarakatiModal, setShowIjroHarakatiModal] = useState(false);
  const [showGoodsTable, setShowGoodsTable] = useState(false); // Default yopiq holatda
  const [showYearPlanModal, setShowYearPlanModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [showAddGoodsModal, setShowAddGoodsModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState<number | null>(null);
  const [showKelishishModal, setShowKelishishModal] = useState(false);
  const [kelishishStatus, setKelishishStatus] = useState<'roziman' | 'rozi-emasman' | 'qisman' | null>(null);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showImzolashModal, setShowImzolashModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Har bir xat uchun alohida ijro qadamlari - xat ID bo'yicha
  const [ijroSteps, setIjroSteps] = useState<Record<string, IjroStep[]>>({});

  // Joriy xatning ijro qadamlarini olish
  const currentDocumentSteps = document?.id ? (ijroSteps[document.id] || []) : [];

  // Mock tovarlar ma'lumotlari - state ga o'zgartirdik
  const [mockGoods, setMockGoods] = useState([
    { id: 1, type: 'Xarid qilish', yearPlan: null, name: 'Qog\'oz A4', model: 'Premium', size: '210x297mm', unit: 'dona', quantity: 500, note: 'Oq rang, 80g/m²' },
    { id: 2, type: 'Xarid qilish', yearPlan: null, name: 'Ruchka', model: 'Ball Pen', size: '0.7mm', unit: 'dona', quantity: 200, note: 'Ko\'k rang' },
    { id: 3, type: 'Zaxira', yearPlan: null, name: 'Papka', model: 'Standart', size: 'A4', unit: 'dona', quantity: 100, note: 'Plastik' },
    { id: 4, type: 'Xarid qilish', yearPlan: null, name: 'Marker', model: 'Permanent', size: '3mm', unit: 'dona', quantity: 50, note: 'Qora rang' },
    { id: 5, type: 'Zaxira', yearPlan: null, name: 'Skoch', model: 'Transparent', size: '48mm x 50m', unit: 'dona', quantity: 30, note: 'Shaffof' },
    { id: 6, type: 'Ta\'mir', yearPlan: null, name: 'USB Flash', model: 'Kingston DT100', size: '32GB', unit: 'dona', quantity: 20, note: 'USB 3.0' },
    { id: 7, type: 'Yangi jihozlash', yearPlan: null, name: 'Stol', model: 'Офис-Люкс', size: '120x60x75cm', unit: 'dona', quantity: 5, note: 'Yog\'och' },
  ]);

  const categoryNames: Record<string, string> = {
    'reply': 'Javob xati',
    'outgoing': 'Chiquvchi hujjat',
    'internal': 'Ichki hujjat',
    'other': 'Bildirgi',
    'all': 'Barchasi'
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected files:', files);
      // Bu yerda fayllarni yuklash logikasi
    }
  };

  const handleDownload = (fileName: string) => {
    // Bu yerda yuklab olish logikasi
    console.log('Downloading:', fileName);
  };

  // PDF ni ko'rish funksiyasi
  const handleViewPDF = (fileName: string) => {
    // Mock PDF URL - haqiqiy ilovada backend dan keladi
    const pdfUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;

    // Yangi tabda ochish
    window.open(pdfUrl, '_blank');
  };

  // PDF ni saqlash funksiyasi
  const handleDownloadPDF = (fileName: string) => {
    // Mock PDF URL - haqiqiy ilovada backend dan keladi
    // Haqiqiy ilovada backend'dan fayl URL keladi va Content-Disposition: attachment header bilan yuboriladi
    const pdfUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;

    // Yangi tabda ochish - brauzer o'zi yuklab olish yoki ko'rsatishni taklif qiladi
    const link = window.open(pdfUrl, '_blank');

    if (!link) {
      alert('Iltimos, popup blocker ni o\'chiring va qaytadan urinib ko\'ring.');
    }

  };

  const handleAddStep = (step: IjroStep) => {
    if (document?.id) {
      setIjroSteps(prev => ({
        ...prev,
        [document.id]: [...(prev[document.id] || []), step]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Ortga va Yuborish tugmalari - STICKY */}
      <div className="sticky top-0 z-10 bg-white pb-6 pt-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outlined"
              size="medium"
              onClick={onBack}
              className="gap-2 border-2 border-gray-300 hover:border-gray-500 h-12 px-6"
            >
              <ArrowLeft className="size-5" />
              <span className="font-medium text-base">Ortga</span>
            </Button>
          )}
          {/* Kelishish tugmasi - backup bo'limida yashirilgan */}
          {category !== 'backup' && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowKelishishModal(true)}
              className={`gap-2 border-2 h-12 px-6 ${kelishishStatus === 'roziman'
                  ? 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-700'
                  : kelishishStatus === 'rozi-emasman'
                    ? 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
                    : kelishishStatus === 'qisman'
                      ? 'border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                      : 'border-purple-300 text-purple-600 hover:border-purple-500 hover:bg-purple-50'
                }`}
            >
              {(!kelishishStatus || kelishishStatus === 'roziman') && <img src={kelishishIcon} alt="Kelishish" className="size-6 mix-blend-multiply" />}
              <span className="font-medium text-base">
                {kelishishStatus === 'roziman' && 'Kelishilgan'}
                {kelishishStatus === 'rozi-emasman' && 'Kelishilmagan'}
                {kelishishStatus === 'qisman' && 'Qisman'}
                {!kelishishStatus && 'Kelishish'}
              </span>
            </Button>
          )}
          <Button
            variant="outlined"
            size="medium"
            onClick={() => setShowIjroHarakatiModal(true)}
            className="gap-2 border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 h-12 px-6"
          >
            <img src={ijroIcon} alt="Ijro" className="size-6 mix-blend-multiply" />
            <span className="font-medium text-base">Ijro qadamlari</span>
          </Button>
          {/* Imzolash tugmasi - approval bo'limida yashirilgan */}
          {category !== 'approval' && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowImzolashModal(true)}
              className="gap-2 border-2 border-red-600 text-red-600 hover:border-red-700 hover:bg-red-50 h-12 px-6"
            >
              <img src={imzolashIcon} alt="Imzolash" className="size-6 mix-blend-multiply" />
              <span className="font-medium text-base">Imzolash</span>
            </Button>
          )}
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 ml-auto h-12 px-6" onClick={() => setShowSendModal(true)}>
            <Send className="size-5" />
            <span className="text-base">Yuborish</span>
          </Button>
        </div>
      </div>

      {/* Buyurtma uchun kelgan tovarlar ro'yxati - Collapse Card */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setShowGoodsTable(!showGoodsTable)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="size-8 text-gray-700" strokeWidth={1.5} />
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900">Buyurtma uchun kelgan tovarlar ro'yxati</h3>
              <p className="text-sm text-gray-500">Jami: {mockGoods.length} ta tovar</p>
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
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Yillik reja</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Tovar nomi</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Modeli</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">O'lchami</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">O'lchov birligi</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Soni</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Izoh</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGoods.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">{index + 1}</td>

                      {/* Buyurtma turi - badge with dropdown */}
                      <td className="border border-gray-300 px-4 py-3 relative">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowTypeDropdown(showTypeDropdown === index ? null : index)}
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

                          {showTypeDropdown === index && (
                            <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                              <button
                                onMouseDown={() => {
                                  const updatedGoods = [...mockGoods];
                                  updatedGoods[index].type = 'Tovar';
                                  setMockGoods(updatedGoods);
                                  setShowTypeDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 rounded-t-lg transition-colors"
                              >
                                <div className="size-2 rounded-full bg-blue-500"></div>
                                Tovar
                              </button>
                              <button
                                onMouseDown={() => {
                                  const updatedGoods = [...mockGoods];
                                  updatedGoods[index].type = 'Xizmat';
                                  setMockGoods(updatedGoods);
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

                      {/* Yillik reja */}
                      <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowYearPlanModal(true);
                            setSelectedRowIndex(index);
                          }}
                          className="inline-block"                        >
                          {item.yearPlan ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300 cursor-pointer hover:bg-green-200 transition-colors">
                              {item.yearPlan.name}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
                              Tanlash
                            </Badge>
                          )}
                        </button>
                      </td>

                      {/* Tovar nomi - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].name = e.target.value;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm font-medium border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Modeli - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="text"
                          value={item.model}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].model = e.target.value;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* O'lchami - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="text"
                          value={item.size}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].size = e.target.value;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* O'lchov birligi - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="text"
                          value={item.unit}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].unit = e.target.value;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm text-center border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Soni - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].quantity = parseInt(e.target.value) || 0;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm text-center font-semibold border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Izoh - editable */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="text"
                          value={item.note}
                          onChange={(e) => {
                            const updatedGoods = [...mockGoods];
                            updatedGoods[index].note = e.target.value;
                            setMockGoods(updatedGoods);
                          }}
                          className="text-sm italic border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* O'chirish tugmasi */}
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            const updatedGoods = mockGoods.filter((_, i) => i !== index);
                            setMockGoods(updatedGoods);
                          }}
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

            {/* Yangi qator qo'shish tugmasi */}
            <div className="mt-4">
              <Button
                variant="outlined"
                className="gap-2"
                onClick={() => {
                  // Yangi bo'sh qator qo'shish
                  const newRow = {
                    id: Date.now(),
                    type: 'Tovar',
                    yearPlan: null,
                    name: '',
                    model: '',
                    size: '',
                    unit: '',
                    quantity: 0,
                    note: ''
                  };
                  setMockGoods([...mockGoods, newRow]);
                }}
              >
                <Plus className="size-4" />
                Tovar qo'shish
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Hujjat ma'lumotlari */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {document && (categoryNames[document.category] || document.category)} - <span className="text-blue-600">{document?.number}</span> - {document?.date}
          </h2>
        </div>

        {/* Content List - Vertical format */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Hujjat raqami */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat raqami</label>
              <div className="flex-1 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="size-4" />
                </button>
                <span className="text-base text-gray-900 font-medium">{document?.number}</span>
              </div>
            </div>

            {/* Hujjat sanasi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat sanasi</label>
              <div className="flex-1">
                <span className="text-base text-gray-900">{document?.date || ''}</span>
              </div>
            </div>

            {/* Hujjat turi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat turi</label>
              <div className="flex-1">
                <span className="text-base text-gray-900">{categoryNames[document?.category ?? ''] || document?.category}</span>
              </div>
            </div>

            {/* Jurnal */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Jurnal</label>
              <div className="flex-1 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="size-4" />
                </button>
                <span className="text-base text-gray-900">Хизмат хати</span>
              </div>
            </div>

            {/* Masala */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Masala</label>
              <div className="flex-1">
                <span className="text-base text-gray-900">-</span>
              </div>
            </div>

            {/* Hujjat nomi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat nomi</label>
              <div className="flex-1 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="size-4" />
                </button>
                <span className="text-base text-gray-900">Чиқувчи хужжат</span>
              </div>
            </div>

            {/* Qisqacha mazmuni */}
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48 pt-1">Qisqacha mazmuni</label>
              <div className="flex-1 flex items-start gap-3">
                <button className="text-gray-400 hover:text-gray-600 mt-1">
                  <Edit2 className="size-4" />
                </button>
                <p className="text-base text-gray-900 flex-1">
                  {document?.title || ''}
                </p>
              </div>
            </div>

            {/* Hujjat heshteglari */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat heshteglari</label>
              <div className="flex-1">
                <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 border-2 border-dashed border-blue-300 rounded-full size-8">
                  <Plus className="size-5" />
                </button>
              </div>
            </div>

            {/* Qabul qiluvchilar */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm text-gray-500 w-48">Qabul qiluvchilar</label>
              <div className="flex-1">
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="size-4" />
                  Qa'shish
                </Button>
              </div>
            </div>

            {/* Kelishish uchun spravichnik */}

          </div>
        </div>
      </div>

      {/* Ilovalar bo'limi */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Ilovalar</h3>

        {/* Asosiy fayl - DOCX */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">

        </div>

        {/* PDF fayllar grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* PDF 1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="shrink-0 size-12 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">DD33...5690.pdf</p>
                <p className="text-xs text-gray-500">0,04 mb</p>
                <p className="text-xs text-gray-400">30 yanvar 2026 10:26</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleViewPDF('DD33...5690.pdf')}>
                <Eye className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleDownloadPDF('DD33...5690.pdf')}>
                <Download className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="size-5" />
              </button>
            </div>
          </div>

          {/* PDF 2 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="shrink-0 size-12 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">қа...7098.pdf</p>
                <p className="text-xs text-gray-500">4,04 mb</p>
                <p className="text-xs text-gray-400">30 yanvar 2026 10:26</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleViewPDF('қа...7098.pdf')}>
                <Eye className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleDownloadPDF('қа...7098.pdf')}>
                <Download className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="size-5" />
              </button>
            </div>
          </div>

          {/* PDF 3 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="shrink-0 size-12 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">QE31...3503.pdf</p>
                <p className="text-xs text-gray-500">0,35 mb</p>
                <p className="text-xs text-gray-400">30 yanvar 2026 10:26</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleViewPDF('QE31...3503.pdf')}>
                <Eye className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => handleDownloadPDF('QE31...3503.pdf')}>
                <Download className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Qo'shish tugmalari */}
        <div className="flex items-center gap-3">
          <Button variant="outlined" className="gap-2" onClick={handleFileUpload}>
            <Plus className="size-4" />
            Ilova qo'shish
          </Button>
          <Button variant="outlined" className="gap-2" onClick={() => setShowRelatedDocModal(true)}>
            <Plus className="size-4" />
            Aloqador hujjat qo'shish
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </div>

      {/* Related Document Modal */}
      <RelatedDocumentModal
        isOpen={showRelatedDocModal}
        onClose={() => setShowRelatedDocModal(false)}
        onSave={(documents: any) => {
          console.log('Selected related documents:', documents);
          setShowRelatedDocModal(false);
        }}
      />

      {/* Ijro Harakati Modal */}
      <IjroHarakatiModal
        isOpen={showIjroHarakatiModal}
        onClose={() => setShowIjroHarakatiModal(false)}
        steps={currentDocumentSteps}
      />

      {/* Year Plan Modal */}
      <YearPlanModal
        isOpen={showYearPlanModal}
        onClose={() => setShowYearPlanModal(false)}
        onSelect={(item: null) => {
          console.log('Selected year plan item:', item);
          // Bu yerda tanlangan tovarni jadvalga qo'shish logikasi
          if (selectedRowIndex !== null) {
            const updatedGoods = [...mockGoods];
            updatedGoods[selectedRowIndex].yearPlan = item;
            setMockGoods(updatedGoods);
          }
          setShowYearPlanModal(false);
        }}
      />

      {/* Add Goods Modal */}
      <AddGoodsModal
        isOpen={showAddGoodsModal}
        onClose={() => setShowAddGoodsModal(false)}
        onSave={(newGoods: { id: number; type: string; yearPlan: null; name: string; model: string; size: string; unit: string; quantity: number; note: string; }) => {
          console.log('Added new goods:', newGoods);
          // Bu yerda yangi tovarlarni jadvalga qo'shish logikasi
          setMockGoods([...mockGoods, newGoods]);
          setShowAddGoodsModal(false);
        }}
      />

      {/* Kelishish Modal */}
      <KelishishModal
        isOpen={showKelishishModal}
        onClose={() => setShowKelishishModal(false)}
        documentNumber={document?.number}
        documentId={document?.id}
        status={kelishishStatus}
        setStatus={setKelishishStatus}
        onAddStep={(step) => {
          if (document?.id) {
            setIjroSteps(prev => ({
              ...prev,
              [document.id]: [...(prev[document.id] || []), step]
            }));
          }
        }}
      />

      {/* Search Filter Panel */}
      <SearchFilterPanel
        isOpen={showSearchFilter}
        onClose={() => setShowSearchFilter(false)}
      />

      {/* Imzolash Modal */}
      <ImzolashModal
        isOpen={showImzolashModal}
        onClose={() => setShowImzolashModal(false)}
        documentNumber={document?.number}
        onAddStep={handleAddStep}
      />

      {/* Send Document Modal */}
      <SendDocumentModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSend={(employee: { name: any; position: any; department: any; }, purpose: string) => {
          // Ijro qadamlariga yozish
          const now = new Date();
          const formattedDate = `${now.getDate()} ${['yan', 'fev', 'mart', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          const getPurposeText = (p: string) => {
            switch (p) {
              case 'signing': return 'Imzolash uchun';
              case 'backup': return 'Ustixat uchun';
              case 'execution': return 'Ijro uchun';
              default: return p;
            }
          };

          // Oldingi xodimni aniqlash (oxirgi qadamdan)
          const previousStep = currentDocumentSteps[currentDocumentSteps.length - 1];

          const newStep: IjroStep = {
            id: Date.now().toString(),
            fromEmployee: previousStep?.employee || 'Aliyev J.N.', // Kimdan
            fromPosition: previousStep?.position || 'Bosh mutaxassis',
            fromDepartment: previousStep?.department || 'Moliya bo\'limi',
            employee: employee.name, // Kimga
            position: employee.position,
            department: employee.department,
            action: getPurposeText(purpose),
            date: formattedDate,
            status: 'sent'
          };

          setIjroSteps(prev => ({
            ...prev,
            [document?.id || '']: [...(prev[document?.id || ''] || []), newStep]
          }));
          setShowSendModal(false);
        }}
        onSuccess={(message: string) => {
          if (onSuccess) {
            onSuccess(message);
          }
        }}
        documentNumber={document?.number || ''}
        documentTitle={document?.title || ''}
      />
    </div>
  );
}

export default DocumentDetailView;