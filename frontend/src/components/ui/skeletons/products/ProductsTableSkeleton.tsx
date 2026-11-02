export function ProductsTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 animate-pulse space-y-4">
      {/* Filters header skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 h-10 bg-slate-100 rounded-xl" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-32 h-10 bg-slate-100 rounded-xl" />
          <div className="w-32 h-10 bg-slate-100 rounded-xl" />
          <div className="w-32 h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
        <div className="bg-slate-50 h-10 border-b border-slate-100" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
              <div className="space-y-1.5">
                <div className="w-32 h-3 bg-slate-100 rounded" />
                <div className="w-20 h-2.5 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="w-16 h-3 bg-slate-100 rounded" />
            <div className="w-20 h-3 bg-slate-100 rounded" />
            <div className="w-24 h-3 bg-slate-100 rounded" />
            <div className="w-16 h-3 bg-slate-100 rounded" />
            <div className="w-16 h-3 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
