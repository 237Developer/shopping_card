import { Suspense } from "react";
import { ProductsHeader } from "@/components/dashboard/products/ProductsHeader";
import { StatsGridWrapper } from "@/components/dashboard/products/StatsGridWrapper";
import { TopProductsSection } from "@/components/dashboard/products/TopProductsSection";
import { FeaturedProductsSection } from "@/components/dashboard/products/FeaturedProductsSection";
import { StarProductsSection } from "@/components/dashboard/products/StarProductsSection";
import { LowStockProductsSection } from "@/components/dashboard/products/LowStockProductsSection";
import { ProductsTableSection } from "@/components/dashboard/products/ProductsTableSection";

import { StatsGridSkeleton } from "@/components/ui/skeletons/products/StatsGridSkeleton";
import { TopProductsSkeleton } from "@/components/ui/skeletons/products/TopProductsSkeleton";
import { FeaturedProductsSkeleton } from "@/components/ui/skeletons/products/FeaturedProductsSkeleton";
import { StarProductsSkeleton } from "@/components/ui/skeletons/products/StarProductsSkeleton";
import { LowStockProductsSkeleton } from "@/components/ui/skeletons/products/LowStockProductsSkeleton";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/products/ProductsTableSkeleton";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProductsSection />
        </Suspense>

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>

        <Suspense fallback={<StarProductsSkeleton />}>
          <StarProductsSection />
        </Suspense>

        <Suspense fallback={<LowStockProductsSkeleton />}>
          <LowStockProductsSection />
        </Suspense>
      </div>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTableSection />
      </Suspense>
    </div>
  );
}
