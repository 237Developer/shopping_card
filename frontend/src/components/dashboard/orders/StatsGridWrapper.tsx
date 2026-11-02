import { ShoppingCart, Clock, Truck, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/home/StatCard";
import { getOrderStatsFull } from "@/lib/dashboard/actions/dashboard/order";

export async function StatsGridWrapper() {
  const stats = await getOrderStatsFull();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Commandes totales"
        value={stats.totalOrders.total}
        trendText={`${stats.totalOrders.trend >= 0 ? "+" : ""}${stats.totalOrders.trend}% ce mois`}
        trend={stats.totalOrders.trend}
        icon={ShoppingCart}
        iconBgColor="bg-blue-50"
        iconColor="text-[#0475FE]"
      />
      <StatCard
        title="En préparation"
        value={stats.preparingOrders.total}
        trendText={`${stats.preparingOrders.trend >= 0 ? "+" : ""}${stats.preparingOrders.trend}% ce mois`}
        trend={stats.preparingOrders.trend}
        icon={Clock}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-500"
      />
      <StatCard
        title="Expédiées"
        value={stats.shippedOrders.total}
        trendText={`${stats.shippedOrders.trend >= 0 ? "+" : ""}${stats.shippedOrders.trend}% ce mois`}
        trend={stats.shippedOrders.trend}
        icon={Truck}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-500"
      />
      <StatCard
        title="Chiffre d'affaires"
        value={`${stats.revenue.total.toLocaleString("fr-FR")} FCFA`}
        trendText={`${stats.revenue.trend >= 0 ? "+" : ""}${stats.revenue.trend}% ce mois`}
        trend={stats.revenue.trend}
        icon={DollarSign}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-500"
      />
    </div>
  );
}
