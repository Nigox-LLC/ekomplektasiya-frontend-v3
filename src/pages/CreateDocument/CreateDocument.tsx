import { Button } from "antd";
import { ArrowLeft, CircleCheck, FileText, Send } from "lucide-react";
import React, { useEffect } from "react";
import ProductsSection from "./components/ProductsSection";
import { useNavigate, useParams } from "react-router";
import InternalDocumentForm from "./components/InternalDocumentForm";
import { axiosAPI } from "@/service/axiosAPI";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import MainDocument from "./components/MainDocument/MainDocument";
import SendModal from "./components/SendModal";

export type Product = {
  order_product_type: "product" | "service";
  product_name: string;
  quantity: number;
  product_type: IDName;
  product_model: IDName;
  size: IDName;
  unit: IDName;
  comment: string;
};

export interface CreateDocumentType {
  document_type_id: number;
  internal_document_type_id: number;
  registration_journal_id: number;
  content: string;
  is_mistake: boolean;
  products: Product[];
}

const CreateDocument: React.FC = () => {
  // States
  const [orderData, setOrderData] = React.useState<CreateDocumentType>({
    document_type_id: 0,
    internal_document_type_id: 0,
    registration_journal_id: 0,
    content: "",
    is_mistake: false,
    products: [
      {
        order_product_type: "product",
        product_name: "",
        quantity: 1,
        product_type: {
          id: 0,
          name: "",
        },
        product_model: {
          id: 0,
          name: "",
        },
        size: {
          id: 0,
          name: "",
        },
        unit: {
          id: 0,
          name: "",
        },
        comment: "",
      },
    ],
  });
  const [orderDataID, setOrderDataID] = React.useState<number | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleOpenSendModal = () => {
    if (
      orderData.products.some(
        (item) =>
          !item.product_name ||
          !item.quantity ||
          !item.product_type.id ||
          !item.product_model.id ||
          !item.size.id ||
          !item.unit.id,
      )
    ) {
      toast.error("Barcha tovarlar uchun nom va sonini kiriting!");
      return;
    } else {
      setIsSendModalOpen(true);
    }
  };

  // useParams
  const { type } = useParams<{ type: "internal" | "outgoing" }>();

  useEffect(() => {
    const createOrderDocument = async () => {
      try {
        const response = await axiosAPI.post("document/orders/", {
          order_type: type,
        });
        if (response.status === 201) setOrderDataID(response.data.id);
      } catch (error) {
        console.log(error);
      }
    };
    createOrderDocument();
  }, []);

  const handleUpdateOrderData = async () => {
    try {
      const response = await axiosAPI.patch(`document/orders/${orderDataID}/`, {
        ...orderData,
        document_type_id: Number(orderData.document_type_id) || null,
        internal_document_type_id:
          Number(orderData.internal_document_type_id) || null,
        registration_journal_id:
          Number(orderData.registration_journal_id) || null,
        is_mistake: false,
        products: orderData.products.map((item) => ({
          ...item,
          product_type: item.product_type.id ? item.product_type : null,
          product_model: item.product_model.id ? item.product_model : null,
          size: item.size.id ? item.size : null,
          unit: item.unit.id ? item.unit : null,
        })),
      });
      if (response.status === 200) {
        toast.success("Buyurtma ma'lumotlari muvaffaqiyatli yangilandi!");
        navigate("/my_letter");
        console.log("Order data updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="space-3 pb-16!">
        {/* Header with Send Button */}
        <div className="sticky top-0 z-30 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="size-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                title="Orqaga"
              >
                <ArrowLeft className="size-6 text-white" />
              </button>
              <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {type === "internal"
                    ? "Ichki hujjat yaratish"
                    : "Yangi hujjat yaratish"}
                </h1>
                <p className="text-sm text-blue-100">
                  {type === "internal"
                    ? "Ichki hujjat shakllantirish"
                    : "Buyurtma uchun tovarlar ro'yxati"}
                </p>
              </div>
            </div>
            {type === "outgoing" && (
              <Button
                onClick={handleOpenSendModal}
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <Send className="size-5" />
                Hujjatni yuborish
              </Button>
            )}
            {isSendModalOpen && (
              <SendModal
                setIsSendModalOpen={setIsSendModalOpen}
                orderDataID={orderDataID}
              />
            )}
          </div>
        </div>

        {/* Conditional Rendering based on type */}
        {type === "internal" ? (
          // Internal document form
          <InternalDocumentForm />
        ) : (
          // External document sections
          <>
            {/* Table of products - ACCORDION */}
            <ProductsSection
              orderDataID={orderDataID}
              setOrderData={setOrderData}
              orderData={orderData}
            />

            {/* Comment of order */}
            <div className="my-2">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Qisqacha izoh*
              </label>
              <TextArea
                id="comment"
                value={orderData.content}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 resize-none!"
                placeholder="Qisqacha izoh kiriting..."
                rows={4}
              />
            </div>

            {/* Main document section */}
            <MainDocument orderDataID={orderDataID} />
          </>
        )}

        {/* Footer - save button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-end border-t-2 border-slate-200 p-6">
          <Button
            type="primary"
            className="gap-2"
            onClick={() => {
              if (orderData.content.trim() === "") {
                toast.error("Qisqacha izoh bo'sh bo'lishi mumkin emas!");
                return;
              } else if (orderData.products.length === 0) {
                toast.error("Mahsulotlar ro'yxati bo'sh bo'lishi mumkin emas!");
                return;
              } else if (
                orderData.products.some(
                  (item) =>
                    !item.product_name ||
                    !item.quantity ||
                    !item.product_type.id ||
                    !item.product_model.id ||
                    !item.size.id ||
                    !item.unit.id,
                )
              ) {
                toast.error(
                  "Mahsulotlar ro'yxatidagi barcha maydonlar to'ldirilishi kerak!",
                );
                return;
              } else {
                handleUpdateOrderData();
              }
            }}
          >
            <CircleCheck className="size-5" />
            Saqlash
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateDocument;
