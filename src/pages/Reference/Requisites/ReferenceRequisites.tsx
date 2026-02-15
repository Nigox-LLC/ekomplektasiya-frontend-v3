import React from 'react';
import { Search, Filter, Download, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ReferenceRequisites = () => {
  const stats = [
    { label: 'Jami tashkilotlar', value: '5', color: 'text-black' },
    { label: 'Davlat tashkilotlari', value: '1', color: 'text-blue-600' },
    { label: 'Hududiy tashkilotlar', value: '4', color: 'text-green-600' },
    { label: 'Aktiv rekvizitlar', value: '5', color: 'text-purple-600' },
  ];

  const data = [
    {
      id: 1,
      name: "O'ZBEKISTON RESPUBLIKASI",
      email: 'info@gov.uz',
      bankruptcy: 'YO\'Q',
      leader: 'Karimov Aziz Rustamovich',
      phone: '+998 71 202 03 03',
      type: 'Davlat boshqaruvi',
      inn: '123456789',
    },
    {
      id: 2,
      name: 'XORAZM VILOYATI HOKIMLIGI',
      email: 'info@khorezm.uz',
      bankruptcy: 'YO\'Q',
      leader: 'Nazarov Botir Anvarovich',
      phone: '+998 62 224 50 50',
      type: 'Hududiy boshqaruv',
      inn: '200123456',
    },
    {
      id: 3,
      name: 'TOSHKENT SHAHAR HOKIMLIGI',
      email: 'info@tashkent.uz',
      bankruptcy: 'YO\'Q',
      leader: 'Jahongir Artikhodjayev',
      phone: '+998 71 239 12 34',
      type: 'Shahar boshqaruvi',
      inn: '300456789',
    },
    {
      id: 4,
      name: 'SAMARQAND VILOYATI HOKIMLIGI',
      email: 'info@samarkand.uz',
      bankruptcy: 'YO\'Q',
      leader: 'Erkinov Sherzodbek',
      phone: '+998 66 235 67 89',
      type: 'Hududiy boshqaruv',
      inn: '400789123',
    },
    {
      id: 5,
      name: 'BUXORO VILOYATI HOKIMLIGI',
      email: 'info@bukhara.uz',
      bankruptcy: 'YO\'Q',
      leader: 'Shodmonov Uktam',
      phone: '+998 65 224 11 22',
      type: 'Hududiy boshqaruv',
      inn: '500321654',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rekvizitlar</h1>
          <p className="text-sm text-gray-500">Tashkilotlar rekvizitlari ro'yxati</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            Yangi rekvizit
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tashkilot nomi, direktor, INN bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-12 text-center">№</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tashkilot nomi</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bankrotlik ma'lumoti</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rahbar</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Telefon</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Faoliyat turi</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">INN</th>
                <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-5 text-sm text-gray-500 text-center">{index + 1}</td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 leading-tight">{item.name}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{item.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md border border-green-100">
                      {item.bankruptcy}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-slate-700">{item.leader}</td>
                  <td className="px-4 py-5 text-sm text-slate-700">{item.phone}</td>
                  <td className="px-4 py-5 text-sm text-slate-700">{item.type}</td>
                  <td className="px-4 py-5 text-sm font-medium text-slate-800">{item.inn}</td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center gap-3">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors">
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
        <p className="text-sm text-gray-500">Jami 5 ta tashkilot</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Oldingi</button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-medium rounded-lg">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100 rounded-lg transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100 rounded-lg transition-colors">3</button>
          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Keyingi</button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceRequisites;
