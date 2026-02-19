import { Badge, Button, Card, Input } from "antd";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify/unstyled";

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

const ProductsSection: React.FC = () => {
  const [showProductsTable, setShowProductsTable] = React.useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = React.useState<number | null>(
    null,
  );
  const [products, setProducts] = React.useState<GoodItem[]>([]);
  const typeDropdownRef = React.useRef<{
    [key: number]: HTMLDivElement | null;
  }>({});

  // Mock tovarlar ro'yxati
  const mockProducts = [
    {
      id: 1,
      name: "Kompyuter",
      model: "Dell Optiplex 7090",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 2,
      name: "Monitor",
      model: 'Samsung 24"',
      size: "24 dyum",
      unit: "dona",
    },
    {
      id: 3,
      name: "Printer",
      model: "HP LaserJet Pro",
      size: "A4",
      unit: "dona",
    },
    { id: 4, name: "Qog'oz", model: "A4 80g/m²", size: "A4", unit: "quti" },
    {
      id: 5,
      name: "Ruchka",
      model: "Ballpoint",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 6,
      name: "Marker",
      model: "Permanent",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 7,
      name: "Stol",
      model: "Ofis stoli",
      size: "120x60 sm",
      unit: "dona",
    },
    {
      id: 8,
      name: "Stul",
      model: "Ofis stuli",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 9,
      name: "Klaviatura",
      model: "Logitech K120",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 10,
      name: "Sichqoncha",
      model: "Logitech M90",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 11,
      name: "Telefon",
      model: "Panasonic KX",
      size: "Standart",
      unit: "dona",
    },
    {
      id: 12,
      name: "Skaner",
      model: "Canon LiDE 300",
      size: "A4",
      unit: "dona",
    },
  ];

  useEffect(() => {
    mockProducts.forEach((product) => {
      setTimeout(() => {
        setProducts((prev) => [...prev, {
          id: product.id,
        }]);
      }, 100);
    });
  }, []);

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
    id: number,
    field: keyof GoodItem,
    value: string | number,
  ) => {
    setProducts(
      products.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  };

  const handleDeleteRow = (id: number) => {
    if (products.length === 1) {
      toast.error("Kamida bitta qator bo'lishi kerak!");
      return;
    }
    setProducts(products.filter((item) => item.id !== id));
  };

  const handleAddRow = () => {
    const newRow: GoodItem = {
      id: Date.now(),
      type: "Tovar",
      name: "",
      model: "",
      size: "",
      unit: "",
      quantity: 0,
      note: "",
    };
    setProducts([...products, newRow]);
  };

  return (
    <>
      {showProductsTable && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowProductsTable(!showProductsTable)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart
                className="size-8 text-gray-700"
                strokeWidth={1.5}
              />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Buyurtma uchun tovarlar ro'yxati
                </h3>
                <p className="text-sm text-gray-500">
                  Jami: {products.length} ta tovar
                </p>
              </div>
            </div>
            {showProductsTable ? (
              <ChevronUp className="size-5 text-gray-500" />
            ) : (
              <ChevronDown className="size-5 text-gray-500" />
            )}
          </button>

          {showProductsTable && (
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
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tovar nomi *
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
                    {products.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">
                          {index + 1}
                        </td>

                        {/* Buyurtma turi */}
                        <td className="border border-gray-300 px-4 py-3 relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => handleTypeDropdownToggle(item.id)}
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

                            {showTypeDropdown === item.id && (
                              <div
                                ref={(el) => {
                                  typeDropdownRef.current[item.id] = el;
                                }}
                                className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateRow(item.id, "type", "Tovar");
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
                                    handleUpdateRow(item.id, "type", "Xizmat");
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
                            onChange={(e) =>
                              handleUpdateRow(item.id, "name", e.target.value)
                            }
                            className="text-sm font-medium border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Nomi"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.model}
                            onChange={(e) =>
                              handleUpdateRow(item.id, "model", e.target.value)
                            }
                            className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Modeli"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.size}
                            onChange={(e) =>
                              handleUpdateRow(item.id, "size", e.target.value)
                            }
                            className="text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="O'lchami"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.unit}
                            onChange={(e) =>
                              handleUpdateRow(item.id, "unit", e.target.value)
                            }
                            className="text-sm text-center border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="dona"
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateRow(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="text-sm text-center font-semibold border-0 focus:ring-1 focus:ring-blue-500"
                            min="0"
                            onFocus={handleQuantityFocus}
                          />
                        </td>

                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            type="text"
                            value={item.note}
                            onChange={(e) =>
                              handleUpdateRow(item.id, "note", e.target.value)
                            }
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
    </>
  );
};

export default ProductsSection;
