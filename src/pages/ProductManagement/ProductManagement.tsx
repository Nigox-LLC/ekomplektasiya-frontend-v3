import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
} from 'lucide-react';
import { Badge, Button, Input } from 'antd';

interface GoodsItem {
  id: string;
  name: string;
  model: string;
  unit: string;
  category: string;
  minStock: number;
  currentStock: number;
  price: number;
  supplier: string;
  description: string;
}

const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GoodsItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock tovarlar
  const [goods, setGoods] = useState<GoodsItem[]>([
    {
      id: '1',
      name: 'Qog\'oz A4',
      model: 'Premium White',
      unit: 'dona',
      category: 'Канцтовары',
      minStock: 100,
      currentStock: 450,
      price: 25000,
      supplier: 'Office Plus',
      description: 'Oq rang, 80g/m²'
    },
    {
      id: '2',
      name: 'Ruchka',
      model: 'Ball Pen',
      unit: 'dona',
      category: 'Канцтовары',
      minStock: 50,
      currentStock: 180,
      price: 2500,
      supplier: 'Stationery World',
      description: 'Ko\'k rang, 0.7mm'
    },
    {
      id: '3',
      name: 'Monitor',
      model: 'Dell P2422H',
      unit: 'dona',
      category: 'Электроника',
      minStock: 5,
      currentStock: 12,
      price: 2500000,
      supplier: 'IT Store',
      description: '24" Full HD IPS'
    },
    {
      id: '4',
      name: 'Klaviatura',
      model: 'Logitech K120',
      unit: 'dona',
      category: 'Электроника',
      minStock: 10,
      currentStock: 25,
      price: 150000,
      supplier: 'IT Store',
      description: 'USB проводное'
    },
  ]);

  const categories = ['Канцтовары', 'Электроника', 'Мебель', 'Сантехника', 'Хозтовары'];

  const filteredGoods = goods.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Haqiqatan ham bu tovarni o\'chirmoqchimisiz?')) {
      setGoods(goods.filter(g => g.id !== id));
    }
  };

  const getLowStockCount = () => {
    return goods.filter(g => g.currentStock < g.minStock).length;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tovarlar boshqaruvi</h1>
            <p className="text-sm text-gray-500 mt-1">Tizimda mavjud tovarlar va materiallarni boshqarish</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="size-4" />
            Yangi tovar qo'shish
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Qidirish (nom, model, yetkazib beruvchi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Jami tovarlar</p>
            <p className="text-2xl font-bold text-gray-900">{goods.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Qoldiq kam</p>
            <p className="text-2xl font-bold text-red-600">{getLowStockCount()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Jami kategoriyalar</p>
            <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Umumiy qiymat</p>
            <p className="text-2xl font-bold text-green-600">
              {(goods.reduce((sum, g) => sum + (g.currentStock * g.price), 0) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Goods Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tovar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategoriya</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qoldiq</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Min. qoldiq</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Narx</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Yetkazib beruvchi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGoods.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${item.currentStock < item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    {item.price.toLocaleString()} so'm
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.supplier}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Tahrirlash"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="O'chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <GoodsModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
          onSave={(data) => {
            const newItem: GoodsItem = {
              ...data,
              id: Date.now().toString()
            };
            setGoods([...goods, newItem]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <GoodsModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          categories={categories}
          onSave={(data) => {
            setGoods(goods.map(g => g.id === selectedItem.id ? { ...g, ...data } : g));
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

// Goods Modal Component
interface GoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GoodsItem;
  categories: string[];
  onSave: (data: Omit<GoodsItem, 'id'>) => void;
}

function GoodsModal({ isOpen, onClose, item, categories, onSave }: GoodsModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    model: item?.model || '',
    unit: item?.unit || 'dona',
    category: item?.category || categories[0],
    minStock: item?.minStock || 0,
    currentStock: item?.currentStock || 0,
    price: item?.price || 0,
    supplier: item?.supplier || '',
    description: item?.description || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Tovarni tahrirlash' : 'Yangi tovar qo\'shish'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tovar nomi <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Qog'oz A4"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Model <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Premium White"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategoriya <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                O'lchov birligi <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="dona">dona</option>
                <option value="kg">kg</option>
                <option value="m">m</option>
                <option value="m²">m²</option>
                <option value="litr">litr</option>
              </select>
            </div>

            {/* Current Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Joriy qoldiq <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                placeholder="100"
                required
              />
            </div>

            {/* Min Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimal qoldiq <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                placeholder="50"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Narx (so'm) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="25000"
                required
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Yetkazib beruvchi <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Office Plus"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tovar haqida qo'shimcha ma'lumot..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outlined" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {item ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;