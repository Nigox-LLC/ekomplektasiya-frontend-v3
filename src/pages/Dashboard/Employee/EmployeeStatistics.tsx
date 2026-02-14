import { Card, Tooltip } from 'antd';
import { BarChart, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, Eye, FileText, Mail, PieChart, UserIcon, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Bar, CartesianGrid, Cell, Legend, Pie, XAxis, YAxis } from 'recharts';


interface DashboardViewProps {
  hasAccess: (section: string) => boolean;
  initialView?: 'general' | 'employees';
}

interface TimelineStep {
  id: number;
  date: string;
  time: string;
  action: string;
  performer: string;
  status: 'completed' | 'pending' | 'delayed';
  comment?: string;
}

interface Letter {
  id: string;
  number: string;
  title: string;
  status: 'completed' | 'pending' | 'delayed';
  receivedDate: string;
  deadline: string;
  timeline: TimelineStep[];
}

interface Employee {
  id: number;
  name: string;
  position: string;
  completed: number;
  notCompleted: number;
  delayed: number;
  total: number;
  letters: Letter[];
}

// Mock xodimlar ma'lumotlari - ijro qadamlari bilan
const employeesData: Employee[] = [
  {
    id: 1,
    name: 'Aliyev Jamshid',
    position: "Bo'lim boshlig'i",
    completed: 142,
    notCompleted: 8,
    delayed: 6,
    total: 156,
    letters: [
      {
        id: '1234',
        number: 'XAT-2026/0234',
        title: 'Moliya hisoboti taqdim etish',
        status: 'completed',
        receivedDate: '10.02.2026',
        deadline: '15.02.2026',
        timeline: [
          { id: 1, date: '10.02.2026', time: '09:30', action: 'Xat qabul qilindi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 2, date: '10.02.2026', time: '14:20', action: 'Ko\'rib chiqildi', performer: 'Aliyev Jamshid', status: 'completed', comment: 'Moliya bo\'limiga yo\'naltirildi' },
          { id: 3, date: '12.02.2026', time: '11:00', action: 'Imzolandi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 4, date: '13.02.2026', time: '16:45', action: 'Yuborildi', performer: 'Karimov A.', status: 'completed' },
        ]
      },
      {
        id: '1235',
        number: 'XAT-2026/0235',
        title: 'Shartnoma loyihasi kelishish',
        status: 'pending',
        receivedDate: '11.02.2026',
        deadline: '18.02.2026',
        timeline: [
          { id: 1, date: '11.02.2026', time: '10:15', action: 'Xat qabul qilindi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 2, date: '12.02.2026', time: '09:00', action: 'Yuridik bo\'limga yuborildi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 3, date: '12.02.2026', time: '15:30', action: 'Ko\'rib chiqilmoqda', performer: 'Yuridik bo\'lim', status: 'pending' },
        ]
      },
      {
        id: '1236',
        number: 'XAT-2026/0236',
        title: 'Yillik reja tasdiqlanishi',
        status: 'delayed',
        receivedDate: '08.02.2026',
        deadline: '11.02.2026',
        timeline: [
          { id: 1, date: '08.02.2026', time: '08:45', action: 'Xat qabul qilindi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 2, date: '09.02.2026', time: '11:20', action: 'Qo\'shimcha ma\'lumot so\'raldi', performer: 'Aliyev Jamshid', status: 'completed', comment: 'Rejaga tuzatishlar kiritish kerak' },
          { id: 3, date: '12.02.2026', time: '14:00', action: 'Kutilmoqda (muddat o\'tgan)', performer: '-', status: 'delayed' },
        ]
      },
    ]
  },
  {
    id: 2,
    name: 'Karimov Aziz',
    position: 'Bosh mutaxassis',
    completed: 75,
    notCompleted: 10,
    delayed: 4,
    total: 89,
    letters: [
      {
        id: '2101',
        number: 'XAT-2026/0401',
        title: 'Texnik hujjatlar tayyorlash',
        status: 'completed',
        receivedDate: '09.02.2026',
        deadline: '14.02.2026',
        timeline: [
          { id: 1, date: '09.02.2026', time: '10:00', action: 'Topshiriq olindi', performer: 'Karimov Aziz', status: 'completed' },
          { id: 2, date: '10.02.2026', time: '16:30', action: 'Hujjatlar tayyorlandi', performer: 'Karimov Aziz', status: 'completed' },
          { id: 3, date: '11.02.2026', time: '09:15', action: 'Tekshirildi va tasdiqlandi', performer: 'Aliyev Jamshid', status: 'completed' },
        ]
      },
      {
        id: '2102',
        number: 'XAT-2026/0402',
        title: 'Loyiha tahlili',
        status: 'pending',
        receivedDate: '11.02.2026',
        deadline: '16.02.2026',
        timeline: [
          { id: 1, date: '11.02.2026', time: '14:20', action: 'Topshiriq olindi', performer: 'Karimov Aziz', status: 'completed' },
          { id: 2, date: '12.02.2026', time: '10:00', action: 'Tahlil jarayonida', performer: 'Karimov Aziz', status: 'pending' },
        ]
      },
    ]
  },
  {
    id: 3,
    name: 'Nazarova Dilnoza',
    position: 'Yetakchi mutaxassis',
    completed: 108,
    notCompleted: 12,
    delayed: 4,
    total: 124,
    letters: [
      {
        id: '3201',
        number: 'XAT-2026/0501',
        title: 'Kadrlar bo\'yicha hisobot',
        status: 'completed',
        receivedDate: '07.02.2026',
        deadline: '12.02.2026',
        timeline: [
          { id: 1, date: '07.02.2026', time: '11:00', action: 'Vazifa belgilandi', performer: 'Nazarova Dilnoza', status: 'completed' },
          { id: 2, date: '09.02.2026', time: '15:45', action: 'Hisobot shakllandi', performer: 'Nazarova Dilnoza', status: 'completed' },
          { id: 3, date: '11.02.2026', time: '10:30', action: 'Imzolandi', performer: 'Aliyev Jamshid', status: 'completed' },
          { id: 4, date: '11.02.2026', time: '16:00', action: 'Yuqori tashkilotga yuborildi', performer: 'Nazarova Dilnoza', status: 'completed' },
        ]
      },
    ]
  },
  {
    id: 4,
    name: 'Rahimova Malika',
    position: 'Mutaxassis',
    completed: 58,
    notCompleted: 6,
    delayed: 3,
    total: 67,
    letters: []
  },
  {
    id: 5,
    name: 'Toshmatov Jasur',
    position: 'Yetakchi mutaxassis',
    completed: 89,
    notCompleted: 10,
    delayed: 4,
    total: 103,
    letters: []
  },
  {
    id: 6,
    name: 'Abdullayev Sanjar',
    position: 'Mutaxassis',
    completed: 65,
    notCompleted: 7,
    delayed: 5,
    total: 77,
    letters: []
  },
];

// Umumiy statistika uchun oylik ma'lumot
const monthlyData = [
  { oy: 'Yan', bajarilgan: 245, bajarilmagan: 45, kechiktirilgan: 15 },
  { oy: 'Fev', bajarilgan: 312, bajarilmagan: 38, kechiktirilgan: 12 },
  { oy: 'Mar', bajarilgan: 428, bajarilmagan: 52, kechiktirilgan: 18 },
  { oy: 'Apr', bajarilgan: 389, bajarilmagan: 41, kechiktirilgan: 14 },
  { oy: 'May', bajarilgan: 456, bajarilmagan: 34, kechiktirilgan: 10 },
  { oy: 'Iyun', bajarilgan: 521, bajarilmagan: 29, kechiktirilgan: 8 },
];

const EmployeeStatistics: React.FC<DashboardViewProps> = ({ hasAccess, initialView }) => {

  const [selectedView, setSelectedView] = useState<'general' | 'employees'>(initialView || 'general');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  // initialView o'zgarganda selectedView ni yangilash
  useEffect(() => {
    if (initialView) {
      setSelectedView(initialView);
    }
  }, [initialView]);

  const employeesPerPage = 3;
  const totalPages = Math.ceil(employeesData.length / employeesPerPage);

  // Avtomatik almashinish
  useEffect(() => {
    if (!isAutoPlay || selectedView !== 'employees') return;

    const interval = setInterval(() => {
      setCurrentPageIndex((prev) => 
        prev === totalPages - 1 ? 0 : prev + 1
      );
    }, 5000); // 5 sekundda bir marta

    return () => clearInterval(interval);
  }, [isAutoPlay, selectedView, totalPages]);

  // Umumiy statistika
  const totalLetters = employeesData.reduce((sum, emp) => sum + emp.total, 0);
  const totalCompleted = employeesData.reduce((sum, emp) => sum + emp.completed, 0);
  const totalNotCompleted = employeesData.reduce((sum, emp) => sum + emp.notCompleted, 0);
  const totalDelayed = employeesData.reduce((sum, emp) => sum + emp.delayed, 0);

  const pieData = [
    { name: 'Bajarilgan', value: totalCompleted, color: '#10b981' },
    { name: 'Bajarilmagan', value: totalNotCompleted, color: '#f97316' },
    { name: 'Kechiktirilgan', value: totalDelayed, color: '#ef4444' },
  ];

  const handlePrevEmployee = () => {
    setIsAutoPlay(false);
    setCurrentPageIndex((prev) => 
      prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  const handleNextEmployee = () => {
    setIsAutoPlay(false);
    setCurrentPageIndex((prev) => 
      prev === totalPages - 1 ? 0 : prev + 1
    );
  };

  const currentEmployees = employeesData.slice(
    currentPageIndex * employeesPerPage,
    (currentPageIndex + 1) * employeesPerPage
  );

    return (
      <div className="space-y-6">
        {/* Header */}
        {/* UMUMIY STATISTIKA - faqat ruxsat bor bo'lsa */}
        {selectedView === 'general' && hasAccess('dashboard-statistics') && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-8">
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Asosiy ko'rsatkichlar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="size-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-blue-700">Jami xatlar</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{totalLetters}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="size-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-green-700">Bajarilgan</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{totalCompleted}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="size-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-orange-700">Bajarilmagan</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{totalNotCompleted}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <XCircle className="size-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-red-700">Kechiktirilgan</p>
                  </div>
                  <p className="text-3xl font-bold text-red-900">{totalDelayed}</p>
                </div>
              </div>

              {/* Grafiklar */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card className="p-5 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Oylik statistika</h4>
                  <div className="h-64">
                    <div className='w-full h-full'>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="oy" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bajarilgan" name="Bajarilgan" fill="#10b981" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="bajarilmagan" name="Bajarilmagan" fill="#f97316" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="kechiktirilgan" name="Kechiktirilgan" fill="#ef4444" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </div>
                  </div>
                </Card>

                {/* Pie Chart */}
                <Card className="p-5 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Umumiy taqsimot</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className='w-full h-full'>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* XODIMLAR STATISTIKASI - faqat ruxsat bor bo'lsa */}
        {selectedView === 'employees' && hasAccess('dashboard-employee-stats') && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-8">
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 text-right">Ijro statistikasi</h4>
                <div className="flex items-center gap-3">
                  {/* Pagination dots */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentPageIndex
                          ? 'w-10 bg-purple-600'
                          : 'w-2 bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentPageIndex + 1} / {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevEmployee}
                      className="p-2 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg transition-all"
                      title="Oldingi sahifa"
                    >
                      <ChevronLeft className="size-5 text-purple-600" />
                    </button>
                    <button
                      onClick={handleNextEmployee}
                      className="p-2 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg transition-all"
                      title="Keyingi sahifa"
                    >
                      <ChevronRight className="size-5 text-purple-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Xodimlar - 3 ta gorizontal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {currentEmployees.map((employee) => {
                  const completionRate = ((employee.completed / employee.total) * 100).toFixed(1);
                  return (
                    <div key={employee.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                      {/* Avatar va FIO */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl mb-3">
                          <span className="text-2xl font-bold text-white">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 text-center">{employee.name}</h4>
                        <p className="text-sm text-gray-600 text-center">{employee.position}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700">Bajarish</span>
                          <span className="text-sm font-bold text-purple-600">{completionRate}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Filterlar - VERTIKAL */}
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="size-4 text-blue-600" />
                            <p className="text-xs font-semibold text-blue-700">Jami xatlar</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">{employee.total}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="size-4 text-green-600" />
                            <p className="text-xs font-semibold text-green-700">Bajarilgan</p>
                          </div>
                          <p className="text-2xl font-bold text-green-900">{employee.completed}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border-2 border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="size-4 text-orange-600" />
                            <p className="text-xs font-semibold text-orange-700">Bajarilmagan</p>
                          </div>
                          <p className="text-2xl font-bold text-orange-900">{employee.notCompleted}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border-2 border-red-200">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="size-4 text-red-600" />
                            <p className="text-xs font-semibold text-red-700">Kechiktirilgan</p>
                          </div>
                          <p className="text-2xl font-bold text-red-900">{employee.delayed}</p>
                        </div>
                      </div>

                      {/* Batafsil ko'rish tugmasi */}
                      {employee.letters.length > 0 && (
                        <button
                          onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}
                          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-md"
                        >
                          <Eye className="size-4" />
                          <span className="text-sm font-semibold">{expandedEmployee === employee.id ? 'Yashirish' : 'Batafsil ko\'rish'}</span>
                          {expandedEmployee === employee.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                      )}

                      {/* Xodim xatlari ro'yxati */}
                      {expandedEmployee === employee.id && employee.letters.length > 0 && (
                        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                          <div className="border-t-2 border-purple-200 pt-4">
                            <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="size-4 text-purple-600" />
                              Oxirgi xatlar ({employee.letters.length} ta)
                            </h5>
                            {employee.letters.map((letter) => (
                              <div key={letter.id} className="mb-3 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                                {/* Xat sarlavhasi */}
                                <button
                                  onClick={() => setExpandedLetter(expandedLetter === letter.id ? null : letter.id)}
                                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${letter.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        letter.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                                          'bg-red-100 text-red-700'
                                        }`}>
                                        {letter.number}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900">{letter.title}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-gray-500">Qabul: {letter.receivedDate}</span>
                                      <span className="text-xs text-gray-500">Muddat: {letter.deadline}</span>
                                    </div>
                                  </div>
                                  {expandedLetter === letter.id ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
                                </button>

                                {/* Timeline - Ijro qadamlari */}
                                {expandedLetter === letter.id && (
                                  <div className="px-3 pb-3 bg-gray-50 animate-in slide-in-from-top-1 duration-200">
                                    <div className="border-l-2 border-indigo-300 pl-4 py-2 space-y-3">
                                      {letter.timeline.map((step, index) => (
                                        <div key={step.id} className="relative">
                                          {/* Timeline dot */}
                                          <div className={`absolute -left-[22px] w-4 h-4 rounded-full border-2 ${step.status === 'completed' ? 'bg-green-500 border-green-600' :
                                            step.status === 'pending' ? 'bg-blue-500 border-blue-600' :
                                              'bg-red-500 border-red-600'
                                            }`}></div>

                                          {/* Step ma'lumotlari */}
                                          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                            <div className="flex items-start justify-between mb-1">
                                              <div className="flex-1">
                                                <p className={`text-xs font-bold ${step.status === 'completed' ? 'text-green-700' :
                                                  step.status === 'pending' ? 'text-blue-700' :
                                                    'text-red-700'
                                                  }`}>
                                                  {step.action}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <UserIcon className="size-3 text-gray-500" />
                                                  <span className="text-xs text-gray-600">{step.performer}</span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-xs text-gray-500">{step.date}</p>
                                                <p className="text-xs text-gray-400">{step.time}</p>
                                              </div>
                                            </div>
                                            {step.comment && (
                                              <p className="text-xs text-gray-600 italic mt-1 bg-gray-50 p-1 rounded">
                                                💬 {step.comment}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Avtomatik almashinish indikatori */}
              {isAutoPlay && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  export default EmployeeStatistics