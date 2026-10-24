import { Package, ShoppingCart, Users, Coins, Tag } from "lucide-react";
import { StatCard } from "./StatCard";
import {
  getTotalProducts,
  getTotalOrders,
  getTotalCustomers,
  getTotalRevenue,
  getTotalPromotions,
} from "@/lib/dashboard/data/home";

export async function StatsGridWrapper() {
  // Fetching data inside the wrapper component
  const productsData = await getTotalProducts();
  const ordersData = await getTotalOrders();
  const customersData = await getTotalCustomers();
  const revenueData = await getTotalRevenue();
  const promotionsData = await getTotalPromotions();

  const formattedRevenue =
    new Intl.NumberFormat("fr-FR").format(revenueData.total) + " FCFA";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      <StatCard
        title="Total des produits"
        value={productsData.total}
        trendText={`${productsData.trend}% ce mois`}
        trend={productsData.trend}
        icon={Package}
        iconBgColor="bg-blue-50"
        iconColor="text-[#0475FE]"
      />
      <StatCard
        title="Commandes totales"
        value={ordersData.total}
        trendText={`${ordersData.trend}% ce mois`}
        trend={ordersData.trend}
        icon={ShoppingCart}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        title="Clients inscrits"
        value={customersData.total}
        trendText={`${customersData.trend}% ce mois`}
        trend={customersData.trend}
        icon={Users}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <StatCard
        title="Chiffre d'affaires"
        value={formattedRevenue}
        trendText={`${revenueData.trend}% ce mois`}
        trend={revenueData.trend}
        icon={Coins}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        title="Produits en promotion"
        value={promotionsData.total}
        trendText={`${promotionsData.trend}% ce mois`}
        trend={promotionsData.trend}
        icon={Tag}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-600"
      />
    </div>
  );
}
