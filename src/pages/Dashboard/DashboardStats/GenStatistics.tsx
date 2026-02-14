import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Mail, CheckCircle, Clock, XCircle } from 'lucide-react';

interface DashboardViewProps {
  hasAccess: (section: string) => boolean;
  initialView?: 'general' | 'employees';
}

// Ma'lumotlar
const monthlyData = [
  { name: 'Yan', bajarilgan: 240, bajarilmagan: 45, kechiktirilgan: 15 },
  { name: 'Fev', bajarilgan: 310, bajarilmagan: 38, kechiktirilgan: 12 },
  { name: 'Mar', bajarilgan: 420, bajarilmagan: 53, kechiktirilgan: 18 },
  { name: 'Apr', bajarilgan: 380, bajarilmagan: 42, kechiktirilgan: 14 },
  { name: 'May', bajarilgan: 450, bajarilmagan: 35, kechiktirilgan: 10 },
  { name: 'Iyun', bajarilgan: 520, bajarilmagan: 28, kechiktirilgan: 8 },
];

const pieData = [
  { name: 'Bajarilgan', value: 537, color: '#10B981', percentage: '87.2%' },
  { name: 'Bajarilmagan', value: 53, color: '#F97316', percentage: '8.6%' },
  { name: 'Kechiktirilgan', value: 26, color: '#EF4444', percentage: '4.2%' },
];

const StatCard = ({ icon: Icon, title, value, colorClass, bgColorClass, borderColorClass, iconBgColor }: any) => (
  <div className={`flex flex-col p-4 rounded-xl border ${borderColorClass} ${bgColorClass} flex-1 shadow-sm`}>
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-lg ${iconBgColor} text-white`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className={`text-[13px] font-bold ${colorClass}`}>{title}</span>
    </div>
    <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
  </div>
);

const GenStatistics: React.FC<DashboardViewProps> = ({ hasAccess, initialView = 'general' }) => {
  // Ruxsatni tekshirish
  if (!hasAccess('dashboard-statistics')) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 bg-gray-50/50">
      {/* Asosiy o'rab turuvchi Div - 3D chuqur soya bilan */}
      <div 
        className="w-[96%] bg-white p-8 rounded-[24px] border border-gray-100"
        style={{ 
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)' 
        }}
      >
        
        {/* Yuqori qism: Kartochkalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={Mail} 
            title="Jami xatlar" 
            value="616" 
            colorClass="text-[#1e3a8a]" 
            bgColorClass="bg-[#eff6ff]"
            borderColorClass="border-[#dbeafe]"
            iconBgColor="bg-[#3b82f6]"
          />
          <StatCard 
            icon={CheckCircle} 
            title="Bajarilgan" 
            value="537" 
            colorClass="text-[#064e3b]" 
            bgColorClass="bg-[#ecfdf5]"
            borderColorClass="border-[#d1fae5]"
            iconBgColor="bg-[#10b981]"
          />
          <StatCard 
            icon={Clock} 
            title="Bajarilmagan" 
            value="53" 
            colorClass="text-[#7c2d12]" 
            bgColorClass="bg-[#fff7ed]"
            borderColorClass="border-[#ffedd5]"
            iconBgColor="bg-[#f97316]"
          />
          <StatCard 
            icon={XCircle} 
            title="Kechiktirilgan" 
            value="26" 
            colorClass="text-[#7f1d1d]" 
            bgColorClass="bg-[#fef2f2]"
            borderColorClass="border-[#fee2e2]"
            iconBgColor="bg-[#ef4444]"
          />
        </div>

        {/* Pastki qism: Grafiklar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Oylik statistika */}
          <div 
            className="bg-white p-6 rounded-2xl border border-gray-100"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
          >
            <h3 className="text-lg font-bold mb-8 text-gray-800">Oylik statistika</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="rect" 
                    iconSize={14}
                    wrapperStyle={{ paddingTop: '30px' }}
                  />
                  <Bar dataKey="bajarilgan" name="Bajarilgan" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="bajarilmagan" name="Bajarilmagan" fill="#F97316" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="kechiktirilgan" name="Kechiktirilgan" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Umumiy taqsimot */}
          <div 
            className="bg-white p-6 rounded-2xl border border-gray-100 relative"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
          >
            <h3 className="text-lg font-bold mb-8 text-gray-800">Umumiy taqsimot</h3>
            <div className="h-[340px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="45%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Pie Chart yonidagi foiz ko'rsatkichlari */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-5 text-[13px] font-bold">
                {pieData.map((item, idx) => (
                  <div key={idx} style={{ color: item.color }} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    {item.name}: {item.percentage}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GenStatistics;
