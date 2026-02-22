import React, { useState, useEffect } from "react";
import { Search, PackagePlus, X, Trash2 } from "lucide-react";
import { Input, InputNumber, Button } from "antd"; // or your UI components
import { axiosAPI } from "@/service/axiosAPI";
import type { Product, PriceAnalysisFormData } from "../PriceAnalysisForm";

interface ProductsStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
}

interface ApiProduct {
  id: number;
  product_name: string;
  quantity: number;
  price_analysis_quantity: number;
  product_type: { id: number; name: string } | null;
  product_model: { id: number; name: string } | null;
  unit: { id: number; name: string } | null;
  size: { id: number; name: string } | null;
  comment: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

const ProductsStep: React.FC<ProductsStepProps> = ({ formData, setFormData }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Modal selection state
  const [selectedMap, setSelectedMap] = useState<Map<number, number>>(new Map()); // productId -> selectedQuantity

  // Fetch products when modal opens
  useEffect(() => {
    if (showModal) {
      fetchProducts("/document/orders/products/");
    }
  }, [showModal]);

  const fetchProducts = async (url: string) => {
    setLoading(true);
    try {
      const res = await axiosAPI.get<ApiResponse>(url);
      setProducts(res.data.results);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
      setTotalCount(res.data.count);
      // Pre-populate selectedMap from existing form products
      const initialMap = new Map<number, number>();
      formData.products.forEach((p) => initialMap.set(p.id, p.selectedQuantity));
      setSelectedMap(initialMap);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: number, checked: boolean) => {
    setSelectedMap((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        const product = products.find((p) => p.id === productId);
        if (product) newMap.set(productId, product.price_analysis_quantity || 1);
      } else {
        newMap.delete(productId);
      }
      return newMap;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setSelectedMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, quantity);
      return newMap;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, number>();
      products.forEach((p) => newMap.set(p.id, p.price_analysis_quantity || 1));
      setSelectedMap(newMap);
    } else {
      setSelectedMap(new Map());
    }
  };

  const handleAddSelected = () => {
    const newProducts: Product[] = [];
    selectedMap.forEach((qty, id) => {
      const apiProduct = products.find((p) => p.id === id);
      if (apiProduct) {
        newProducts.push({
          id: apiProduct.id,
          product_name: apiProduct.product_name,
          quantity: apiProduct.quantity,
          price_analysis_quantity: apiProduct.price_analysis_quantity,
          product_type: apiProduct.product_type,
          product_model: apiProduct.product_model,
          unit: apiProduct.unit,
          size: apiProduct.size,
          comment: apiProduct.comment,
          selectedQuantity: qty,
        });
      }
    });
    setFormData((prev) => ({ ...prev, products: newProducts }));
    setShowModal(false);
  };

  const removeProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = products.length > 0 && selectedMap.size === products.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Tovarlar</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Qidirish"
              className="pl-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="primary" icon={<PackagePlus />} onClick={() => setShowModal(true)}>
            Tovarlarni to'ldirish
          </Button>
        </div>
      </div>

      {/* Selected products table */}
      <div className="border rounded-lg overflow-auto border-blue-400">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">№</th>
              <th className="px-4 py-2 text-left font-medium">Tovar</th>
              <th className="px-4 py-2 text-left font-medium">Kiruvchi №</th>
              <th className="px-4 py-2 text-left font-medium">Chiquvchi №</th>
              <th className="px-4 py-2 text-left font-medium">Tovar turi</th>
              <th className="px-4 py-2 text-left font-medium">Model</th>
              <th className="px-4 py-2 text-left font-medium">O'lcham</th>
              <th className="px-4 py-2 text-left font-medium">O'lchov birligi</th>
              <th className="px-4 py-2 text-left font-medium">Qoldiq</th>
              <th className="px-4 py-2 text-left font-medium">Yangi miqdor</th>
              <th className="px-4 py-2 text-left font-medium">Izoh</th>
              <th className="px-4 py-2 text-left font-medium">O'chirish</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  Hali hech qanday tovar qo'shilmagan
                </td>
              </tr>
            ) : (
              formData.products.map((prod, idx) => (
                <tr key={prod.id} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{prod.product_name}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">{prod.product_type?.name || '-'}</td>
                  <td className="px-4 py-2">{prod.product_model?.name || '-'}</td>
                  <td className="px-4 py-2">{prod.size?.name || '-'}</td>
                  <td className="px-4 py-2">{prod.unit?.name || '-'}</td>
                  <td className="px-4 py-2">{prod.price_analysis_quantity}</td>
                  <td className="px-4 py-2">
                    <InputNumber
                      value={prod.selectedQuantity}
                      onChange={(val) => {
                        const newProducts = [...formData.products];
                        newProducts[idx].selectedQuantity = val || 1;
                        setFormData({ ...formData, products: newProducts });
                      }}
                      min={1}
                      max={prod.price_analysis_quantity}
                      className="w-20"
                    />
                  </td>
                  <td className="px-4 py-2">{prod.comment || '-'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeProduct(prod.id)} className="text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for selecting products */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[95%] h-[90%] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Tovarlarni tanlang</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="mb-4">
                <Input
                  placeholder="Qidirish..."
                  prefix={<Search size={16} className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
              ) : (
                <>
                  <div className="overflow-auto border rounded border-blue-300">
                    <table className="w-full min-w-[1100px]">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 w-10">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={(e) => toggleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th className="px-4 py-2 font-medium">№</th>
                          <th className="px-4 py-2 font-medium">Kiruvchi №</th>
                          <th className="px-4 py-2 font-medium">Chiquvchi №</th>
                          <th className="px-4 py-2 font-medium">Tovar</th>
                          <th className="px-4 py-2 font-medium">Tovar turi</th>
                          <th className="px-4 py-2 font-medium">Model</th>
                          <th className="px-4 py-2 font-medium">O'lcham</th>
                          <th className="px-4 py-2 font-medium">O'lchov birligi</th>
                          <th className="px-4 py-2 font-medium">Qoldiq</th>
                          <th className="px-4 py-2 font-medium">Yangi miqdor</th>
                          <th className="px-4 py-2 font-medium">Izoh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((prod, idx) => {
                          const selected = selectedMap.has(prod.id);
                          return (
                            <tr key={prod.id} className={selected ? "bg-blue-50" : ""}>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => toggleProduct(prod.id, e.target.checked)}
                                />
                              </td>
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">-</td>
                              <td className="px-4 py-2">-</td>
                              <td className="px-4 py-2">{prod.product_name}</td>
                              <td className="px-4 py-2">{prod.product_type?.name || '-'}</td>
                              <td className="px-4 py-2">{prod.product_model?.name || '-'}</td>
                              <td className="px-4 py-2">{prod.size?.name || '-'}</td>
                              <td className="px-4 py-2">{prod.unit?.name || '-'}</td>
                              <td className="px-4 py-2">{prod.quantity}</td>
                              <td className="px-4 py-2">
                                <InputNumber
                                  value={selectedMap.get(prod.id) || prod.price_analysis_quantity || 1}
                                  onChange={(val) => updateQuantity(prod.id, val || 1)}
                                  disabled={!selected}
                                  min={1}
                                  max={prod.price_analysis_quantity}
                                  className="w-20"
                                />
                              </td>
                              <td className="px-4 py-2">{prod.comment || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination controls */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      Jami: {totalCount} ta | Tanlangan: {selectedMap.size}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!prevUrl}
                        onClick={() => prevUrl && fetchProducts(prevUrl)}
                      >
                        Oldingi
                      </button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!nextUrl}
                        onClick={() => nextUrl && fetchProducts(nextUrl)}
                      >
                        Keyingi
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                Bekor qilish
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedMap.size === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Tanlash ({selectedMap.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsStep;