import React from 'react';
import { Search, Filter, Download, Plus, FileText, Calendar, Building2, Eye, Edit2, Trash2 } from 'lucide-react';

const Contracts = () => {
  const quarters = [
    { id: 1, label: 'I chorak', months: 'Yan-Mar', count: 2, active: true },
    { id: 2, label: 'II chorak', months: 'Apr-Iyun', count: 2, active: false },
    { id: 3, label: 'III chorak', months: 'Iyul-Sen', count: 2, active: false },
    { id: 4, label: 'IV chorak', months: 'Okt-Dek', count: 2, active: false },
  ];

  const stats = [
    { label: 'Jami shartnomalar', value: '8', color: 'text-black' },
    { label: 'Faol shartnomalar', value: '6', color: 'text-green-600' },
    { label: 'Tugagan shartnomalar', value: '0', color: 'text-red-600' },
    { label: 'Jami summa', value: "450 000 000 so'm", color: 'text-purple-600' },
  ];

  const data = [
    {
      id: 1,
      number: 'SH-2026-001',
      date: '15.01.2026',
      contractor: "O'zbekiston Respublikasi Moliya vazirligi",
      responsible: 'Karimov A.R.',
      subject: 'Ofis jihozlari yetkazib berish',
      amount: '50 000 000',
      period: '20.01.2026 - 20.12.2026',
      status: 'Faol',
    },
    {
      id: 2,
      number: 'SH-2026-002',
      date: '22.01.2026',
      contractor: 'Xorazm viloyati hokimligi',
      responsible: 'Nazarov B.A.',
      subject: "Kompyuter texnikasi ta'mirlash xizmatlari",
      amount: '25 000 000',
      period: '01.02.2026 - 31.12.2026',
      status: 'Faol',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shartnomalar</h1>
          <p className="text-sm text-gray-500">Tuzilgan shartnomalar ro'yxati</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            Yangi shartnoma
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Shartnoma raqami, kontragent, mavzu bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Quarters Section */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-800 mb-3">Chorak bo'yicha</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quarters.map((q) => (
            <div
              key={q.id}
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                q.active ? 'bg-blue-50/30 border-blue-500' : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {q.active && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{q.id}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{q.label}</p>
                  <p className="text-[10px] text-gray-400">{q.months}</p>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-4">{q.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-12 text-center">№</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shartnoma raqami</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shartnoma sanasi</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kontragent</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shartnoma mavzusi</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Summa (so'm)</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amal qilish muddati</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Holati</th>
                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-5 text-xs text-gray-500 text-center">{index + 1}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                      <FileText size={14} />
                      <span>{item.number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-start gap-2">
                      <Building2 size={14} className="text-gray-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 leading-tight">{item.contractor}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">Mas'ul: {item.responsible}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-xs text-slate-600">{item.subject}</td>
                  <td className="px-4 py-5 text-xs font-bold text-slate-800">{item.amount}</td>
                  <td className="px-4 py-5 text-[11px] text-slate-600">{item.period}</td>
                  <td className="px-4 py-5">
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-md border border-green-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center gap-3">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-500 hover:text-green-700 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">Jami 2 ta shartnoma</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Oldingi</button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-medium rounded-lg">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100 rounded-lg transition-colors">2</button>
          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Keyingi</button>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
3