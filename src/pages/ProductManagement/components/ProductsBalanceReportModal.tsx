import { useState } from "react";
import {
  X,
  Package,
  Sheet,
  File,
  Clock,
  Download,
  ChevronDown,
} from "lucide-react";
import { Badge, Button, Input } from "antd";

interface Product {
  id: string;
  barcode: string;
  name: string;
  type: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

interface ProductsBalanceReportModalProps {
  isOpen: boolean;
  products?: Product[];
  onClose: () => void;
  title?: string;
  initialBarcodeFilter?: string;
}

const ProductsBalanceReportModal: React.FC<ProductsBalanceReportModalProps> = ({ isOpen, products = [], onClose, title = "Jami maxsulotlar qoldig'i",  initialBarcodeFilter = "" }) => {
  // Filters
  const [reportBarcodeFilter, setReportBarcodeFilter] =
    useState(initialBarcodeFilter);

  // Multiselect states
  const [selectedReportTypes, setSelectedReportTypes] =
    useState<string[]>([]);
  const [selectedReportModels, setSelectedReportModels] =
    useState<string[]>([]);
  const [selectedReportSizes, setSelectedReportSizes] =
    useState<string[]>([]);

  // Dropdown states
  const [openReportTypeDropdown, setOpenReportTypeDropdown] =
    useState(false);
  const [openReportModelDropdown, setOpenReportModelDropdown] =
    useState(false);
  const [openReportSizeDropdown, setOpenReportSizeDropdown] =
    useState(false);

  // Search states
  const [reportTypeSearch, setReportTypeSearch] = useState("");
  const [reportModelSearch, setReportModelSearch] =
    useState("");
  const [reportSizeSearch, setReportSizeSearch] = useState("");

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesBarcode = product.barcode
      .toLowerCase()
      .includes(reportBarcodeFilter.toLowerCase());
    const matchesType =
      selectedReportTypes.length === 0 ||
      selectedReportTypes.includes(product.type);
    const matchesModel =
      selectedReportModels.length === 0 ||
      selectedReportModels.includes(product.model);
    const matchesSize =
      selectedReportSizes.length === 0 ||
      selectedReportSizes.includes(product.size);

    return (
      matchesBarcode &&
      matchesType &&
      matchesModel &&
      matchesSize
    );
  });

  // Get available models and sizes based on selected types
  const availableModels = products
    .filter(
      (product) =>
        selectedReportTypes.length === 0 ||
        selectedReportTypes.includes(product.type),
    )
    .map((product) => product.model)
    .filter(
      (model, index, self) => self.indexOf(model) === index,
    );

  const availableSizes = products
    .filter(
      (product) =>
        selectedReportTypes.length === 0 ||
        selectedReportTypes.includes(product.type),
    )
    .map((product) => product.size)
    .filter(
      (size, index, self) => self.indexOf(size) === index,
    );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("uz-UZ").format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("UZS", "so'm");
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("uz-UZ");
    const time = now.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-red-200 text-gray-900 px-0.5 rounded font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const handleExportPDF = () => {
    alert(
      "PDF formatda yuklab olish funksiyasi ishga tushdi!\n\nBu demo versiya. Real loyihada PDF yaratiladi.",
    );
  };

  const handleExportExcel = () => {
    alert(
      "Excel formatda yuklab olish funksiyasi ishga tushdi!\n\nBu demo versiya. Real loyihada Excel fayl yaratiladi.",
    );
  };

  const uniqueTypes = products
    .map((product) => product.type)
    .filter(
      (type, index, self) => self.indexOf(type) === index,
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Clock className="size-3" />
                <span>{getCurrentDateTime()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="small"
              className="text-white hover:bg-white/20"
              title="PDF formatda yuklab olish"
              onClick={handleExportPDF}
            >
              <File className="size-4" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="text-white hover:bg-white/20"
              title="Excel formatda yuklab olish"
              onClick={handleExportExcel}
            >
              <Sheet className="size-4" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col">
          {/* Filters */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shtrix kod
              </label>
              <Input
                type="text"
                placeholder="2026..."
                className="text-xs h-9"
                value={reportBarcodeFilter}
                onChange={(e) =>
                  setReportBarcodeFilter(e.target.value)
                }
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tovar turi
              </label>
              <button
                onClick={() => {
                  setOpenReportTypeDropdown(
                    !openReportTypeDropdown,
                  );
                  setOpenReportModelDropdown(false);
                  setOpenReportSizeDropdown(false);
                }}
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-xs text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
              >
                <span
                  className={
                    selectedReportTypes.length > 0
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }
                >
                  {selectedReportTypes.length > 0
                    ? `${selectedReportTypes.length} ta tanlandi`
                    : "Tovar turini tanlang"}
                </span>
                <ChevronDown className="size-4 text-gray-400" />
              </button>

              {openReportTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-60 overflow-hidden flex flex-col">
                  <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <Input
                      type="text"
                      placeholder="Qidirish..."
                      className="text-xs h-7 flex-1 mr-2"
                      value={reportTypeSearch}
                      onChange={(e) =>
                        setReportTypeSearch(e.target.value)
                      }
                    />
                    {selectedReportTypes.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedReportTypes([]);
                          setSelectedReportModels([]);
                          setSelectedReportSizes([]);
                        }}
                        className="text-gray-500 hover:text-red-600 p-1"
                        title="Hammasini o'chirish"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-48">
                    {uniqueTypes
                      .filter((type) =>
                        type
                          .toLowerCase()
                          .includes(
                            reportTypeSearch.toLowerCase(),
                          ),
                      )
                      .map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedReportTypes.includes(
                              type,
                            )}
                            onChange={() => {
                              if (
                                selectedReportTypes.includes(
                                  type,
                                )
                              ) {
                                setSelectedReportTypes((prev) =>
                                  prev.filter(
                                    (t) => t !== type,
                                  ),
                                );
                              } else {
                                setSelectedReportTypes(
                                  (prev) => [...prev, type],
                                );
                              }
                            }}
                            className="size-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {type}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              )}

              {selectedReportTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedReportTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1.5 py-0"
                    >
                      {type}
                      <button
                        onClick={() => {
                          setSelectedReportTypes((prev) =>
                            prev.filter((t) => t !== type),
                          );
                          setSelectedReportModels([]);
                          setSelectedReportSizes([]);
                        }}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Model
              </label>
              <button
                onClick={() => {
                  if (selectedReportTypes.length > 0) {
                    setOpenReportModelDropdown(
                      !openReportModelDropdown,
                    );
                    setOpenReportTypeDropdown(false);
                    setOpenReportSizeDropdown(false);
                  }
                }}
                disabled={selectedReportTypes.length === 0}
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-xs text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <span
                  className={
                    selectedReportModels.length > 0
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }
                >
                  {selectedReportTypes.length === 0
                    ? "Avval tovar turini tanlang"
                    : selectedReportModels.length > 0
                      ? `${selectedReportModels.length} ta tanlandi`
                      : "Avval modelni tanlang"}
                </span>
                <ChevronDown className="size-4 text-gray-400" />
              </button>

              {openReportModelDropdown &&
                selectedReportTypes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-60 overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <Input
                        type="text"
                        placeholder="Qidirish..."
                        className="text-xs h-7 flex-1 mr-2"
                        value={reportModelSearch}
                        onChange={(e) =>
                          setReportModelSearch(e.target.value)
                        }
                      />
                      {selectedReportModels.length > 0 && (
                        <button
                          onClick={() =>
                            setSelectedReportModels([])
                          }
                          className="text-gray-500 hover:text-red-600 p-1"
                          title="Hammasini o'chirish"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {availableModels
                        .filter((model) =>
                          model
                            .toLowerCase()
                            .includes(
                              reportModelSearch.toLowerCase(),
                            ),
                        )
                        .map((model) => (
                          <label
                            key={model}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedReportModels.includes(
                                model,
                              )}
                              onChange={() => {
                                if (
                                  selectedReportModels.includes(
                                    model,
                                  )
                                ) {
                                  setSelectedReportModels(
                                    (prev) =>
                                      prev.filter(
                                        (m) => m !== model,
                                      ),
                                  );
                                } else {
                                  setSelectedReportModels(
                                    (prev) => [...prev, model],
                                  );
                                }
                              }}
                              className="size-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {model}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

              {selectedReportModels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedReportModels.map((model) => (
                    <Badge
                      key={model}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1.5 py-0"
                    >
                      {model}
                      <button
                        onClick={() =>
                          setSelectedReportModels((prev) =>
                            prev.filter((m) => m !== model),
                          )
                        }
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                O'lchami
              </label>
              <button
                onClick={() => {
                  if (selectedReportTypes.length > 0) {
                    setOpenReportSizeDropdown(
                      !openReportSizeDropdown,
                    );
                    setOpenReportTypeDropdown(false);
                    setOpenReportModelDropdown(false);
                  }
                }}
                disabled={selectedReportTypes.length === 0}
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-xs text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <span
                  className={
                    selectedReportSizes.length > 0
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }
                >
                  {selectedReportTypes.length === 0
                    ? "Avval tovar turini tanlang"
                    : selectedReportSizes.length > 0
                      ? `${selectedReportSizes.length} ta tanlandi`
                      : "Avval o'lchamni tanlang"}
                </span>
                <ChevronDown className="size-4 text-gray-400" />
              </button>

              {openReportSizeDropdown &&
                selectedReportTypes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-60 overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <Input
                        type="text"
                        placeholder="Qidirish..."
                        className="text-xs h-7 flex-1 mr-2"
                        value={reportSizeSearch}
                        onChange={(e) =>
                          setReportSizeSearch(e.target.value)
                        }
                      />
                      {selectedReportSizes.length > 0 && (
                        <button
                          onClick={() =>
                            setSelectedReportSizes([])
                          }
                          className="text-gray-500 hover:text-red-600 p-1"
                          title="Hammasini o'chirish"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {availableSizes
                        .filter((size) =>
                          size
                            .toLowerCase()
                            .includes(
                              reportSizeSearch.toLowerCase(),
                            ),
                        )
                        .map((size) => (
                          <label
                            key={size}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedReportSizes.includes(
                                size,
                              )}
                              onChange={() => {
                                if (
                                  selectedReportSizes.includes(
                                    size,
                                  )
                                ) {
                                  setSelectedReportSizes(
                                    (prev) =>
                                      prev.filter(
                                        (s) => s !== size,
                                      ),
                                  );
                                } else {
                                  setSelectedReportSizes(
                                    (prev) => [...prev, size],
                                  );
                                }
                              }}
                              className="size-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {size}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

              {selectedReportSizes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedReportSizes.map((size) => (
                    <Badge
                      key={size}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1.5 py-0"
                    >
                      {size}
                      <button
                        onClick={() =>
                          setSelectedReportSizes((prev) =>
                            prev.filter((s) => s !== size),
                          )
                        }
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Container with fixed height and scroll */}
          <div className="border border-gray-300 rounded-lg overflow-hidden flex-1 flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-center bg-gray-100">
                      №
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      Shtrix kod
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      Tovar nomi
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      Tovar turi
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      Modeli
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      O'lchami
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-left bg-gray-100">
                      O'lchov birligi
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-right bg-gray-100">
                      Soni
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-right bg-gray-100">
                      Narxi
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 text-right bg-gray-100">
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {highlightText(
                          product.barcode,
                          reportBarcodeFilter,
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {product.name}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {product.type}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {product.model}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {product.size}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {product.unit}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                        {formatNumber(product.quantity)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right font-semibold">
                        {formatCurrency(product.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-blue-50">
                  <tr className="font-bold">
                    <td
                      colSpan={7}
                      className="border border-gray-300 px-3 py-2 text-xs text-right bg-blue-50"
                    >
                      JAMI:
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right bg-blue-50">
                      {formatNumber(
                        filteredProducts.reduce(
                          (sum, p) => sum + p.quantity,
                          0,
                        ),
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right bg-blue-50">
                      -
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right font-bold text-blue-700 bg-blue-50">
                      {formatCurrency(
                        filteredProducts.reduce(
                          (sum, p) => sum + p.total,
                          0,
                        ),
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0"></div>
      </div>
    </div>
  );
}

export default ProductsBalanceReportModal;