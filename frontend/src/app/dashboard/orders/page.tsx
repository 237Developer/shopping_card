import { Suspense } from "react";
import { OrdersHeader } from "@/components/dashboard/orders/OrdersHeader";
import { StatsGridWrapper } from "@/components/dashboard/orders/StatsGridWrapper";
import { SalesEvolutionSection } from "@/components/dashboard/orders/SalesEvolutionSection";
import { OrdersTableSection } from "@/components/dashboard/orders/OrdersTableSection";
import { StatsGridSkeleton } from "@/components/ui/skeletons/products/StatsGridSkeleton";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/products/ProductsTableSkeleton";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <OrdersHeader />

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      <SalesEvolutionSection />

      <Suspense fallback={<ProductsTableSkeleton />}>
        <OrdersTableSection />
      </Suspense>
    </div>
  );
}
