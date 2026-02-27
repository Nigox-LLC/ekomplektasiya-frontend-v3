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
  Globe,
  X,
  Warehouse,
  FileText,
  Check,
} from "lucide-react";
import RelatedDocumentModal from "./RelatedDocumentModal";
import { ExecutiveAction, type IjroStep } from "./ExecutiveAction";
import { YearPlanModal } from "./YearPlanModal";
import { AddGoodsModal } from "./AddGoodsModal";
import AgreementModal from "@/components/AgreementModal";
import { SearchFilterPanel } from "./SearchFilterPanel";
import SigningModal from "./SigningModal";
import { SendDocumentModal } from "./SendDocumentModal";

import { Badge, Button, Card, Input, InputNumber, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { axiosAPI } from "@/service/axiosAPI";
import SendModal from "@/pages/CreateDocument/components/SendModal";
import PostedProductModal from "./PostedProductModal/PostedProductModal";
import ProductFieldModal from "@/pages/CreateDocument/components/ProductsSection/ProductFieldModal";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks/hooks";
import FilePreviewModal from "@/components/FilePreviewModal/FilePreviewModal";
import { FilePreviewer } from "@/components";
import EmployeeSelectModal from "@/components/EmployeeSelectModal/EmployeeSelectModal";
import MainDocument from "./MainDocument";

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

type PostedWebsiteData = {
  id: number;
  title: string;
  text: string;
  description?: string | null;
  category_id: string;
  category_name: string;
  posted_file_url?: string | null;
  file_pdf?: string | null;
  created_at: string;
};

interface Product {
  id: number;
  order_product_type?: "order" | "service";
  type: string;
  yearPlan: any;
  name: string;
  model: string;
  product_type?: IDName | null;
  product_model?: IDName | null;
  size: IDName | null;
  unit: IDName | null;
  quantity: number;
  note: string;
  attached_employee?: { id: number; full_name: string } | null;
  posted_website?: PostedWebsiteData | null;
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
  purpose: string;
  employee_name: string;
}

export interface OrderData {
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
  is_send: boolean;
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
  const [showCheckedWarehouseModal, setShowCheckedWarehouseModal] =
    useState(false);
  const [showSelectEmployeeModal, setShowSelectEmployeeModal] = useState(0);
  const typeDropdownRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [productFieldModalOpen, setProductFieldModalOpen] = useState<{
    type:
      | "product/type"
      | "measurement/size"
      | "measurement/unit"
      | "product/model"
      | null;
    index: number;
  }>({ type: null, index: -1 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  // Har bir xat uchun alohida ijro qadamlari - xat ID bo'yicha
  const [ijroSteps, setIjroSteps] = useState<Record<number, IjroStep[]>>({});

  // Posted product modal state
  const [showPostedProductModal, setShowPostedProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Joriy xatning ijro qadamlarini olish
  const currentDocumentSteps = documentProp?.id
    ? ijroSteps[documentProp.id] || []
    : [];

  // Order data from API
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [cancelDesc, setCancelDesc] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Cancel products state - tracks which products to cancel and quantities
  const [cancelProducts, setCancelProducts] = useState<
    Array<{ id: number; is_cancel: boolean; cancel_quantity: number }>
  >([]);

  const { currentUserInfo } = useAppSelector((state) => state.info);

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

  const handleAttachFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosAPI.post(
        `document/orders/${orderData?.id}/add-attachment/`,
        formData,
      );

      if (response.status === 200) {
        toast.success("Fayl muvaffaqiyatli yuklandi");
        fetchOrderData(); // Yangi fayl qo'shilgandan so'ng order data ni yangilash
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleAttachFile(files[0]);
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

  const handleOpenPostedModal = (product: Product) => {
    if (!product || !product.id) {
      toast.error("Mahsulot ID si topilmadi");
      return;
    }
    setSelectedProduct(product);
    setShowPostedProductModal(true);
  };

  // fetch orderData detail
  // const fetchOrderData = async () => {
  //   try {
  //     const response = await axiosAPI.get(
  //       `document/orders/${documentProp?.id}/`,
  //     );

  //     if (response.status === 200) {
  //       setOrderData(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchOrderData = async () => {
    try {
      const response = await axiosAPI.get(
        `document/orders/${documentProp?.id}/`,
      );
      if (response.status === 200) {
        const data = response.data;

        const transformedProducts = data.products.map((p: any) => ({
          id: p.id,
          order_product_type:
            p.order_product_type === "product" ? "order" : p.order_product_type,
          name: p.product_name || "",
          model: p.product_model?.name || "",
          product_type: p.product_type
            ? { id: p.product_type.id, name: p.product_type.name }
            : null,
          product_model: p.product_model
            ? { id: p.product_model.id, name: p.product_model.name }
            : null,
          size: p.size ? { id: p.size.id, name: p.size.name } : null,
          unit: p.unit ? { id: p.unit.id, name: p.unit.name } : null,
          quantity: p.quantity,
          note: p.comment || "",
          attached_employee: p.attached_employee
            ? {
                id: p.attached_employee.id,
                full_name:
                  p.attached_employee.name || p.attached_employee.full_name,
              }
            : null,
          posted_website: p.posted_website,
          // yearPlan: p.annual_plan,
        }));

        setOrderData({
          ...data,
          products: transformedProducts,
        });
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

  const getParticipantPurpose = (participant: Participant) => {
    if (participant.purpose === "application_letter") return "Murajaat uchun";
    else if (participant.purpose === "executing") return "Ijro uchun";
    else if (participant.purpose === "in_approval") return "Kelishish uchun";
    else if (participant.purpose === "in_signing") return "Imzolash uchun";
  };

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

  const isIdName = (value: unknown): value is IDName => {
    return !!value && typeof value === "object" && "id" in value;
  };

  const getFieldLabel = (value: IDName | string | null | undefined) => {
    if (!value) return "";
    return typeof value === "string" ? value : value.name;
  };

  const getModelLabel = (product: Product) => {
    if (isIdName(product.product_model) && product.product_model.id) {
      return product.product_model.name;
    }
    return product.model || "";
  };

  // handleUpdate order

  // const handleOrderUpdate = async () => {
  //   if (orderData) {
  //     try {
  //       const response = await axiosAPI.patch(
  //         `document/orders/${orderData.id}/`,
  //         {
  //           comment: orderData.comment,
  //           participants: orderData.participants,
  //           products: orderData.products.map((product) => ({
  //             ...product,
  //             order_product_id: product.order_product_type,
  //             product_type: product.product_type?.id,
  //             product_model: product.product_model?.id,
  //             size: product.size?.id,
  //             unit: product.unit?.id,
  //             attached_employee: product.attached_employee?.id,
  //           })),
  //         },
  //       );
  //       if (response.status === 200) {
  //         toast.success("Buyurtma muvaffaqiyatli yangilandi");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleOrderUpdate = async () => {
    if (orderData) {
      if (orderData.products.length === 0) {
        toast.error("Mahsulotlar ro'yxati bo'sh bo'lishi mumkin emas!");
        return;
      }
      try {
        const payload = {
          comment: orderData.comment,
          participants: orderData.participants,
          products: orderData.products.map((item) => ({
            ...item,
            product_type: item.product_type?.id || null,
            product_model: item.product_model?.id || null,
            size: item.size?.id || null,
            unit: item.unit?.id || null,
          })),
        };

        const response = await axiosAPI.patch(
          `document/orders/${orderData.id}/`,
          payload,
        );
        if (response.status === 200) {
          toast.success("Buyurtma muvaffaqiyatli yangilandi");
          fetchOrderData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // handle update orderdata products input onchange
  const handleInputOnchange = (index: number, field: string, value: any) => {
    const updatedGoods = [...orderData!.products];
    // @ts-ignore
    updatedGoods[index][field] = value;
    setOrderData((prev) => ({
      ...prev!,
      products: updatedGoods,
    }));

    console.log(orderData);
  };

  const handleTypeDropdownToggle = (itemId: number) => {
    const newState = showTypeDropdown === itemId ? null : itemId;
    setShowTypeDropdown(newState);

    if (newState !== null) {
      setTimeout(() => {
        const dropdownElement = typeDropdownRef.current[itemId];
        if (dropdownElement) {
          dropdownElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      }, 50);
    }
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  };

  const handleMainFileUpload = async (file: File) => {};

  const handleMainFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleMainFileUpload(files[0]);
    }
  };

  const { department_category } = useAppSelector(
    (state) => state.info.currentUserInfo,
  );

  const goodsColumns: ColumnsType<Product> = [
    {
      title: "№",
      key: "index",
      width: 60,
      fixed: "left",
      render: (_value, _record, index) => (
        <span className="text-sm text-gray-600">{index + 1}</span>
      ),
    },
    {
      title: "Buyurtma turi",
      key: "type",
      width: 140,
      render: (_value, item, index) => (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => handleTypeDropdownToggle(index)}
            className="inline-flex items-center gap-2"
          >
            <Badge
              className={`cursor-pointer transition-colors p-2! flex! items-center! gap-2! rounded-md ${
                item.order_product_type === "order"
                  ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  : item.order_product_type === "service"
                    ? "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
                    : ""
              }`}
            >
              {item.order_product_type === "order"
                ? "Tovar"
                : item.order_product_type === "service"
                  ? "Xizmat"
                  : "Tanlang"}
              <ChevronDown className="size-3 text-gray-500" />
            </Badge>
          </button>

          {showTypeDropdown === index && (
            <div
              ref={(el) => {
                typeDropdownRef.current[index] = el;
              }}
              className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
            >
              <button
                type="button"
                onClick={() => {
                  handleInputOnchange(index, "order_product_type", "order");
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
                  handleInputOnchange(index, "order_product_type", "service");
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
      ),
    },
    {
      title: "Yillik reja",
      key: "yearPlan",
      width: 150,
      align: "center",
      render: (_value, item, index) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowYearPlanModal(true);
            setSelectedRowIndex(index);
          }}
          className={`inline-block px-2 py-1 cursor-pointer rounded-md ${item.yearPlan ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"} transition-colors`}
        >
          {item.yearPlan ? (
            <Badge>{item.yearPlan.name}</Badge>
          ) : (
            <Badge>Tanlash</Badge>
          )}
        </button>
      ),
    },
    {
      title: "Tovar nomi",
      key: "name",
      width: 200,
      render: (_value, item, index) => (
        <Input
          type="text"
          value={item.name}
          onChange={(e) => handleInputOnchange(index, "name", e.target.value)}
          className="text-sm font-medium border-0 focus:ring-1 focus:ring-blue-500"
          placeholder="Nomi"
        />
      ),
    },
    {
      title: "Tovar turi",
      key: "product_type",
      width: 160,
      render: (_value, item, index) => (
        <Button
          className="w-full"
          onClick={() => {
            setProductFieldModalOpen({
              type: "product/type",
              index,
            });
          }}
        >
          {isIdName(item.product_type) && item.product_type.id
            ? item.product_type.name
            : "Turi tanlang"}
        </Button>
      ),
    },
    {
      title: "Modeli",
      key: "product_model",
      width: 140,
      render: (_value, item, index) => (
        <Button
          className="w-full"
          onClick={() => {
            setProductFieldModalOpen({
              type: "product/model",
              index,
            });
          }}
          disabled={!isIdName(item.product_type) || !item.product_type?.id}
        >
          {getModelLabel(item) || "Tanlang"}
        </Button>
      ),
    },
    {
      title: "O'lchami",
      key: "size",
      width: 140,
      render: (_value, item, index) => (
        <Button
          className="w-full"
          onClick={() => {
            setProductFieldModalOpen({
              type: "measurement/size",
              index,
            });
          }}
          disabled={!isIdName(item.product_model) || !item.product_model?.id}
        >
          {getFieldLabel(item.size) || "O'lcham tanlang"}
        </Button>
      ),
    },
    {
      title: "O'lchov birligi",
      key: "unit",
      width: 170,
      render: (_value, item, index) => (
        <Button
          className="w-full"
          onClick={() => {
            setProductFieldModalOpen({
              type: "measurement/unit",
              index,
            });
          }}
        >
          {getFieldLabel(item.unit) || "O'lchov birligini tanlang"}
        </Button>
      ),
    },
    {
      title: "Soni",
      key: "quantity",
      width: 100,
      align: "center",
      render: (_value, item, index) => (
        <InputNumber
          value={item.quantity}
          onChange={(value) => {
            if (typeof value === "number") {
              handleInputOnchange(index, "quantity", value);
            }
          }}
          className="text-sm text-center max-w-12 font-semibold border-0 focus:ring-1 focus:ring-blue-500"
          min={0}
          onFocus={handleQuantityFocus}
        />
      ),
    },
    {
      title: "Izoh",
      key: "note",
      width: 200,
      render: (_value, item, index) => (
        <Input
          type="text"
          value={item.note}
          onChange={(e) => handleInputOnchange(index, "note", e.target.value)}
          className="text-sm italic border-0 focus:ring-1 focus:ring-blue-500"
          placeholder="Izoh"
        />
      ),
    },
    ...(department_category === "completasiya"
      ? [
          {
            title: "Biriktirilgan xodim",
            key: "attached_employee",
            width: 150,
            fixed: "right" as const,
            render: (_value: any, item: Product) => (
              <Button
                onClick={() => {
                  setShowSelectEmployeeModal(item.id);
                }}
                className="text-sm text-gray-600"
              >
                {item.attached_employee?.full_name || "Xodim tanlang"}
              </Button>
            ),
          },
        ]
      : []),
    ...(orderData?.movement_type === "executing"
      ? [
          // {
          //   title: "Yillik reja",
          //   key: "yearPlan",
          //   width: 150,
          //   align: "center" as const,
          //   render: (_value: any, item: Product, index: number) => (
          //     <button
          //       onClick={(e) => {
          //         e.stopPropagation();
          //         setShowYearPlanModal(true);
          //         setSelectedRowIndex(index);
          //       }}
          //       className={`inline-block px-2 py-1 cursor-pointer rounded-md ${
          //         item.yearPlan
          //           ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
          //           : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
          //       } transition-colors`}
          //     >
          //       {item.yearPlan ? (
          //         <Badge>{item.yearPlan.name}</Badge>
          //       ) : (
          //         <Badge>Tanlash</Badge>
          //       )}
          //     </button>
          //   ),
          // },
        ]
      : []),
    {
      title: "Amallar",
      key: "actions",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_value, _item, index) => (
        <button
          onClick={() => {
            const updatedGoods = orderData?.products.filter(
              (_product, i) => i !== index,
            );
            // @ts-ignore
            setOrderData((prev) => ({
              ...prev,
              products: updatedGoods || [],
            }));
          }}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="size-4" />
        </button>
      ),
    },
  ];

  // cancel order document
  const handleCancelOrder = async () => {
    try {
      const payload = {
        description: cancelDesc,
        products: cancelProducts.filter((p) => p.is_cancel),
      };

      const response = await axiosAPI.post(
        `document/orders/${orderData?.id}/cancel/`,
        payload,
      );

      if (response.status === 200) {
        toast.success("Buyurtma muvaffaqiyatli bekor qilindi");
        fetchOrderData(); // Refresh order data
      }
    } catch (error) {
      console.log(error);
      toast.error("Buyurtmani bekor qilishda xatolik yuz berdi");
    }
  };

  // Initialize cancel products when modal opens
  const initializeCancelProducts = () => {
    if (orderData?.products) {
      const initialProducts = orderData.products.map((p) => ({
        id: p.id,
        is_cancel: false,
        cancel_quantity: p.quantity,
      }));
      setCancelProducts(initialProducts);
    }
  };

  // Toggle product cancellation
  const toggleCancelProduct = (productId: number) => {
    setCancelProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, is_cancel: !p.is_cancel } : p,
      ),
    );
  };

  // Update cancel quantity
  const updateCancelQuantity = (productId: number, quantity: number) => {
    setCancelProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, cancel_quantity: quantity } : p,
      ),
    );
  };

  // Select all products for cancellation
  const selectAllProducts = () => {
    setCancelProducts((prev) => prev.map((p) => ({ ...p, is_cancel: true })));
  };

  // Deselect all products
  const deselectAllProducts = () => {
    setCancelProducts((prev) => prev.map((p) => ({ ...p, is_cancel: false })));
  };

  return (
    <>
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
            {/* <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowExecutiveActionModal(true)}
              className="gap-2 border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 h-12 px-6"
            >
              <GitBranch className="w-4 h-4" />
              <span className="font-medium text-base">Ijro qadamlari</span>
            </Button> */}
            {/* Imzolash tugmasi - approval bo'limida yashirilgan */}
            {/* {orderData?.movement_type === "in_signing" && ( */}
            <Button
              variant="filled"
              className="border! border-blue-500!"
              type="primary"
              size="medium"
              color="blue"
              onClick={() => {
                setShowSigningModal(true);
                console.log(orderData);
              }}
            >
              <Pencil className="w-4 h-4 mix-blend-multiply" />
              <span className="font-medium text-base">Imzolash</span>
            </Button>
            {/* )} */}

            {orderData?.movement_type === "in_signing" && (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => setShowAgreementModal(true)}
                className={`gap-2 border-2 h-12 px-6 ${agreementStatus === "roziman" ? "border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-700" : agreementStatus === "rozi-emasman" ? "border-red-500 text-red-700 bg-red-50 hover:bg-red-100" : agreementStatus === "qisman" ? "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100" : "border-purple-300 text-purple-600 hover:border-purple-500 hover:bg-purple-50"}`}
              >
                <HandshakeIcon className="w-4 h-4 text-green-600" />
                <span className="font-medium text-base text-green-700">
                  Kelishish
                </span>
              </Button>
            )}
            <div className="ml-auto flex items-center gap-4">
              <Button
                type="primary"
                onClick={() => setShowSendModal(true)}
                // disabled={orderData?.is_send}
              >
                <Send className="w-4 h-4" />
                <span className="text-base">
                  {/* {orderData?.is_send ? "Yuborilgan" : "Yuborish"} */}
                  Yuborish
                </span>
              </Button>
              <Button
                variant="solid"
                type="primary"
                color="green"
                onClick={handleOrderUpdate}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="text-base">Saqlash</span>
              </Button>
              <Button
                variant="filled"
                className="border! border-red-500!"
                type="primary"
                size="medium"
                color="red"
                onClick={() => {
                  setShowCancelConfirm(true);
                  initializeCancelProducts();
                }}
                disabled={orderData?.is_accepted}
              >
                <X className="size-4" />
                <span className="text-base">Bekor qilish</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Warnig section: Checking warehouse */}
        <div>
          <h2 className="text-lg italic text-red-400">
            Tovarlar sotuvga chiqarishdan avval uni omborlar qoldiqlaridan
            tekshirish talab etiladi
          </h2>
        </div>

        {/* Buyurtma uchun kelgan tovarlar ro'yxati - Collapse Card */}
        <div className="shadow-md rounded-md border border-gray-200 overflow-hidden flex flex-col">
          <button
            onClick={() => setShowGoodsTable(!showGoodsTable)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart
                className="w-8 h-8 text-gray-700"
                strokeWidth={1.5}
              />
              <div className="text-left">
                <h3 className="text-base font-semibold text-gray-900">
                  Buyurtma uchun kelgan tovarlar ro'yxati
                </h3>
                <p className="text-sm text-gray-500">
                  Jami: {orderData?.products.length} ta tovar
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
            <div className="border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 overflow-x-auto">
                <Table
                  columns={goodsColumns}
                  dataSource={orderData?.products || []}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: "max-content", y: 520 }}
                  className="w-full"
                />
              </div>

              {/* Yangi qator qo'shish tugmasi */}
              <div className="m-4 flex items-center gap-6 justify-between">
                <Button
                  variant="outlined"
                  className="gap-2"
                  onClick={() => {
                    // Yangi bo'sh qator qo'shish
                    const newRow = {
                      name: "",
                      model: "",
                      product_type: { id: 0, name: "" },
                      product_model: { id: 0, name: "" },
                      size: { id: 0, name: "" },
                      unit: { id: 0, name: "" },
                      quantity: 0,
                      note: "",
                    };
                    // @ts-ignore
                    setOrderData((prev) => ({
                      ...prev,
                      products: [...(prev?.products || []), newRow],
                    }));

                    console.log(orderData);
                  }}
                >
                  <Plus className="size-4" />
                  Tovar qo'shish
                </Button>

                <Button
                  variant="filled"
                  className="border! border-blue-500!"
                  type="primary"
                  color="blue"
                  onClick={() => setShowCheckedWarehouseModal(true)}
                >
                  Qoldiqlarni tekshirish
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hujjat ma'lumotlari */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Title */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {orderData?.direction === "IN" ? "KIRIM" : "CHIQIM"} -{" "}
              <span className="text-blue-600">
                {orderData?.incoming_number || orderData?.old_number}
              </span>{" "}
              - {orderData?.created_at && formatDate(orderData.created_at)}
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
                    {orderData?.incoming_number || orderData?.old_number}
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
                    {orderData?.created_at &&
                      orderData.created_at
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-") +
                        " " +
                        orderData.created_at.split("T")[1].slice(0, 5)}
                  </span>
                </div>
              </div>

              {/* Hujjat turi */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <label className="text-sm text-gray-500 w-48">
                  Hujjat turi
                </label>
                <div className="flex-1">
                  <span className="text-base text-gray-900">
                    {orderData?.order_type === "external"
                      ? "Chiquvchi hujjat"
                      : "Ichki hujjat"}
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
                <label className="text-sm text-gray-500 w-48">
                  Jo'natuvchi
                </label>
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
              <div className="flex items-start justify-between py-2">
                <label className="text-sm text-gray-500 w-48">
                  Qabul qiluvchilar
                </label>
                <div className="flex-1">
                  {orderData?.participants.length ? (
                    <div>
                      {orderData.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {participant.employee_name}
                          </p>
                          <p className="text-sm text-emerald-500">
                            {getParticipantPurpose(participant)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                      Qabul qiluvchi yo'q
                    </div>
                  )}
                </div>
              </div>

              {/* Kelishish uchun spravichnik */}
            </div>
          </div>
        </div>

        {/* Asosiy hujjat */}
        <MainDocument orderData={orderData} />

        {/* Ilovalar bo'limi */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between gap-6 mb-2">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Biriktirilgan hujjatlar
            </h3>

            {/* Qo'shish tugmalari */}
            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                className="gap-2"
                onClick={handleFileUpload}
              >
                <Plus className="size-4" />
                Fayl qo'shish
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

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
                        <p
                          className={`flex items-center gap-2 text-sm font-medium text-blue-600 truncate`}
                        >
                          {file.file_name}
                          {file.file_name.includes("signed") && (
                            <Badge className="flex! items-center! gap-1 px-2! py-1! rounded-md! ml-2 bg-green-100 text-green-700 border-green-300">
                              <Check className="size-3" />
                              Imzolangan
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(file.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          async function fetchAndOpenFile() {
                            try {
                              const response = await axiosAPI.get(
                                `document/orders/attachment/${file.id}/`,
                              );
                              if (response.status === 200)
                                return response.data.file_url;
                            } catch (error) {
                              console.log(error);
                              toast.error(
                                "Faylni yuklab olishda xatolik yuz berdi",
                              );
                            }
                          }

                          fetchAndOpenFile().then((url) => {
                            if (url) {
                              fetch(url)
                                .then((res) => {
                                  if (!res.ok)
                                    throw new Error(
                                      `HTTP error! status: ${res.status}`,
                                    );
                                  return res.blob();
                                })
                                .then((blob) => {
                                  const fileObj: File = new File(
                                    [blob],
                                    file.file_name,
                                    { type: blob.type },
                                  );
                                  setSelectedFile(fileObj);
                                })
                                .catch((error) => {
                                  console.log(error);
                                  toast.error(
                                    "Faylni ochib bo'lmadi. Iltimos, qayta urinib ko'ring.",
                                  );
                                });
                            } else
                              toast.error(
                                "Faylni ochib bo'lmadi. Iltimos, qayta urinib ko'ring.",
                              );
                          });
                        }}
                      >
                        <Eye className="size-5" />
                      </button>

                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          async function deleteAttachmentFile() {
                            try {
                              const response = await axiosAPI.delete(
                                `document/orders/attachment/${file.id}/`,
                              );
                              if (response.status === 204) {
                                toast.success("Fayl muvaffaqiyatli o'chirildi");
                                fetchOrderData(); // Refresh order data to update attachment files
                              } else {
                                toast.error(
                                  "Faylni o'chirishda xatolik yuz berdi",
                                );
                              }
                            } catch (error) {
                              console.log(error);
                              toast.error(
                                "Faylni o'chirishda xatolik yuz berdi",
                              );
                            }
                          }

                          deleteAttachmentFile();
                        }}
                      >
                        <Trash2 className="size-5" />
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

        <PostedProductModal
          isOpen={showPostedProductModal}
          onClose={() => setShowPostedProductModal(false)}
          productName={selectedProduct?.name || ""}
          productModel={selectedProduct?.model}
          orderProductId={selectedProduct?.id ?? 0}
          existingPost={selectedProduct?.posted_website} // <-- muhim qism
          onSuccess={() => {
            onSuccess?.("Mahsulot muvaffaqiyatli saytga joylandi!");
          }}
        />

        <PostedProductModal
          isOpen={showPostedProductModal}
          onClose={() => setShowPostedProductModal(false)}
          productName={selectedProduct?.name || ""}
          productModel={selectedProduct?.model}
          orderProductId={selectedProduct?.id ?? 0}
          existingPost={selectedProduct?.posted_website}
          onSuccess={() => {
            onSuccess?.("Mahsulot muvaffaqiyatli saytga joylandi!");
          }}
        />

        {productFieldModalOpen.type && (
          <ProductFieldModal
            productFieldModal={productFieldModalOpen}
            onCancel={() => setProductFieldModalOpen({ type: null, index: -1 })}
            onSelect={(value: IDName) => {
              if (
                productFieldModalOpen.type &&
                productFieldModalOpen.index !== -1
              ) {
                const fieldMap = {
                  "product/type": "product_type",
                  "product/model": "product_model",
                  "measurement/size": "size",
                  "measurement/unit": "unit",
                } as const;
                const field = fieldMap[productFieldModalOpen.type];
                handleInputOnchange(productFieldModalOpen.index, field, value);
                setProductFieldModalOpen({ type: null, index: -1 });
              }
            }}
            products={orderData?.products || []}
          />
        )}

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
              handleInputOnchange(selectedRowIndex, "yearPlan", item);
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
            setShowAddGoodsModal(false);
          }}
        />

        {/* Kelishish Modal */}
        {showAgreementModal && (
          <AgreementModal
            orderId={orderData?.id!}
            onSuccess={() => setShowAgreementModal(false)}
            setShowAgreementModal={setShowAgreementModal}
          />
        )}

        {/* Search Filter Panel */}
        <SearchFilterPanel
          isOpen={showSearchFilter}
          onClose={() => setShowSearchFilter(false)}
        />

        {/* Imzolash Modal */}
        <SigningModal
          isOpen={showSigningModal && !!orderData}
          onClose={() => setShowSigningModal(false)}
          documentId={orderData?.id.toString() || ""}
          onCancel={() => {
            setShowSigningModal(false);
          }}
        />

        {/* Send Document Modal */}
        {showSendModal && (
          <SendModal
            orderDataID={orderData?.id!}
            setIsSendModalOpen={setShowSendModal}
          />
        )}

        {showCheckedWarehouseModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Warehouse size={24} color="#3b82f6" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Ombor qoldiqlarini tekshirish
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Buyurtmadagi tovarlar mavjudligi
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowCheckedWarehouseModal(false)}
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Body - Products List */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <ShoppingCart size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">
                          Jami tovarlar
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {orderData?.products.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-500 rounded-lg">
                        <X size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-red-600 font-medium">
                          Mavjud emas
                        </p>
                        <p className="text-2xl font-bold text-red-700">
                          {orderData?.products.filter((p) => p.quantity > 0)
                            .length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Warehouse size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-medium">
                          Mavjud
                        </p>
                        <p className="text-2xl font-bold text-green-700">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800">
                        Diqqat!
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Omborlarda buyurtmada ko'rsatilgan tovarlardan qoldiqlar
                        yetarli emas yoki mavjud emas. Iltimos, quyidagi
                        ro'yxatni ko'rib chiqing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          №
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Tovar nomi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Kerak
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Mavjud
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderData?.products.map((product, index) => {
                        // Simulate warehouse stock (in real app, this would come from API)
                        const availableStock = 0; // Mock data
                        const isAvailable = availableStock >= product.quantity;

                        return (
                          <tr
                            key={product.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              !isAvailable ? "bg-red-50/30" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name || "-"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getFieldLabel(product.size) || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {getModelLabel(product) || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                {product.quantity} {getFieldLabel(product.unit)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                                  isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {availableStock} {getFieldLabel(product.unit)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isAvailable ? (
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  <span className="flex items-center gap-1">
                                    <span className="size-1.5 bg-green-500 rounded-full"></span>
                                    Mavjud
                                  </span>
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-700 border-red-300">
                                  <span className="flex items-center gap-1">
                                    <span className="size-1.5 bg-red-500 rounded-full"></span>
                                    Mavjud emas
                                  </span>
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    📋 Tavsiyalar:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Boshqa omborlardan mavjud tovarlarni tekshiring
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Yetkazib beruvchilar bilan bog'laning va yangi buyurtma
                        bering
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Buyurtmadagi tovarlar sonini mavjud qoldiqlarga qarab
                        o'zgartiring
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outlined"
                  size="middle"
                  onClick={() => setShowCheckedWarehouseModal(false)}
                  className="gap-2"
                >
                  <ArrowLeft className="size-4" />
                  Yopish
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    size="middle"
                    color="blue"
                    className="gap-2"
                  >
                    <Download className="size-4" />
                    Hisobotni yuklash
                  </Button>
                  <Button
                    variant="filled"
                    type="primary"
                    size="middle"
                    onClick={() => {
                      toast.info("Boshqa omborlarni tekshirilmoqda...");
                      // Add logic to check other warehouses
                    }}
                    className="gap-2"
                  >
                    <Warehouse className="size-4" />
                    Boshqa omborlarni tekshirish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <X size={24} color="#ef4444" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Buyurtmani bekor qilish
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Bekor qilish sababini kiriting
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelDesc("");
                    setCancelProducts([]);
                  }}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bekor qilish sababi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={cancelDesc}
                    onChange={(e) => setCancelDesc(e.target.value)}
                    placeholder="Buyurtmani bekor qilish sababini batafsil yozing..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                    rows={4}
                  />
                  {cancelDesc.trim().length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Sabab ko'rsatish majburiy
                    </p>
                  )}
                </div>

                {/* Products Selection Table */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Bekor qilinadigan tovarlar (ixtiyoriy)
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={selectAllProducts}
                      >
                        Barchasini tanlash
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={deselectAllProducts}
                      >
                        Tozalash
                      </Button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                            <input
                              type="checkbox"
                              checked={cancelProducts.every((p) => p.is_cancel)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  selectAllProducts();
                                } else {
                                  deselectAllProducts();
                                }
                              }}
                              className="size-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            №
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tovar nomi
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Model
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Jami soni
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Bekor qilinadigan soni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderData?.products.map((product, index) => {
                          const cancelProduct = cancelProducts.find(
                            (p) => p.id === product.id,
                          );
                          return (
                            <tr
                              key={product.id}
                              className={`hover:bg-gray-50 transition-colors {
                              cancelProduct?.is_cancel ? "bg-red-50/30" : ""
                            }`}
                            >
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={cancelProduct?.is_cancel || false}
                                  onChange={() =>
                                    toggleCancelProduct(product.id)
                                  }
                                  className="size-4 rounded border-gray-300"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name || "-"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getFieldLabel(product.size) || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {getModelLabel(product) || "-"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-sm font-semibold text-gray-900">
                                  {product.quantity}{" "}
                                  {getFieldLabel(product.unit)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Input
                                  type="number"
                                  min={1}
                                  max={product.quantity}
                                  value={
                                    cancelProduct?.cancel_quantity ||
                                    product.quantity
                                  }
                                  onChange={(e) => {
                                    const value = Math.min(
                                      Math.max(
                                        1,
                                        parseInt(e.target.value) || 1,
                                      ),
                                      product.quantity,
                                    );
                                    updateCancelQuantity(product.id, value);
                                  }}
                                  disabled={!cancelProduct?.is_cancel}
                                  className="w-24 text-center"
                                  suffix={getFieldLabel(product.unit)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {cancelProducts.filter((p) => p.is_cancel).length > 0
                      ? `${cancelProducts.filter((p) => p.is_cancel).length} ta tovar tanlandi`
                      : "Agar hech qanday tovar tanlamasangiz, butun buyurtma bekor qilinadi"}
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-800">
                        Diqqat!
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        Buyurtmani bekor qilganingizdan so'ng, uni qayta tiklash
                        mumkin emas. Ushbu amal qaytarib bo'lmaydi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outlined"
                  size="middle"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelDesc("");
                    setCancelProducts([]);
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="size-4" />
                  Bekor qilish
                </Button>
                <Button
                  variant="filled"
                  type="primary"
                  size="middle"
                  danger
                  disabled={cancelDesc.trim().length === 0}
                  onClick={() => {
                    if (cancelDesc.trim().length > 0) {
                      handleCancelOrder();
                      setShowCancelConfirm(false);
                      setCancelDesc("");
                      setCancelProducts([]);
                    }
                  }}
                  className="gap-2 bg-red-500 hover:bg-red-600 border-red-500"
                >
                  <X className="size-4" />
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}

        <Modal
          open={!!selectedFile}
          onCancel={() => setSelectedFile(null)}
          footer={null}
          width={1400}
          centered
          bodyStyle={{ padding: 0, height: "75vh", width: "100%" }}
        >
          <FilePreviewer file={selectedFile!} />
        </Modal>
      </div>

      {showSelectEmployeeModal > 0 && (
        <EmployeeSelectModal
          onClose={() => setShowSelectEmployeeModal(0)}
          onSelect={(employee: any) => {
            setOrderData((prev) => {
              if (!prev) return null;

              const updatedProducts = prev.products.map((product) => {
                if (product.id === showSelectEmployeeModal) {
                  return {
                    ...product,
                    attached_employee: {
                      ...product.attached_employee,
                      id: employee[0].id,
                      name: employee[0].full_name,
                    },
                  };
                }
                return product;
              });

              return {
                ...prev,
                products: updatedProducts,
              };
            });
            setShowSelectEmployeeModal(0);
            handleOrderUpdate();
            toast.success("Xodim muvaffaqiyatli tanlandi");
          }}
          selectedEmployeeIds={
            orderData?.products
              .filter((p) => p.attached_employee)
              .map((p) => p.attached_employee!.id) || []
          }
          selectionType="single"
        />
      )}
    </>
  );
};

export default LetterDetail;
