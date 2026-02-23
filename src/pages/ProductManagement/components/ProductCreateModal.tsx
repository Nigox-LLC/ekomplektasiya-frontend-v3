import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "antd";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductItem) => void;
}

export interface ProductItem {
  id: string;
  name: string;
  code: string;
  type: string;
  model: string;
  size: string;
  unit: string;
  price: number;
}

const ProductCreateModal: React.FC<ProductCreateModalProps> = ({ isOpen, onClose, onSave, }) => {

  const [formData, setFormData] = useState<Partial<ProductItem>>({
    name: "",
    code: "",
    type: "",
    model: "",
    size: "",
    unit: "",
    price: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: ProductItem = {
      id: `PROD-${Date.now()}`,
      name: formData.name || "",
      code: formData.code || "",
      type: formData.type || "",
      model: formData.model || "",
      size: formData.size || "",
      unit: formData.unit || "",
      price: formData.price || 0,
    };

    onSave(newProduct);
    setFormData({
      name: "",
      code: "",
      type: "",
      model: "",
      size: "",
      unit: "",
      price: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Maxsulot yaratish</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Tovar nomi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tovar nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tovar nomini kiriting"
            />
          </div>

          {/* Tovar kodi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tovar kodi
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tovar kodini kiriting"
            />
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tovar turlari */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tovar turlari
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Turini kiriting"
              />
            </div>

            {/* Valyuta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valyuta
              </label>
              <select
                value={formData.unit || "UZS"}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Model */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Modelni kiriting"
              />
            </div>

            {/* O'lcham */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                O'lcham
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="O'lchamni kiriting"
              />
            </div>
          </div>

          {/* Narxi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Narxi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Narxini kiriting"
            />
          </div>

          {/* Foydalanuvchi va Sana */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Foydalanuvchi</p>
              <p className="font-semibold text-gray-900">Administrator</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sana</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button
            type="primary"
            variant="outlined"
            onClick={onClose}
            className="px-6"
          >
            Bekor qilish
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Saqlash va chiqish
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCreateModal;