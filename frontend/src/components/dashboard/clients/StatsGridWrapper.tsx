import { Users, UserPlus, UserCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/home/StatCard";
import { getClientStatsFull } from "@/lib/dashboard/data/client";

export async function StatsGridWrapper() {
  const stats = await getClientStatsFull();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total clients"
        value={stats.totalClients.total}
        trendText={`${stats.totalClients.trend >= 0 ? "+" : ""}${stats.totalClients.trend}% ce mois`}
        trend={stats.totalClients.trend}
        icon={Users}
        iconBgColor="bg-blue-50"
        iconColor="text-[#0475FE]"
      />
      <StatCard
        title="Nouveaux ce mois"
        value={stats.newClients.total}
        trendText={`${stats.newClients.trend >= 0 ? "+" : ""}${stats.newClients.trend}% ce mois`}
        trend={stats.newClients.trend}
        icon={UserPlus}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-500"
      />
      <StatCard
        title="Clients actifs"
        value={stats.activeClients.total}
        trendText={`${stats.activeClients.trend >= 0 ? "+" : ""}${stats.activeClients.trend}% ce mois`}
        trend={stats.activeClients.trend}
        icon={UserCheck}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-500"
      />
    </div>
  );
}
