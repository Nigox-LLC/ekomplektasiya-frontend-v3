import React, { useState } from "react";
import { X, Search, Settings, Printer, Plus } from "lucide-react";
import ProductCreateModal, { type ProductItem } from "./ProductCreateModal";
import  TableLoadingSpinner  from "./TableLoadingSpinner";
import { Button } from "antd";

interface ProductSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: ProductItem) => void;
}

// Mock maxsulotlar
const mockProducts: ProductItem[] = [
  {
    id: "5191",
    name: "РДБК-1.25 (Галлаорол)",
    type: "Регулятор",
    model: "",
    size: "",
    unit: "Шт",
    price: 150000,
    code: "",
  },
  {
    id: "5192",
    name: "Регулятор РДНК-100",
    type: "Регулятор",
    model: "",
    size: "",
    unit: "Шт",
    price: 320000,
    code: "",
  },
  {
    id: "5193",
    name: "Регулятор РДНК-50",
    type: "Регулятор",
    model: "",
    size: "",
    unit: "Шт",
    price: 280000,
    code: "",
  },
  {
    id: "5194",
    name: "Труба Д-219 (Галлаорол)",
    type: "Труба",
    model: "",
    size: "",
    unit: "п/м",
    price: 85000,
    code: "",
  },
  {
    id: "5195",
    name: "Шланг газовый для г��зовых счетчиков 60x60 см с ла...",
    type: "Шланг",
    model: "",
    size: "",
    unit: "комп",
    price: 45000,
    code: "",
  },
  {
    id: "5196",
    name: "Адапт ер лат ун для газовых счёт чиков ДУ-32",
    type: "Адаптер",
    model: "",
    size: "",
    unit: "Шт",
    price: 12000,
    code: "",
  },
  {
    id: "5197",
    name: "Заказ 007-164 М-183/20 фильтр газовый Ф Г-50 (999...",
    type: "Фильтр газовый",
    model: "",
    size: "",
    unit: "Шт",
    price: 420000,
    code: "",
  },
  {
    id: "5198",
    name: "Комплек газовых 60 х40 с латунным и адаптром для ...",
    type: "Адаптер",
    model: "",
    size: "",
    unit: "комп",
    price: 78000,
    code: "",
  },
];

const ProductSelectModal: React.FC<ProductSelectModalProps> = ({ isOpen, onClose, onSelect,}) => {

  const [products, setProducts] = useState<ProductItem[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query)
    );
  });

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleSelectProduct = (product: ProductItem) => {
    onSelect(product);
    onClose(); // Close modal after selection
  };

  const handleCreateProduct = (newProduct: ProductItem) => {
    setProducts([...products, newProduct]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header - Modern */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-xl font-bold text-gray-900">Maxsulotlar</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Toolbar - Clean */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Plus className="size-4" />
              Yaratish
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Settings className="size-4" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Printer className="size-4" />
            </Button>
            
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 ml-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Qidiruv (Ctrl+F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="w-full pl-10 pr-10 py-2 text-[11px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container with Custom Scrollbar */}
          <div className="flex-1 overflow-auto relative bg-white custom-scrollbar-modal">
            {loading && <TableLoadingSpinner />}
            
            <table className="w-full border-collapse">
              <thead className="bg-white sticky top-0 z-10">
                <tr className="border-b-2 border-gray-200">
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    №
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Tovar nomi
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    O'l.Bir
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    MXIK kod
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Tovar kodi
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Tovar turlari
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Valyuta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2 text-[11px] text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-blue-600 font-medium hover:underline">
                      {product.name}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-gray-700">
                      {product.unit}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-gray-600">
                      {product.code || "-"}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-gray-600">-</td>
                    <td className="px-3 py-2 text-[11px] text-gray-700">
                      {product.type}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-gray-600">UZS</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">Maxsulotlar topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      <ProductCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProduct}
      />

      {/* Custom Scrollbar Styles for Modal */}
      <style>{`
        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 10px;
          border: 2px solid #f8fafc;
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar-corner {
          background: #f8fafc;
        }
      `}</style>
    </>
  );
}

export default ProductSelectModal;