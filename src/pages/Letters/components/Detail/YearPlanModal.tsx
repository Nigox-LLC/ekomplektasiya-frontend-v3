import { useState, useEffect } from "react";
import { X, Search, Check, Loader } from "lucide-react";
import { Button, Input, message } from "antd";
import { axiosAPI } from "@/service/axiosAPI";

interface Unit {
  id: number;
  name: string;
}

interface YearPlanItem {
  id: number;
  name: string;
  unit: Unit | null;
  quantity: number;
  price: number;
  summa: number;
  used_quantity: number;
  is_approved: boolean;
  funding_source: string;
  created_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: YearPlanItem[];
}

interface YearPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: YearPlanItem) => void;
  currentItemId?: number;
}

export function YearPlanModal({
  isOpen,
  onClose,
  onSelect,
  currentItemId,
}: YearPlanModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<YearPlanItem | null>(null);
  const [yearPlanItems, setYearPlanItems] = useState<YearPlanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchYearPlanItems();
    }
  }, [isOpen]);

  const fetchYearPlanItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosAPI.get<ApiResponse>("/document/plan/items/");
      setYearPlanItems(response.data.results);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Маълумотларни юклашда хато";
      setError(errorMessage);
      message.error("Маълумотларни юклашда хато");
      console.error("Error fetching year plan items:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Qidiruv filtri
  const filteredItems = yearPlanItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.funding_source?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
      setSearchQuery("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSearchQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Yillik reja tanlash oynasi
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Qidiruv */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tovar nomi bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outlined" onClick={() => setSearchQuery("")}>
              <X className="size-4 mr-2" />
              Tozalash
            </Button>
          </div>
        </div>

        {/* Tovarlar ro'yxati */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader className="size-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-red-600 font-semibold">Xatolik</p>
                <p className="text-gray-600">{error}</p>
                <Button onClick={fetchYearPlanItems}>
                  Qayta urinib ko'rish
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Check className="size-4" />
                        Tanlash
                      </div>
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tovar nomi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Soni
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Tranha
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Qo'llanish
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      O'lchov birgisi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Raxbariyot manbai
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Ko'lmak holati
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        Hech qanday tovar topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`cursor-pointer transition-colors ${
                          selectedItem?.id === item.id
                            ? "bg-blue-100 hover:bg-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`size-5 rounded border-2 flex items-center justify-center transition-colors ${
                                selectedItem?.id === item.id
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedItem?.id === item.id && (
                                <Check
                                  className="size-3 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">
                          {item.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 text-center">
                          {item.price?.toLocaleString("uz-UZ")}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 text-center">
                          {item.used_quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                          {item.unit?.name || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                          {item.funding_source}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.is_approved
                                ? "bg-green-100 text-green-900"
                                : "bg-yellow-100 text-yellow-900"
                            }`}
                          >
                            {item.is_approved
                              ? "Қўлланилди"
                              : "Тасдиқ қилинмади"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedItem ? (
              <span className="font-medium text-blue-600">
                Tanlangan: {selectedItem.name}
              </span>
            ) : (
              <span>Hech narsa tanlanmadi</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outlined" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!selectedItem}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tanlash
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
