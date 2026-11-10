import { Suspense } from "react";
import { ClientsHeader } from "@/components/dashboard/clients/ClientsHeader";
import { StatsGridWrapper } from "@/components/dashboard/clients/StatsGridWrapper";
import { ClientsTableSection } from "@/components/dashboard/clients/ClientsTableSection";
import { StatsGridSkeleton } from "@/components/ui/skeletons/products/StatsGridSkeleton";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/products/ProductsTableSkeleton";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <ClientsHeader />

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ClientsTableSection />
      </Suspense>
    </div>
  );
}
