import { Package, Star, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/dashboard/home/StatCard";
import { getProductStatsFull } from "@/lib/dashboard/data/product";

export async function StatsGridWrapper() {
  const stats = await getProductStatsFull();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Produits"
        value={stats.total.total}
        trendText={`${stats.total.trend >= 0 ? "+" : ""}${stats.total.trend}% ce mois`}
        trend={stats.total.trend}
        icon={Package}
        iconBgColor="bg-blue-50"
        iconColor="text-[#0475FE]"
      />
      <StatCard
        title="Produits Vedettes"
        value={stats.featured.total}
        trendText={`${stats.featured.trend >= 0 ? "+" : ""}${stats.featured.trend}% ce mois`}
        trend={stats.featured.trend}
        icon={Star}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-500"
      />
      <StatCard
        title="Stock Faible"
        value={stats.lowStock.total}
        trendText={`${stats.lowStock.trend >= 0 ? "+" : ""}${stats.lowStock.trend}% ce mois`}
        trend={stats.lowStock.trend}
        icon={AlertTriangle}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-500"
      />
    </div>
  );
}
