import dashboardBg from '@/assets/dashboardBg.png';
import { Card } from 'antd';
import { User, FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  userName: string;
  userPosition: string;
}

// Oylik ish hajmi grafigi
const monthlyWorkData = [
  { oy: 'Yan', qiymat: 45 },
  { oy: 'Fev', qiymat: 52 },
  { oy: 'Mar', qiymat: 48 },
  { oy: 'Apr', qiymat: 61 },
  { oy: 'May', qiymat: 55 },
  { oy: 'Iyun', qiymat: 67 },
  { oy: 'Iyul', qiymat: 58 },
  { oy: 'Avg', qiymat: 72 },
  { oy: 'Sen', qiymat: 65 },
  { oy: 'Okt', qiymat: 78 },
  { oy: 'Noy', qiymat: 70 },
  { oy: 'Dek', qiymat: 85 },
];

const Dashboard: React.FC<DashboardProps> = ({ userName, userPosition }) => {
  // Hozirgi vaqt
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Xayrli tong' : currentHour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1f44 0%, #1e3a5f 50%, #0d2847 100%)',
      }}
    >
      {/* Fon rasm */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
        }}
      />

      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-md border border-orange-400/30 rounded-full mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="size-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent tracking-wide">
              RAQAMLI NAZORAT
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Elektron hujjat ijrosi tizimi</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left - User Profile */}
          <Card className="bg-gradient-to-br! from-cyan-900/40 to-blue-900/40 backdrop-blur-xl border-2 border-cyan-500/30 p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-cyan-300 mb-4">XODIM PROFILI</h3>
              
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-cyan-300/50">
                  <User className="size-16 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-cyan-900 flex items-center justify-center">
                  <CheckCircle className="size-5 text-white" />
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">{userName}</h4>
              <p className="text-cyan-300 mb-4">{userPosition}</p>
              <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/50 rounded-full">
                <p className="text-sm text-green-300 font-semibold">Ish Unumdorligi: 85%</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="bg-cyan-800/30 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3 hover:bg-cyan-700/30 transition-all cursor-pointer">
                <FileText className="size-5 text-cyan-400" />
                <span className="text-sm text-cyan-100 font-semibold">MENING VAZIFALARIM</span>
              </div>
              <div className="bg-cyan-800/30 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3 hover:bg-cyan-700/30 transition-all cursor-pointer">
                <Clock className="size-5 text-cyan-400" />
                <span className="text-sm text-cyan-100 font-semibold">SO'NGGI XABARLAR</span>
              </div>
              <div className="bg-cyan-800/30 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3 hover:bg-cyan-700/30 transition-all cursor-pointer">
                <User className="size-5 text-cyan-400" />
                <span className="text-sm text-cyan-100 font-semibold">PARAMETRLAR</span>
              </div>
            </div>
          </Card>

          {/* Center - Activity Stats */}
          <Card className="bg-gradient-to-br! from-blue-900/40 to-indigo-900/40 backdrop-blur-xl border-2 border-blue-500/30 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-cyan-300 mb-6 text-center">FAOLIYAT KO'RSATKICHLARI</h3>
            
            {/* Circular Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Bajarilgan */}
              <div className="text-center">
                <div className="relative inline-block mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="#06b6d4" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * 92) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-300">92%</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-200 font-semibold">Bajarilgan</p>
              </div>

              {/* Reyting */}
              <div className="text-center">
                <div className="relative inline-block mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="#06b6d4" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * 94) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-300">4.7/5</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-200 font-semibold">Reyting</p>
              </div>

              {/* Kun */}
              <div className="text-center">
                <div className="relative inline-block mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="#ef4444" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * 10) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">3</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-200 font-semibold">Kun</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4">
              <h4 className="text-sm font-bold text-cyan-300 mb-3 text-center">Oylik Ish Hajmi</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyWorkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                    <XAxis 
                      dataKey="oy" 
                      tick={{ fill: '#67e8f9', fontSize: 11 }}
                      stroke="rgba(6, 182, 212, 0.3)"
                    />
                    <YAxis 
                      tick={{ fill: '#67e8f9', fontSize: 11 }}
                      stroke="rgba(6, 182, 212, 0.3)"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(8, 47, 73, 0.95)', 
                        border: '1px solid rgba(6, 182, 212, 0.5)',
                        borderRadius: '8px',
                        color: '#67e8f9'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="qiymat" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Right - Quick Info */}
          <Card className="bg-gradient-to-br! from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-indigo-500/30 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-cyan-300 mb-6 text-center">TEZKOR XABARLAR</h3>
            
            <div className="space-y-4">
              {/* Xabar 1 */}
              <div className="bg-indigo-800/30 border-l-4 border-orange-500 rounded-lg p-4 hover:bg-indigo-700/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Yangi vazifa: "Ustaxona tahliloti"</p>
                    <p className="text-xs text-cyan-200">(ID: 789)</p>
                  </div>
                </div>
              </div>

              {/* Xabar 2 */}
              <div className="bg-indigo-800/30 border-l-4 border-red-500 rounded-lg p-4 hover:bg-indigo-700/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Muddati sinfmada: Esrtdan larda</p>
                    <p className="text-xs text-cyan-200">Ertaga soat 10:00</p>
                  </div>
                </div>
              </div>

              {/* Xabar 3 */}
              <div className="bg-indigo-800/30 border-l-4 border-green-500 rounded-lg p-4 hover:bg-indigo-700/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Tasdiq yakunlandi: Tasdig 10:00</p>
                    <p className="text-xs text-cyan-200">muvddizh yakunlandi</p>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-cyan-500/30 my-4" />

              {/* Resources */}
              <h4 className="text-sm font-bold text-cyan-300 mb-3 text-center">RESURSLAR</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-800/30 border border-cyan-500/30 rounded-lg p-3 text-center hover:bg-indigo-700/30 transition-all cursor-pointer">
                  <FileText className="size-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-cyan-200 font-semibold">Qollanmalar</p>
                </div>
                <div className="bg-indigo-800/30 border border-cyan-500/30 rounded-lg p-3 text-center hover:bg-indigo-700/30 transition-all cursor-pointer">
                  <TrendingUp className="size-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-cyan-200 font-semibold">O'quv Material</p>
                </div>
                <div className="bg-indigo-800/30 border border-cyan-500/30 rounded-lg p-3 text-center hover:bg-indigo-700/30 transition-all cursor-pointer">
                  <User className="size-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-cyan-200 font-semibold">Texnik Yordam</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Greeting - REMOVED */}
      </div>
    </div>
  );
}

export default Dashboard;