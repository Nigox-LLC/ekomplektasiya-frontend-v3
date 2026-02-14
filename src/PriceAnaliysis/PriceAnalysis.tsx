import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit2, 
  Download, 
  Trash2, 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  User
} from 'lucide-react';

// Types
interface AnalysisItem {
  id: string;
  title: string;
  status: 'Kutilmoqda' | 'Ko\'rib chiqilmoqda' | 'Tasdiqlangan';
  docNumber: string;
  organization: string;
  totalSum: string;
  productsCount: number;
  arrivalDate: string;
  deadlineDate: string;
  responsible: string;
  trend?: 'up' | 'down';
}

const PriceAnalysis: React.FC = () => {
  const stats = [
    { label: 'Jami hujjatlar', value: 8, icon: <FileText className="w-5 h-5 text-white" />, textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', iconBg: 'bg-blue-500' },
    { label: 'Kutilmoqda', value: 2, icon: <Clock className="w-5 h-5 text-white" />, textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', iconBg: 'bg-yellow-500' },
    { label: 'Tasdiqlangan', value: 3, icon: <CheckCircle className="w-5 h-5 text-white" />, textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300', iconBg: 'bg-green-500' },
    { label: 'Umumiy qiymat', value: '563.2M so\'m', icon: <DollarSign className="w-5 h-5 text-white" />, textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', iconBg: 'bg-purple-500' },
  ];

  const data: AnalysisItem[] = [
    {
      id: '1',
      title: 'Kompyuter texnikasi xarid qilish narx tahlili',
      status: 'Kutilmoqda',
      docNumber: 'NT-2024/0145',
      organization: 'IT Service Group LLC',
      totalSum: '125.00 M so\'m',
      productsCount: 15,
      arrivalDate: '28 yan 2026',
      deadlineDate: '05 fev 2026',
      responsible: 'Karimov A.B.',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Ofis mebellari ta\'minoti narx tahlili',
      status: 'Ko\'rib chiqilmoqda',
      docNumber: 'NT-2024/0144',
      organization: 'Comfort Mebel',
      totalSum: '45.00 M so\'m',
      productsCount: 8,
      arrivalDate: '27 yan 2026',
      deadlineDate: '03 fev 2026',
      responsible: 'Rahimova Z.S.',
      trend: 'down'
    },
    {
      id: '3',
      title: 'Xo\'jalik mollari xarid qilish narx tahlili',
      status: 'Tasdiqlangan',
      docNumber: 'NT-2024/0143',
      organization: 'Yagona Ta\'minot',
      totalSum: '12.50 M so\'m',
      productsCount: 24,
      arrivalDate: '25 yan 2026',
      deadlineDate: '01 fev 2026',
      responsible: 'Usmonov D.R.'
    },
    {
      id: '1',
      title: 'Kompyuter texnikasi xarid qilish narx tahlili',
      status: 'Kutilmoqda',
      docNumber: 'NT-2024/0145',
      organization: 'IT Service Group LLC',
      totalSum: '125.00 M so\'m',
      productsCount: 15,
      arrivalDate: '28 yan 2026',
      deadlineDate: '05 fev 2026',
      responsible: 'Karimov A.B.',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Ofis mebellari ta\'minoti narx tahlili',
      status: 'Ko\'rib chiqilmoqda',
      docNumber: 'NT-2024/0144',
      organization: 'Comfort Mebel',
      totalSum: '45.00 M so\'m',
      productsCount: 8,
      arrivalDate: '27 yan 2026',
      deadlineDate: '03 fev 2026',
      responsible: 'Rahimova Z.S.',
      trend: 'down'
    },
    {
      id: '3',
      title: 'Xo\'jalik mollari xarid qilish narx tahlili',
      status: 'Tasdiqlangan',
      docNumber: 'NT-2024/0143',
      organization: 'Yagona Ta\'minot',
      totalSum: '12.50 M so\'m',
      productsCount: 24,
      arrivalDate: '25 yan 2026',
      deadlineDate: '01 fev 2026',
      responsible: 'Usmonov D.R.'
    },{
      id: '1',
      title: 'Kompyuter texnikasi xarid qilish narx tahlili',
      status: 'Kutilmoqda',
      docNumber: 'NT-2024/0145',
      organization: 'IT Service Group LLC',
      totalSum: '125.00 M so\'m',
      productsCount: 15,
      arrivalDate: '28 yan 2026',
      deadlineDate: '05 fev 2026',
      responsible: 'Karimov A.B.',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Ofis mebellari ta\'minoti narx tahlili',
      status: 'Ko\'rib chiqilmoqda',
      docNumber: 'NT-2024/0144',
      organization: 'Comfort Mebel',
      totalSum: '45.00 M so\'m',
      productsCount: 8,
      arrivalDate: '27 yan 2026',
      deadlineDate: '03 fev 2026',
      responsible: 'Rahimova Z.S.',
      trend: 'down'
    },
    {
      id: '3',
      title: 'Xo\'jalik mollari xarid qilish narx tahlili',
      status: 'Tasdiqlangan',
      docNumber: 'NT-2024/0143',
      organization: 'Yagona Ta\'minot',
      totalSum: '12.50 M so\'m',
      productsCount: 24,
      arrivalDate: '25 yan 2026',
      deadlineDate: '01 fev 2026',
      responsible: 'Usmonov D.R.'
    },{
      id: '1',
      title: 'Kompyuter texnikasi xarid qilish narx tahlili',
      status: 'Kutilmoqda',
      docNumber: 'NT-2024/0145',
      organization: 'IT Service Group LLC',
      totalSum: '125.00 M so\'m',
      productsCount: 15,
      arrivalDate: '28 yan 2026',
      deadlineDate: '05 fev 2026',
      responsible: 'Karimov A.B.',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Ofis mebellari ta\'minoti narx tahlili',
      status: 'Ko\'rib chiqilmoqda',
      docNumber: 'NT-2024/0144',
      organization: 'Comfort Mebel',
      totalSum: '45.00 M so\'m',
      productsCount: 8,
      arrivalDate: '27 yan 2026',
      deadlineDate: '03 fev 2026',
      responsible: 'Rahimova Z.S.',
      trend: 'down'
    },
    {
      id: '3',
      title: 'Xo\'jalik mollari xarid qilish narx tahlili',
      status: 'Tasdiqlangan',
      docNumber: 'NT-2024/0143',
      organization: 'Yagona Ta\'minot',
      totalSum: '12.50 M so\'m',
      productsCount: 24,
      arrivalDate: '25 yan 2026',
      deadlineDate: '01 fev 2026',
      responsible: 'Usmonov D.R.'
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Kutilmoqda': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Ko\'rib chiqilmoqda': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Tasdiqlangan': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    /* 
      Main Container: 
      h-screen va overflow-hidden orqali butun sahifa scroll bo'lishini to'xtatamiz.
      Faqat o'ng tarafdagi kontent qismi scroll bo'ladi.
    */
    <div className="h-screen flex overflow-hidden bg-gray-50 font-sans">
      
      {/* 
        Bu yerda Sidebar bo'lishi kerak (fonda qoladi). 
        Asosiy kontent qismi:
      */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Scroll bo'ladigan qism */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Narx tahlil</h1>
              <p className="text-sm text-gray-500">Narx tahlil hujjatlari ro'yxati va boshqaruv</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Yangi narx tahlil</span>
            </button>
          </div>

          {/* Stats Cards - Borderlar rasmga moslab qalinlashtirildi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className={`${stat.bgColor} p-6 rounded-xl border-2 ${stat.borderColor} flex flex-col justify-between h-32 relative overflow-hidden shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div className={`${stat.iconBg} p-2 rounded-lg bg-opacity-20`}>
                    {stat.icon}
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Qidiruv (raqam, mavzu, tashkilot)..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none">
                <option>Barcha holatlar</option>
                <option>Kutilmoqda</option>
                <option>Tasdiqlangan</option>
              </select>
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Filtr</span>
              </button>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex">
                {/* Left Accent Border */}
                <div className={`w-1.5 ${
                  item.status === 'Kutilmoqda' ? 'bg-yellow-400' : 
                  item.status === 'Ko\'rib chiqilmoqda' ? 'bg-blue-400' : 'bg-green-400'
                }`} />
                
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1 ${getStatusStyles(item.status)}`}>
                            {item.status === 'Kutilmoqda' && <Clock className="w-3 h-3" />}
                            {item.status === 'Ko\'rib chiqilmoqda' && <Eye className="w-3 h-3" />}
                            {item.status === 'Tasdiqlangan' && <CheckCircle className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Hujjat raqami</span>
                            <span className="font-medium text-gray-700">{item.docNumber}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tashkilot</span>
                            <span className="font-medium text-gray-700">{item.organization}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Rangli qilib o'zgartirildi */}
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 shadow-sm" title="Ko'rish">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-100 shadow-sm" title="Tahrirlash">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100 shadow-sm" title="Yuklab olish">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shadow-sm" title="O'chirish">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Kelgan: <span className="text-gray-700 font-medium">{item.arrivalDate}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Muddat: <span className="text-gray-700 font-medium">{item.deadlineDate}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>Mas'ul: <span className="text-gray-700 font-medium">{item.responsible}</span></span>
                    </div>
                    <div className="flex justify-end gap-12">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 uppercase font-semibold">Jami summa</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">{item.totalSum}</span>
                          {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                          {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 uppercase font-semibold">Mahsulotlar</span>
                        <span className="font-bold text-gray-900">{item.productsCount} ta</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;
