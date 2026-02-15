import { useState } from 'react';
import { Calendar, Printer, Download, Filter } from 'lucide-react';
import { Button } from 'antd';

const GoodsMaterialsBalance: React.FC = () => {
  const [startDate, setStartDate] = useState('01.02.2026 00:00');
  const [endDate, setEndDate] = useState('10.02.2026 23:59');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [barcode, setBarcode] = useState('');
  const [productType, setProductType] = useState('');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [product, setProduct] = useState('');

  const regions = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan'];
  const warehouses = ['Asosiy ombor', 'Ombor #1', 'Ombor #2', 'Ombor #3'];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Filtrlar */}
      <div className="p-6 border-b border-gray-200">
        {/* Barcha filtrlar gorizontal */}
        <div className="flex items-end gap-3 mb-4">
          <div style={{ minWidth: '380px' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sana</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 size-4 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-gray-500">—</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-2">Viloyat</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tanlang</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ombor</label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Omborni tanlang</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>{warehouse}</option>
              ))}
            </select>
          </div>

          <div className="w-44">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shtrix kod</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Shtrix kodni kiriting"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tovar turi</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tanlang</option>
              <option value="elektronika">Elektronika</option>
              <option value="kiyim">Kiyim</option>
              <option value="oziq-ovqat">Oziq-ovqat</option>
            </select>
          </div>

          <div className="w-36">
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tanlang</option>
              <option value="model-1">Model 1</option>
              <option value="model-2">Model 2</option>
              <option value="model-3">Model 3</option>
            </select>
          </div>

          <div className="w-36">
            <label className="block text-sm font-medium text-gray-700 mb-2">O'lcham</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tanlang</option>
              <option value="kichik">Kichik</option>
              <option value="orta">O'rta</option>
              <option value="katta">Katta</option>
            </select>
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tovar</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tanlang</option>
              <option value="tovar-1">Tovar 1</option>
              <option value="tovar-2">Tovar 2</option>
              <option value="tovar-3">Tovar 3</option>
            </select>
          </div>
        </div>

        {/* Tugmalar */}
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2">
            <Filter className="size-4" />
            Shakllantirilish
          </Button>
          <Button variant="outlined" className="px-6 py-2.5 rounded-lg flex items-center gap-2 border-gray-300">
            <Printer className="size-4" />
            Chop etish
          </Button>
          <Button variant="outlined" className="px-6 py-2.5 rounded-lg flex items-center gap-2 border-gray-300">
            <Download className="size-4" />
            Yuklab olish
          </Button>
        </div>
      </div>

      {/* Jadval */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Viloyat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ombor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shtrix kod</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tovar va materiallar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tovar turi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">O'lcham</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">O'lchov birligi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qoldiq soni</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qoldiq summa</th>
              </tr>
            </thead>
            <tbody>
              {/* Bo'sh holat */}
              <tr>
                <td colSpan={11} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Filter className="size-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Tovar va materiallar qoldig'i hisobotini shaklantirish uchun
                    </p>
                    <p className="text-blue-600 text-sm font-semibold">
                      "Shakllantirilish" tugmasini bosing
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GoodsMaterialsBalance;