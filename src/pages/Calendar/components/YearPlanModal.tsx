import { useState } from 'react';
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';
// import { Badge } from '@/app/components/ui/badge';
import { X, Search, Check } from 'lucide-react';
import { Button, Input } from 'antd';

interface YearPlanItem {
  id: number;
  type: string;
  name: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  note: string;
}

interface YearPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: YearPlanItem) => void;
  currentItemId?: number;
}

// Mock yillik reja tovarlar ro'yxati
const yearPlanItems: YearPlanItem[] = [
  { id: 1, type: 'Xarid qilish', name: 'Qog\'oz A4', model: 'Premium', size: '210x297mm', unit: 'dona', quantity: 500, note: 'Oq rang, 80g/m²' },
  { id: 2, type: 'Xarid qilish', name: 'Ruchka', model: 'Ball Pen', size: '0.7mm', unit: 'dona', quantity: 200, note: 'Ko\'k rang' },
  { id: 4, type: 'Xarid qilish', name: 'Marker', model: 'Permanent', size: '3mm', unit: 'dona', quantity: 50, note: 'Qora rang' },
  { id: 6, type: 'Ta\'mir', name: 'USB Flash', model: 'Kingston DT100', size: '32GB', unit: 'dona', quantity: 20, note: 'USB 3.0' },
  { id: 7, type: 'Yangi jihozlash', name: 'Stol', model: 'Офис-Люкс', size: '120x60x75cm', unit: 'dona', quantity: 5, note: 'Yog\'och' },
  { id: 8, type: 'Xarid qilish', name: 'Printer', model: 'HP LaserJet', size: 'A4', unit: 'dona', quantity: 3, note: 'Lazerli' },
  { id: 9, type: 'Xarid qilish', name: 'Monitor', model: 'Dell 24"', size: '24 dyuym', unit: 'dona', quantity: 10, note: 'Full HD' },
  { id: 10, type: 'Mebel', name: 'Stul', model: 'Офис-Комфорт', size: '45x45x90cm', unit: 'dona', quantity: 15, note: 'Qora rang' },
];

export function YearPlanModal({ isOpen, onClose, onSelect, currentItemId }: YearPlanModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<YearPlanItem | null>(null);

  if (!isOpen) return null;

  // Qidiruv filtri
  const filteredItems = yearPlanItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
      setSearchQuery('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Yillik rejadan tanlash</h2>
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
                placeholder="Tovar nomi, modeli yoki turini kiriting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outlined" onClick={() => setSearchQuery('')}>
              <X className="size-4 mr-2" />
              Tozalash
            </Button>
          </div>
        </div>

        {/* Tovarlar ro'yxati */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Buyurtma turi</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Tovar nomi</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Modeli</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">O'lchami</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">O'lchov birligi</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Soni</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
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
                          ? 'bg-blue-100 hover:bg-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <div
                            className={`size-5 rounded border-2 flex items-center justify-center transition-colors ${
                              selectedItem?.id === item.id
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedItem?.id === item.id && (
                              <Check className="size-3 text-white" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{item.type}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{item.model}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{item.size}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center font-semibold">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 italic">{item.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedItem ? (
              <span className="font-medium text-blue-600">
                Tanlangan: {selectedItem.name} ({selectedItem.model})
              </span>
            ) : (
              <span>Tovarni tanlang</span>
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
