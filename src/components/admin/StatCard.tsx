import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  color?: "green" | "sunset" | "gold";
}

export function StatCard({ label, value, icon: Icon, trend, trendType = "neutral", color = "gold" }: StatCardProps) {
  const colorMap = {
    green: "border-l-brand-green bg-green-50/30",
    sunset: "border-l-brand-sunset-start bg-orange-50/30",
    gold: "border-l-brand-gold bg-yellow-50/30",
  };

  const iconColorMap = {
    green: "text-brand-green",
    sunset: "text-brand-sunset-start",
    gold: "text-brand-gold",
  };

  return (
    <div className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 ${colorMap[color]} transition-all hover:shadow-md group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-[#0b1a10] mt-2 group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-white shadow-sm border border-gray-50 ${iconColorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trendType === 'up' ? 'bg-green-100 text-green-700' : 
            trendType === 'down' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-600'
          }`}>
            {trend}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">vs yesterday</span>
        </div>
      )}
    </div>
  );
}
