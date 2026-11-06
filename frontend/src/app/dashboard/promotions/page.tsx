import { Suspense } from "react";
import { PromotionsHeader } from "@/components/dashboard/promotions/PromotionsHeader";
import { StatsGridWrapper } from "@/components/dashboard/promotions/StatsGridWrapper";
import { PromotionsGridSection } from "@/components/dashboard/promotions/PromotionsGridSection";
import { StatsGridSkeleton } from "@/components/ui/skeletons/products/StatsGridSkeleton";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/products/ProductsTableSkeleton";

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <PromotionsHeader />

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <PromotionsGridSection />
      </Suspense>
    </div>
  );
}
