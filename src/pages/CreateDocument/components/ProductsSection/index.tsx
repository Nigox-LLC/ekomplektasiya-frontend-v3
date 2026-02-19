import { Button, Card } from "antd";
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Plus,
  ShoppingCart,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import ProductsTable from "./ProductsTable";
import type { CreateDocumentType } from "../../CreateDocument";
import type CreateDocument from "../../CreateDocument";
import { axiosAPI } from "@/service/axiosAPI";

interface IProps {
  orderDataID: number | null;
  setOrderData: React.Dispatch<React.SetStateAction<CreateDocumentType>>;
  orderData: CreateDocumentType;
}

const ProductsSection: React.FC<IProps> = ({
  orderDataID,
  setOrderData,
  orderData,
}) => {
  const [productsAccordionOpen, setProductsAccordionOpen] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState<number | null>(null);

  // Refs
  const typeDropdownRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleTypeDropdownToggle = (itemId: number) => {
    const newState = showTypeDropdown === itemId ? null : itemId;
    setShowTypeDropdown(newState);

    // Scroll to dropdown if opening
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

  const handleUpdateRow = (
    index: number,
    field: keyof CreateDocumentType["products"][number],
    value: IDName | string | number,
  ) => {
    setOrderData((prev) => {
      return {
        ...prev,
        products: prev.products?.map((item, idx) =>
          idx === index ? { ...item, [field]: value } : item,
        ),
      };
    });
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  };

  const handleDeleteRow = (index: number) => {
    if (orderData?.products.length === 1) {
      toast.error("Kamida bitta qator bo'lishi kerak!");
      return;
    }
    setOrderData((prev) => {
      return {
        ...prev,
        products: prev.products?.filter((_, idx) => idx !== index),
      };
    });
  };

  const handleAddRow = () => {
    const newRow: CreateDocumentType["products"][number] = {
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
    };
    setOrderData((prev) => {
      return {
        ...prev,
        products: [...(prev.products || []), newRow],
      };
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <button
          onClick={() => setProductsAccordionOpen((prev) => !prev)}
          className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors py-4"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="size-8 text-gray-700" strokeWidth={1.5} />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Buyurtma uchun tovarlar ro'yxati
              </h3>
              <p className="text-sm text-gray-500">
                Jami: {orderData?.products.length || 0} ta tovar
              </p>
            </div>
          </div>
          {productsAccordionOpen ? (
            <ChevronUp className="size-5 text-gray-500" />
          ) : (
            <ChevronDown className="size-5 text-gray-500" />
          )}
        </button>
        {/* Products Section - Accordion */}
        {productsAccordionOpen && (
          <>
            <div className="border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
              <ProductsTable
                products={orderData?.products}
                handleTypeDropdownToggle={handleTypeDropdownToggle}
                showTypeDropdown={showTypeDropdown}
                typeDropdownRef={typeDropdownRef}
                handleUpdateRow={handleUpdateRow}
                setShowTypeDropdown={setShowTypeDropdown}
                handleQuantityFocus={handleQuantityFocus}
                handleDeleteRow={handleDeleteRow}
              />

              {/* Yangi qator qo'shish */}
              <div className="mt-4 flex items-center justify-between">
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
            {orderData.products.length === 0 && (
              <>
                {/* Yangi qator qo'shish */}
                <div className="mt-4 flex justify-center">
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
              </>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default ProductsSection;
