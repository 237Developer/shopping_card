import { Suspense } from "react";
import { ClientsHeader } from "@/components/dashboard/clients/ClientsHeader";
import { StatsGridWrapper } from "@/components/dashboard/clients/StatsGridWrapper";
import { StatsGridSkeleton } from "@/components/ui/skeletons/products/StatsGridSkeleton";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <ClientsHeader />

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>
    </div>
  );
}
