import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, PackagePlus, X, Trash2 } from "lucide-react";
import { Input, InputNumber, Button } from "antd";
import { axiosAPI } from "@/service/axiosAPI";
import type { Product, PriceAnalysisFormData } from "../PriceAnalysisForm";

interface ProductsStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
}

interface ApiProduct {
  id: number;
  product_name: string;
  quantity: number;               // umumiy ombor qoldig‘i
  price_analysis_quantity: number; // tahlil uchun ajratilgan miqdor (maksimal tanlanma)
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
  const [accumulatedProducts, setAccumulatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMap, setSelectedMap] = useState<Map<number, number>>(new Map());

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Modal ochilganda birinchi sahifani yuklash
  useEffect(() => {
    if (showModal) {
      fetchFirstPage(`/document/orders/products/?search=${searchTerm}`);
    }
  }, [showModal, searchTerm]);

  const fetchFirstPage = async (url: string) => {
    setLoading(true);
    setAccumulatedProducts([]);
    setNextUrl(null);
    try {
      const res = await axiosAPI.get<ApiResponse>(url);
      setAccumulatedProducts(res.data.results);
      setNextUrl(res.data.next);
      setTotalCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = useCallback(async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await axiosAPI.get<ApiResponse>(nextUrl);
      setAccumulatedProducts(prev => [...prev, ...res.data.results]);
      setNextUrl(res.data.next);
    } catch (error) {
      console.error("Failed to fetch next page", error);
    } finally {
      setLoadingMore(false);
    }
  }, [nextUrl, loadingMore]);

  // Skroll eventini kuzatish
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container || !showModal) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, showModal]);

  // Qidiruv so‘zi o‘zgarganda kechiktirilgan so‘rov
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (showModal) {
        fetchFirstPage(`/document/orders/products/?search=${value}`);
      }
    }, 500);
  };

  const toggleProduct = (productId: number, checked: boolean) => {
    setSelectedMap(prev => {
      const newMap = new Map(prev);
      if (checked) {
        const p = accumulatedProducts.find(x => x.id === productId);
        const maxQty = p ? getMaxQty(p) : undefined;
        const current = newMap.get(productId) ?? 1;
        newMap.set(productId, clamp(current, 1, maxQty));
      } else {
        newMap.delete(productId);
      }
      return newMap;
    });
  };

  // const updateQuantity = (productId: number, quantity: number) => {
  //   setSelectedMap(prev => {
  //     const newMap = new Map(prev);
  //     newMap.set(productId, quantity);
  //     return newMap;
  //   });
  // };

  const getMaxQty = (p: ApiProduct) => {
    const paq = Number(p.price_analysis_quantity);
    if (!Number.isFinite(paq) || paq <= 0) return p.quantity; // fallback
    return paq;
  };

  const clamp = (v: number, min: number, max?: number) => {
    if (!Number.isFinite(v)) return min;
    const vv = Math.max(min, v);
    if (!Number.isFinite(max as number) || (max as number) <= 0) return vv; // max yo'q
    return Math.min(max as number, vv);
  };

  const updateQuantity = (productId: number, val: number | null, max?: number) => {
    setSelectedMap(prev => {
      const newMap = new Map(prev);
      const prevVal = newMap.get(productId) ?? 1;
      const nextVal = val === null ? prevVal : clamp(val, 1, max);
      newMap.set(productId, nextVal);
      return newMap;
    });
  };


  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMap(prev => {
        const newMap = new Map(prev);
        accumulatedProducts.forEach(p => {
          newMap.set(p.id, newMap.get(p.id) ?? 1);
        });
        return newMap;
      });
    } else {
      setSelectedMap(new Map());
    }
  };

  const handleAddSelected = () => {
    // map ichida null bo‘lib qolganlar bo‘lsa ham 1ga tushirmaymiz
    setSelectedMap(prev => new Map(prev));

    const newProducts: Product[] = [];
    selectedMap.forEach((qty, id) => {
      const apiProduct = accumulatedProducts.find(p => p.id === id);
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

    setFormData(prev => ({ ...prev, products: newProducts }));
    setShowModal(false);
  };

  const removeProduct = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId),
    }));
  };

  const isAllSelected = accumulatedProducts.length > 0 && selectedMap.size === accumulatedProducts.length;

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
              onChange={handleSearchChange}
            />
          </div>
          <Button type="primary" icon={<PackagePlus />} onClick={() => setShowModal(true)}>
            Tovarlarni to'ldirish
          </Button>
        </div>
      </div>

      {/* Asosiy jadval (tanlangan tovarlar) */}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 sticky top-0 z-20">
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
                  <tr key={prod.id}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{prod.product_name}</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">{prod.product_type?.name || '-'}</td>
                    <td className="px-4 py-2">{prod.product_model?.name || '-'}</td>
                    <td className="px-4 py-2">{prod.size?.name || '-'}</td>
                    <td className="px-4 py-2">{prod.unit?.name || '-'}</td>
                    <td className="px-4 py-2">{prod.quantity}</td>  {/* Tuzatildi: prod.quantity */}
                    <td className="px-4 py-2">
                      <InputNumber
                        value={prod.selectedQuantity}
                        onChange={(val) => {
                          const newProducts = [...formData.products];
                          newProducts[idx].selectedQuantity = val ?? 1;
                          setFormData({ ...formData, products: newProducts });
                        }}
                        disabled
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
      </div>

      {/* Modal: tovarlarni tanlash */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[95%] h-[90%] flex flex-col">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">Tovarlarni tanlang</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col overflow-hidden">
              <div className="mb-4">
                <Input
                  placeholder="Tovarlarni qidirish..."
                  prefix={<Search size={16} className="text-gray-400" />}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-12"
                />
              </div>
              {loading && accumulatedProducts.length === 0 ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
              ) : (
                <>
                  <div
                    ref={tableContainerRef}
                    className="overflow-auto flex-1 rounded"
                    style={{ maxHeight: "100%" }}
                  >
                    <table className="w-full min-w-[1100px]">
                      <thead className="bg-slate-50 sticky top-0 z-20">
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
                        {accumulatedProducts.map((prod, idx) => {
                          const selected = selectedMap.has(prod.id);
                          const maxQty = getMaxQty(prod);
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
                              <td className="px-4 py-2">{prod.quantity}</td>  {/* Tuzatildi: prod.quantity */}
                              <td className="px-4 py-2">
                                <InputNumber
                                  value={selectedMap.get(prod.id) ?? 1}
                                  onChange={(val) => updateQuantity(prod.id, val, maxQty)}
                                  disabled={!selected}
                                  min={1}
                                  max={maxQty}
                                  className="w-24"
                                />
                              </td>
                              <td className="px-4 py-2">{prod.comment || '-'}</td>
                            </tr>
                          );
                        })}
                        {loadingMore && (
                          <tr>
                            <td colSpan={12} className="text-center py-4 text-gray-400">
                              Yuklanmoqda...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between gap-2 p-4 border-t border-gray-300">
              <div className="flex justify-between items-center mt-4">
                <div>
                  Jami: {totalCount} ta | Tanlangan: {selectedMap.size}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border border-gray-300">
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
        </div>
      )}
    </div>
  );
};

export default ProductsStep;