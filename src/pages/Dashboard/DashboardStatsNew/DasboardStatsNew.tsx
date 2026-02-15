import React from "react";
import { CheckCircle, Clock, XCircle, Mail } from "lucide-react";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  colorClass?: string;
  icon?: React.ReactNode;
}> = ({ title, value, colorClass = "bg-white", icon }) => {
  return (
    <div
      className={`rounded-xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-transparent ${colorClass} flex items-center gap-4`}
      style={{ backgroundClip: "padding-box" }}
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-white/30">
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
        <div className="text-3xl font-extrabold text-slate-800 mt-1">{value}</div>
      </div>
    </div>
  );
};

const BarsChart: React.FC = () => {
  const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
  const values = [200, 300, 400, 350, 420, 480];
  const max = Math.max(...values);

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_12px_30px_rgba(2,6,23,0.06)] border border-gray-100">
      <h3 className="font-semibold mb-4 text-slate-700">Oylik statistika</h3>
      <div className="flex items-end gap-4 h-48">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-10 rounded-t shadow-lg"
              style={{ height: `${(v / max) * 100}%`, background: "linear-gradient(180deg,#10B981,#059669)" }}
            />
            <div className="text-xs text-slate-400 mt-2">{months[i]}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-slate-500">Legenda: <span className="text-emerald-600">Bajarilgan</span> <span className="ml-3 text-orange-500">Bajarilmagan</span> <span className="ml-3 text-red-500">Kechiktirilgan</span></div>
    </div>
  );
};

const PieChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_12px_30px_rgba(2,6,23,0.06)] border border-gray-100">
      <h3 className="font-semibold mb-4 text-slate-700">Umumiy taqsimot</h3>
      <div className="flex items-center gap-6">
        <svg width="200" height="200" viewBox="0 0 32 32">
          <circle r="16" cx="16" cy="16" fill="#10B981" />
          <path d="M16 16 L30 16 A14 14 0 0 0 25.5 8 Z" fill="#FB923C" />
          <path d="M16 16 L25.5 8 A14 14 0 0 0 20 4 Z" fill="#F43F5E" />
        </svg>
        <div className="text-sm text-slate-500">
          <div className="text-emerald-600">Bajarilgan: 87.2%</div>
          <div className="text-orange-500 mt-2">Bajarilmagan: 8.6%</div>
          <div className="text-red-500 mt-2">Kechiktirilgan: 4.2%</div>
        </div>
      </div>
    </div>
  );
};

const DasboardStatsNew: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Xatlar</h1>
          <div className="text-sm text-slate-400">2026 M02 14, Sat</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="rounded-xl p-4">
              <StatCard title="Jami xatlar" value={616} colorClass="bg-gradient-to-r from-blue-50 to-white/50 border-blue-100" icon={<Mail className="size-5 text-blue-600" />} />
            </div>
            <div className="rounded-xl p-4">
              <StatCard title="Bajarilgan" value={537} colorClass="bg-gradient-to-r from-emerald-50 to-white/50 border-emerald-100" icon={<CheckCircle className="size-5 text-emerald-600" />} />
            </div>
            <div className="rounded-xl p-4">
              <StatCard title="Bajarilmagan" value={53} colorClass="bg-gradient-to-r from-orange-50 to-white/50 border-orange-100" icon={<Clock className="size-5 text-orange-500" />} />
            </div>
            <div className="rounded-xl p-4">
              <StatCard title="Kechiktirilgan" value={26} colorClass="bg-gradient-to-r from-red-50 to-white/50 border-red-100" icon={<XCircle className="size-5 text-red-600" />} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarsChart />
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasboardStatsNew;
