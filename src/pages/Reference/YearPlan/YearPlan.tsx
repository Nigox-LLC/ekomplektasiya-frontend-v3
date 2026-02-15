import React from 'react';
import { Printer, Download, Plus, Trash2, FileText } from 'lucide-react';

const YearPlan = () => {
  const data = [
    {
      id: 1,
      quarter: 'I chorak',
      type: 'Kompyuter texnikasi',
      name: 'Lenovo ThinkPad E15',
      model: 'ThinkPad E15 Gen 3',
      size: '15.6"',
      unit: 'dona',
      district: "Bog'ot tumani",
      quantity: 5,
      total: '40 000 000',
      note: 'Xodimlar uchun',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Blue Header Banner */}
      <div className="bg-blue-600 rounded-2xl p-8 mb-6 flex justify-between items-center shadow-lg shadow-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">2027 yil uchun Yillik reja</h1>
          <p className="text-blue-100 text-sm">Xarajatlar yillik rejasi - Tovarlar va materiallar</p>
        </div>
        <div className="bg-amber-400 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm cursor-pointer hover:bg-amber-500 transition-colors">
          <FileText size={18} />
          Qoralama
        </div>
      </div>

      {/* Year Selection and Actions */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Yilni tanlang</label>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
            <option>2027 yil</option>
            <option>2026 yil</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Printer size={16} />
            Chop etish
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Yuklab olish
          </button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-slate-800">2027 yil reja</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-10 text-center border-r border-gray-100">№</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Chorak</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Tovar turi</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Tovar nomi</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Modeli</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">O'lchami</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">O'lchov birligi</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Tuman</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100 text-center">Miqdor</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100 text-center">Jami</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Izoh</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-4 text-xs text-gray-500 text-center border-r border-gray-50">{item.id}</td>
                  <td className="px-4 py-4 border-r border-gray-50">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">
                      {item.quarter}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600 border-r border-gray-50">{item.type}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-800 border-r border-gray-50">{item.name}</td>
                  <td className="px-4 py-4 text-xs text-slate-600 border-r border-gray-50">{item.model}</td>
                  <td className="px-4 py-4 text-xs text-slate-600 border-r border-gray-50">{item.size}</td>
                  <td className="px-4 py-4 text-xs text-slate-600 border-r border-gray-50">{item.unit}</td>
                  <td className="px-4 py-4 text-xs text-slate-600 border-r border-gray-50">{item.district}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-800 text-center border-r border-gray-50">{item.quantity}</td>
                  <td className="px-4 py-4 text-xs font-bold text-blue-700 text-center border-r border-gray-50">{item.total}</td>
                  <td className="px-4 py-4 text-xs text-slate-500 border-r border-gray-50 italic">{item.note}</td>
                  <td className="px-4 py-4 text-center">
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-blue-50/30 font-bold">
                <td colSpan={9} className="px-4 py-3 text-right text-xs uppercase tracking-wider text-slate-700">Jami summa:</td>
                <td colSpan={3} className="px-4 py-3 text-blue-700 text-sm">40 000 000 so'm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Products Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-green-50/50 flex justify-between items-center border-b border-green-100">
          <h2 className="text-sm font-bold text-slate-800">Yangi mahsulotlar qo'shish</h2>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">
            <Plus size={14} />
            Qator qo'shish
          </button>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-gray-400">
          <p className="text-sm">Mahsulot qo'shish uchun "Qator qo'shish" tugmasini bosing</p>
        </div>
      </div>
    </div>
  );
};

export default YearPlan;
