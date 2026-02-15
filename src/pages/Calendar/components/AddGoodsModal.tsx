import { useState } from 'react';
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';
// import { Badge } from '@/app/components/ui/badge';
import { X, Search, Check } from 'lucide-react';
import { Badge, Button, Input } from 'antd';

interface AddGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goods: any) => void;
}

// Yillik rejadagi tovarlar
const availableGoods = [
  { id: 1, type: 'Xarid qilish', name: 'Qog\'oz A4', model: 'Premium', size: '210x297mm', unit: 'dona', note: 'Oq rang, 80g/m²' },
  { id: 2, type: 'Xarid qilish', name: 'Ruchka', model: 'Ball Pen', size: '0.7mm', unit: 'dona', note: 'Ko\'k rang' },
  { id: 4, type: 'Xarid qilish', name: 'Marker', model: 'Permanent', size: '3mm', unit: 'dona', note: 'Qora rang' },
  { id: 6, type: 'Ta\'mir', name: 'USB Flash', model: 'Kingston DT100', size: '32GB', unit: 'dona', note: 'USB 3.0' },
  { id: 7, type: 'Yangi jihozlash', name: 'Stol', model: 'Офис-Люкс', size: '120x60x75cm', unit: 'dona', note: 'Yog\'och' },
  { id: 8, type: 'Xarid qilish', name: 'Printer', model: 'HP LaserJet', size: 'A4', unit: 'dona', note: 'Lazerli' },
  { id: 9, type: 'Xarid qilish', name: 'Monitor', model: 'Dell 24"', size: '24 dyuym', unit: 'dona', note: 'Full HD' },
  { id: 10, type: 'Mebel', name: 'Stul', model: 'Офис-Комфорт', size: '45x45x90cm', unit: 'dona', note: 'Qora rang' },
  { id: 11, type: 'Xarid qilish', name: 'Klaviatura', model: 'Logitech K120', size: 'Standart', unit: 'dona', note: 'USB' },
  { id: 12, type: 'Xarid qilish', name: 'Sichqoncha', model: 'Logitech M90', size: 'Kichik', unit: 'dona', note: 'USB' },
];

export function AddGoodsModal({ isOpen, onClose, onSave }: AddGoodsModalProps) {
  const [goodsName, setGoodsName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedGoods, setSelectedGoods] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedItem, setTempSelectedItem] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validatsiya
    if (!goodsName || !quantity) {
      alert('Tovar nomi va sonini to\'ldiring!');
      return;
    }

    if (!selectedGoods) {
      alert('Rekvizitlarni tanlang!');
      return;
    }

    const newGoods = {
      id: Date.now(),
      type: selectedGoods.type,
      yearPlan: selectedGoods,
      name: goodsName,
      model: selectedGoods.model,
      size: selectedGoods.size,
      unit: selectedGoods.unit,
      quantity: parseInt(quantity) || 0,
      note: selectedGoods.note
    };

    onSave(newGoods);
    
    // Formani tozalash
    setGoodsName('');
    setQuantity('');
    setSelectedGoods(null);
  };

  const handleClose = () => {
    setGoodsName('');
    setQuantity('');
    setSelectedGoods(null);
    setSearchQuery('');
    onClose();
  };

  const handleSelectFromModal = () => {
    if (tempSelectedItem) {
      setSelectedGoods(tempSelectedItem);
      setShowSelectModal(false);
      setTempSelectedItem(null);
      setSearchQuery('');
    }
  };

  // Qidiruv filtri
  const filteredGoods = availableGoods.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Asosiy modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tovar qo'shish</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Tovar nomi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tovar nomi <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={goodsName}
                  onChange={(e) => setGoodsName(e.target.value)}
                  placeholder="Tovar nomini kiriting..."
                  required
                />
              </div>

              {/* Rekvizitlarni tanlash tugmasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rekvizitlar <span className="text-red-500">*</span>
                </label>
                <Button
                  type="primary"
                  variant="outlined"
                  onClick={() => setShowSelectModal(true)}
                  className="w-full justify-start"
                >
                  {selectedGoods ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">Tanlangan</Badge>
                      <span className="text-sm">{selectedGoods.type} - {selectedGoods.model}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Rekvizitlarni tanlash uchun bosing</span>
                  )}
                </Button>
              </div>

              {/* Tanlangan rekvizitlar ko'rinishi */}
              {selectedGoods && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Buyurtma turi</p>
                      <p className="text-sm font-medium text-gray-900">{selectedGoods.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Modeli</p>
                      <p className="text-sm font-medium text-gray-900">{selectedGoods.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">O'lchami</p>
                      <p className="text-sm font-medium text-gray-900">{selectedGoods.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">O'lchov birligi</p>
                      <p className="text-sm font-medium text-gray-900">{selectedGoods.unit}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Izoh</p>
                      <p className="text-sm font-medium text-gray-900">{selectedGoods.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Soni */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soni <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Masalan: 100"
                  min="1"
                  required
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <Button variant="outlined" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Saqlash
            </Button>
          </div>
        </div>
      </div>

      {/* Rekvizitlar tanlash modali */}
      {showSelectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Rekvizitlarni tanlash</h2>
              <button
                onClick={() => {
                  setShowSelectModal(false);
                  setTempSelectedItem(null);
                  setSearchQuery('');
                }}
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
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGoods.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                          Hech qanday tovar topilmadi
                        </td>
                      </tr>
                    ) : (
                      filteredGoods.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setTempSelectedItem(item)}
                          className={`cursor-pointer transition-colors ${
                            tempSelectedItem?.id === item.id
                              ? 'bg-blue-100 hover:bg-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              <div
                                className={`size-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  tempSelectedItem?.id === item.id
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300'
                                }`}
                              >
                                {tempSelectedItem?.id === item.id && (
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
                {tempSelectedItem ? (
                  <span className="font-medium text-blue-600">
                    Tanlangan: {tempSelectedItem.name} ({tempSelectedItem.model})
                  </span>
                ) : (
                  <span>Tovarni tanlang</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowSelectModal(false);
                    setTempSelectedItem(null);
                    setSearchQuery('');
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleSelectFromModal}
                  disabled={!tempSelectedItem}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tanlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}