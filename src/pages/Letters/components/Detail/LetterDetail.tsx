import { useEffect, useRef, useState } from "react";
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
  HandshakeIcon,
  Pencil,
  GitBranch,
} from "lucide-react";
import RelatedDocumentModal from "./RelatedDocumentModal";
import { ExecutiveAction, type IjroStep } from "./ExecutiveAction";
import { YearPlanModal } from "./YearPlanModal";
import { AddGoodsModal } from "./AddGoodsModal";
import { AgreementModal } from "./AgreementModal";
import { SearchFilterPanel } from "./SearchFilterPanel";
import SigningModal from "./SigningModal";
import { SendDocumentModal } from "./SendDocumentModal";

import { Badge, Button, Card, Input } from "antd";
import { axiosAPI } from "@/service/axiosAPI";
import SendModal from "@/pages/CreateDocument/components/SendModal";

interface Document {
  id: number;
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

interface Product {
  id: number;
  type: string;
  yearPlan: any;
  name: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  note: string;
}

interface AttachmentFile {
  id: number;
  file: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

interface Participant {
  id: number;
  name: string;
  position: string;
  department: string;
}

interface OrderData {
  id: number;
  products: Product[];
  attachment_files: AttachmentFile[];
  participants: Participant[];
  movement_files: any[];
  department_name: string;
  sub_department_name: string | null;
  sender_name: string | null;
  receiver_name: string;
  father_id: string;
  order_type: string;
  created_at: string;
  incoming_number: string;
  outgoing_number: string | null;
  movement_type: string;
  direction: string;
  comment: string;
  is_accepted: boolean;
  is_done: boolean | null;
  done_date: string | null;
}

interface DocumentDetailViewProps {
  document?: Document;
  onBack?: () => void;
  onClose?: () => void;
  category?:
    | "execution"
    | "signing"
    | "resolution"
    | "info"
    | "approval"
    | "for-signing"
    | "backup";
  onSuccess?: (message: string) => void;
}

const LetterDetail: React.FC<DocumentDetailViewProps> = ({
  document: documentProp,
  onBack,
  category,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRelatedDocModal, setShowRelatedDocModal] = useState(false);
  const [showExecutiveActionModal, setShowExecutiveActionModal] =
    useState(false);
  const [showGoodsTable, setShowGoodsTable] = useState(false); // Default yopiq holatda
  const [showYearPlanModal, setShowYearPlanModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [showAddGoodsModal, setShowAddGoodsModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState<number | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementStatus, setAgreementStatus] = useState<
    "roziman" | "rozi-emasman" | "qisman" | null
  >(null);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Har bir xat uchun alohida ijro qadamlari - xat ID bo'yicha
  const [ijroSteps, setIjroSteps] = useState<Record<number, IjroStep[]>>({});

  // Joriy xatning ijro qadamlarini olish
  const currentDocumentSteps = documentProp?.id
    ? ijroSteps[documentProp.id] || []
    : [];

  // Order data from API
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Mock tovarlar ma'lumotlari - state ga o'zgartirdik
  const [mockGoods, setMockGoods] = useState<Product[]>([
    {
      id: 1,
      type: "Xarid qilish",
      yearPlan: null,
      name: "Qog'oz A4",
      model: "Premium",
      size: "210x297mm",
      unit: "dona",
      quantity: 500,
      note: "Oq rang, 80g/m²",
    },
    {
      id: 2,
      type: "Xarid qilish",
      yearPlan: null,
      name: "Ruchka",
      model: "Ball Pen",
      size: "0.7mm",
      unit: "dona",
      quantity: 200,
      note: "Ko'k rang",
    },
    {
      id: 3,
      type: "Zaxira",
      yearPlan: null,
      name: "Papka",
      model: "Standart",
      size: "A4",
      unit: "dona",
      quantity: 100,
      note: "Plastik",
    },
    {
      id: 4,
      type: "Xarid qilish",
      yearPlan: null,
      name: "Marker",
      model: "Permanent",
      size: "3mm",
      unit: "dona",
      quantity: 50,
      note: "Qora rang",
    },
    {
      id: 5,
      type: "Zaxira",
      yearPlan: null,
      name: "Skoch",
      model: "Transparent",
      size: "48mm x 50m",
      unit: "dona",
      quantity: 30,
      note: "Shaffof",
    },
    {
      id: 6,
      type: "Ta'mir",
      yearPlan: null,
      name: "USB Flash",
      model: "Kingston DT100",
      size: "32GB",
      unit: "dona",
      quantity: 20,
      note: "USB 3.0",
    },
    {
      id: 7,
      type: "Yangi jihozlash",
      yearPlan: null,
      name: "Stol",
      model: "Офис-Люкс",
      size: "120x60x75cm",
      unit: "dona",
      quantity: 5,
      note: "Yog'och",
    },
  ]);

  const categoryNames: Record<string, string> = {
    reply: "Javob xati",
    outgoing: "Chiquvchi hujjat",
    internal: "Ichki hujjat",
    other: "Bildirgi",
    all: "Barchasi",
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected files:", files);
      // Bu yerda fayllarni yuklash logikasi
    }
  };

  const handleAddStep = (step: IjroStep) => {
    if (documentProp?.id) {
      setIjroSteps((prev) => ({
        ...prev,
        [documentProp.id]: [...(prev[documentProp.id] || []), step],
      }));
    }
  };

  // fetch orderData detail
  const fetchOrderData = async () => {
    try {
      const response = await axiosAPI.get(
        `document/orders/${documentProp?.id}/`,
      );
      if (response.status === 200) {
        setOrderData(response.data);
        // Set products if available
        if (response.data.products && response.data.products.length > 0) {
          setMockGoods(response.data.products);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (documentProp?.id) {
      fetchOrderData();
    }
  }, [documentProp?.id]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
          {orderData?.movement_type === "in_approval" && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowAgreementModal(true)}
              className={`gap-2 border-2 h-12 px-6 ${
                agreementStatus === "roziman"
                  ? "border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-700"
                  : agreementStatus === "rozi-emasman"
                    ? "border-red-500 text-red-700 bg-red-50 hover:bg-red-100"
                    : agreementStatus === "qisman"
                      ? "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                      : "border-purple-300 text-purple-600 hover:border-purple-500 hover:bg-purple-50"
              }`}
            >
              {(!agreementStatus || agreementStatus === "roziman") && (
                <HandshakeIcon className="w-4 h-4 mix-blend-multiply" />
              )}
              <span className="font-medium text-base">
                {agreementStatus === "roziman" && "Kelishilgan"}
                {agreementStatus === "rozi-emasman" && "Kelishilmagan"}
                {agreementStatus === "qisman" && "Qisman"}
                {!agreementStatus && "Kelishish"}
              </span>
            </Button>
          )}
          <Button
            variant="outlined"
            size="medium"
            onClick={() => setShowExecutiveActionModal(true)}
            className="gap-2 border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 h-12 px-6"
          >
            <GitBranch className="w-4 h-4" />
            <span className="font-medium text-base">Ijro qadamlari</span>
          </Button>
          {/* Imzolash tugmasi - approval bo'limida yashirilgan */}
          {orderData?.movement_type !== "in_signing" && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowSigningModal(true)}
              className="gap-2 border-2 border-red-600 text-red-600 hover:border-red-700 hover:bg-red-50 h-12 px-6"
            >
              <Pencil className="w-4 h-4 mix-blend-multiply" />
              <span className="font-medium text-base">Imzolash</span>
            </Button>
          )}
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700 ml-auto h-12 px-6"
            onClick={() => setShowSendModal(true)}
          >
            <Send className="w-4 h-4" />
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
            <ShoppingCart className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900">
                Buyurtma uchun kelgan tovarlar ro'yxati
              </h3>
              <p className="text-sm text-gray-500">
                Jami: {mockGoods.length} ta tovar
              </p>
            </div>
          </div>
          {showGoodsTable ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showGoodsTable && (
          <div className="border-t border-gray-200 p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      №
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Buyurtma turi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Yillik reja
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tovar nomi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Modeli
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      O'lchami
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      O'lchov birligi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Soni
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Izoh
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockGoods.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">
                        {index + 1}
                      </td>

                      {/* Buyurtma turi - badge with dropdown */}
                      <td className="border border-gray-300 px-4 py-3 relative">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setShowTypeDropdown(
                                showTypeDropdown === index ? null : index,
                              )
                            }
                            className="inline-flex items-center gap-2"
                          >
                            <Badge
                              className={`cursor-pointer transition-colors ${
                                item.type === "Tovar"
                                  ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                  : "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
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
                                  updatedGoods[index].type = "Tovar";
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
                                  updatedGoods[index].type = "Xizmat";
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
                          className="inline-block"
                        >
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
                            updatedGoods[index].quantity =
                              parseInt(e.target.value) || 0;
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
                            const updatedGoods = mockGoods.filter(
                              (_, i) => i !== index,
                            );
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
                    type: "Tovar",
                    yearPlan: null,
                    name: "",
                    model: "",
                    size: "",
                    unit: "",
                    quantity: 0,
                    note: "",
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
            {categoryNames[
              (orderData?.order_type || documentProp?.category) ?? ""
            ] || documentProp?.category}{" "}
            -{" "}
            <span className="text-blue-600">
              {orderData?.incoming_number || documentProp?.number}
            </span>{" "}
            -{" "}
            {orderData?.created_at
              ? formatDate(orderData.created_at)
              : documentProp?.date}
          </h2>
        </div>

        {/* Content List - Vertical format */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Hujjat raqami */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">
                Hujjat raqami
              </label>
              <div className="flex-1 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="size-4" />
                </button>
                <span className="text-base text-gray-900 font-medium">
                  {orderData?.incoming_number || documentProp?.number}
                </span>
              </div>
            </div>

            {/* Hujjat sanasi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">
                Hujjat sanasi
              </label>
              <div className="flex-1">
                <span className="text-base text-gray-900">
                  {orderData?.created_at
                    ? formatDate(orderData.created_at)
                    : documentProp?.date}
                </span>
              </div>
            </div>

            {/* Hujjat turi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Hujjat turi</label>
              <div className="flex-1">
                <span className="text-base text-gray-900">
                  {categoryNames[
                    (orderData?.order_type || documentProp?.category) ?? ""
                  ] || documentProp?.category}
                </span>
              </div>
            </div>

            {/* Bo'lim */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Bo'lim</label>
              <div className="flex-1 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="size-4" />
                </button>
                <span className="text-base text-gray-900">
                  {orderData?.department_name || "-"}
                </span>
              </div>
            </div>

            {/* Qabul qiluvchi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">
                Qabul qiluvchi
              </label>
              <div className="flex-1">
                <span className="text-base text-gray-900">
                  {orderData?.receiver_name || "-"}
                </span>
              </div>
            </div>

            {/* Jo'natuvchi */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Jo'natuvchi</label>
              <div className="flex-1">
                <span className="text-base text-gray-900">
                  {orderData?.sender_name || "-"}
                </span>
              </div>
            </div>

            {/* Qisqacha mazmuni */}
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48 pt-1">
                Qisqacha mazmuni
              </label>
              <div className="flex-1 flex items-start gap-3">
                <button className="text-gray-400 hover:text-gray-600 mt-1">
                  <Edit2 className="size-4" />
                </button>
                <p className="text-base text-gray-900 flex-1">
                  {orderData?.comment || "-"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">Holat</label>
              <div className="flex-1">
                <span
                  className={`text-base font-medium ${
                    orderData?.is_accepted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {orderData?.is_accepted
                    ? "Qabul qilingan"
                    : "Qabul qilinmagan"}
                </span>
              </div>
            </div>

            {/* Hujjat heshteglari */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <label className="text-sm text-gray-500 w-48">
                Hujjat heshteglari
              </label>
              <div className="flex-1">
                <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 border-2 border-dashed border-blue-300 rounded-full size-8">
                  <Plus className="size-5" />
                </button>
              </div>
            </div>

            {/* Qabul qiluvchilar */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm text-gray-500 w-48">
                Qabul qiluvchilar
              </label>
              <div className="flex-1">
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="size-4" />
                  Qo'shish
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

        {/* Fayllar grid */}
        {orderData &&
        orderData.attachment_files &&
        orderData.attachment_files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {orderData.attachment_files.map((file) => {
              const fileExtension =
                file.file_name.split(".").pop()?.toUpperCase() || "FILE";
              const bgColor =
                fileExtension === "PDF"
                  ? "bg-red-600"
                  : fileExtension === "DOCX" || fileExtension === "DOC"
                    ? "bg-blue-600"
                    : "bg-gray-600";

              return (
                <div
                  key={file.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`shrink-0 size-12 ${bgColor} rounded flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {fileExtension}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file_size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(file.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => window.open(file.file, "_blank")}
                    >
                      <Eye className="size-5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        const linkElement = window.document.createElement("a");
                        linkElement.href = file.file;
                        linkElement.download = file.file_name;
                        linkElement.click();
                      }}
                    >
                      <Download className="size-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="size-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center text-gray-500">
            Hech qanday ilova yo'q
          </div>
        )}

        {/* Qo'shish tugmalari */}
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            className="gap-2"
            onClick={handleFileUpload}
          >
            <Plus className="size-4" />
            Ilova qo'shish
          </Button>
          <Button
            variant="outlined"
            className="gap-2"
            onClick={() => setShowRelatedDocModal(true)}
          >
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
        onSave={(documents) => {
          console.log("Selected related documents:", documents);
          setShowRelatedDocModal(false);
        }}
      />

      {/* Executive Action Modal */}
      <ExecutiveAction
        isOpen={showExecutiveActionModal}
        onClose={() => setShowExecutiveActionModal(false)}
        steps={currentDocumentSteps}
      />

      {/* Year Plan Modal */}
      <YearPlanModal
        isOpen={showYearPlanModal}
        onClose={() => setShowYearPlanModal(false)}
        onSelect={(item) => {
          console.log("Selected year plan item:", item);
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
        onSave={(newGoods) => {
          console.log("Added new goods:", newGoods);
          // Bu yerda yangi tovarlarni jadvalga qo'shish logikasi
          setMockGoods([...mockGoods, newGoods]);
          setShowAddGoodsModal(false);
        }}
      />

      {/* Kelishish Modal */}
      <AgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        documentNumber={documentProp?.number}
        documentId={documentProp?.id?.toString()}
        status={agreementStatus}
        setStatus={setAgreementStatus}
        onAddStep={(step) => {
          if (documentProp?.id) {
            setIjroSteps((prev) => ({
              ...prev,
              [documentProp.id]: [...(prev[documentProp.id] || []), step],
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
      <SigningModal
        isOpen={showSigningModal}
        onClose={() => setShowSigningModal(false)}
        documentNumber={documentProp?.number}
        onAddStep={handleAddStep}
      />

      {/* Send Document Modal */}
      {showSendModal && (
        <SendModal
          orderDataID={orderData?.id!}
          setIsSendModalOpen={setShowSendModal}
        />
      )}
    </div>
  );
};

export default LetterDetail;
