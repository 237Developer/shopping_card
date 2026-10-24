import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trendText: string;
  trend?: number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  trendText,
  trend = 0,
  icon: IconComponent,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  const isPositive = trend > 0;
  return (
    <div className="bg-white py-2 px-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}
      >
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className="text-md font-bold text-slate-900 my-0.5 truncate">
          {value}
        </div>
        <div
          className={`text-[11px] font-medium flex items-center gap-1 ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{trendText}</span>
        </div>
      </div>
    </div>
  );
}
