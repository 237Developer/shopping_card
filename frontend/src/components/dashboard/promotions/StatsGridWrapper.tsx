import { Tag, Archive, Clock, Calendar } from "lucide-react";
import { getPromotionStats } from "@/lib/dashboard/data/promotion";

export async function StatsGridWrapper() {
  const stats = await getPromotionStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white py-4 px-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0475FE] flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Promotions actives</p>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {stats.activePromotions}
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Promotions programmées</p>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {stats.scheduledPromotions ?? 0}
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Promotions expirées</p>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {stats.expiredPromotions}
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Se termine dans 3 jours</p>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {stats.endingSoonPromotions}
          </div>
        </div>
      </div>
    </div>
  );
}
