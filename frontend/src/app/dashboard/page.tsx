import { Suspense } from "react";
import { DashboardHeaderGreeting } from "@/components/dashboard/home/DashboardHeaderGreeting";
import { StatsGridWrapper } from "@/components/dashboard/home/StatsGridWrapper";
import { SalesEvolutionCard } from "@/components/dashboard/home/SalesEvolutionCard";
import { RecentOrdersCard } from "@/components/dashboard/home/RecentOrdersCard";
import { TopProductsCard } from "@/components/dashboard/home/TopProductsCard";
import { LowStockProductsCard } from "@/components/dashboard/home/LowStockProductsCard";
import { PromotionCard } from "@/components/dashboard/home/PromotionCard";
import { QuickShortcutsCard } from "@/components/dashboard/home/QuickShortcutsCard";
import { StatsGridSkeleton } from "@/components/ui/skeletons/StatsGridSkeleton";
import { SalesEvolutionSkeleton } from "@/components/ui/skeletons/SalesEvolutionSkeleton";
import { RecentOrdersSkeleton } from "@/components/ui/skeletons/RecentOrdersSkeleton";
import { TopProductsSkeleton } from "@/components/ui/skeletons/TopProductsSkeleton";
import { LowStockProductsSkeleton } from "@/components/ui/skeletons/LowStockProductsSkeleton";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeaderGreeting />
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      {/* Row 1: Sales Evolution & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Suspense fallback={<SalesEvolutionSkeleton />}>
            <SalesEvolutionCard />
          </Suspense>
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<RecentOrdersSkeleton />}>
            <RecentOrdersCard />
          </Suspense>
        </div>
      </div>

      {/* Row 2: Top Products & Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Suspense fallback={<TopProductsSkeleton />}>
            <TopProductsCard />
          </Suspense>
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<LowStockProductsSkeleton />}>
            <LowStockProductsCard />
          </Suspense>
        </div>
      </div>

      {/* Row 3: Promotions & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <PromotionCard />
        </div>
        <div className="lg:col-span-7">
          <QuickShortcutsCard />
        </div>
      </div>
    </div>
  );
}
