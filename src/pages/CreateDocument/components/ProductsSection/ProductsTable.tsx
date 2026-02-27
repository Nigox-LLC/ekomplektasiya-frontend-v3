import React from "react";
import { Badge, Button, Input, InputNumber } from "antd";
import { ChevronDown, CircleCheck, Trash2 } from "lucide-react";
import type { CreateDocumentType, Product } from "../../External";
import { axiosAPI } from "@/service/axiosAPI";
import ProductFieldModal from "./ProductFieldModal";

interface ProductsTableProps {
  products: Product[];
  handleTypeDropdownToggle: (itemId: number) => void;
  showTypeDropdown: number | null;
  typeDropdownRef: React.RefObject<{
    [key: number]: HTMLDivElement | null;
  }>;
  handleUpdateRow: (
    id: number,
    field: keyof CreateDocumentType["products"][number],
    value: string | number | IDName,
  ) => void;
  setShowTypeDropdown: React.Dispatch<React.SetStateAction<number | null>>;
  handleQuantityFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleDeleteRow: (id: number) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  handleTypeDropdownToggle,
  showTypeDropdown,
  typeDropdownRef,
  handleUpdateRow,
  setShowTypeDropdown,
  handleQuantityFocus,
  handleDeleteRow,
}) => {
  const [productFieldModalOpen, setProductFieldModalOpen] = React.useState<{
    type:
      | "product/type"
      | "measurement/size"
      | "measurement/unit"
      | "product/model"
      | null;
    index: number;
  }>({ type: null, index: -1 });

  return (
    <>
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
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tovar nomi *
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tovar turi *
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
                Soni *
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
            {products.length > 0 &&
              products.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">
                    {index + 1}
                  </td>

                  {/* Buyurtma turi */}
                  <td className="border border-gray-300 px-4 py-3 relative">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => handleTypeDropdownToggle(index)}
                        className="inline-flex items-center gap-2"
                      >
                        <Badge
                          className={`cursor-pointer transition-colors w-full px-2! py-1! rounded-md! ${
                            item.order_product_type === "product"
                              ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                              : "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
                          }`}
                        >
                          {item.order_product_type === "product"
                            ? "Tovar"
                            : "Xizmat"}
                        </Badge>
                        <ChevronDown className="size-3 text-gray-500" />
                      </button>

                      {showTypeDropdown === index && (
                        <div
                          ref={(el) => {
                            typeDropdownRef.current[index] = el;
                          }}
                          className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateRow(
                                index,
                                "order_product_type",
                                "product",
                              );
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
                              handleUpdateRow(
                                index,
                                "order_product_type",
                                "service",
                              );
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
                      value={item.product_name}
                      onChange={(e) =>
                        handleUpdateRow(index, "product_name", e.target.value)
                      }
                      className="text-sm font-medium border-0 max-w-40 focus:ring-1 focus:ring-blue-500"
                      placeholder="Nomi"
                    />
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setProductFieldModalOpen({
                          type: "product/type",
                          index,
                        });
                      }}
                    >
                      {item.product_type?.id
                        ? item.product_type?.name
                        : "Turi tanlang"}
                    </Button>
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setProductFieldModalOpen({
                          type: "product/model",
                          index,
                        });
                        console.log(products);
                      }}
                      disabled={!item.product_type?.id}
                    >
                      {item.product_model?.id
                        ? item.product_model?.name
                        : "Tanlang"}
                    </Button>
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setProductFieldModalOpen({
                          type: "measurement/size",
                          index,
                        });
                      }}
                      disabled={!item.product_model?.id}
                    >
                      {item.size?.id ? item.size?.name : "O'lcham tanlang"}
                    </Button>
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setProductFieldModalOpen({
                          type: "measurement/unit",
                          index,
                        });
                      }}
                    >
                      {item.unit?.id
                        ? item.unit?.name
                        : "O'lchov birligini tanlang"}
                    </Button>
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <InputNumber
                      value={item.quantity}
                      onChange={(value) => {
                        if (value) {
                          handleUpdateRow(index, "quantity", value || 0);
                        }
                      }}
                      className="text-sm text-center max-w-12 font-semibold border-0 focus:ring-1 focus:ring-blue-500"
                      min={0}
                      onFocus={handleQuantityFocus}
                    />
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="text"
                      value={item.comment}
                      onChange={(e) =>
                        handleUpdateRow(index, "comment", e.target.value)
                      }
                      className="text-sm italic border-0 focus:ring-1 focus:ring-blue-500"
                      placeholder="Izoh"
                    />
                  </td>

                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(index)}
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
              handleUpdateRow(productFieldModalOpen.index, field, value);
              setProductFieldModalOpen({ type: null, index: -1 });
            }
          }}
          products={products}
        />
      )}
    </>
  );
};

export default ProductsTable;
