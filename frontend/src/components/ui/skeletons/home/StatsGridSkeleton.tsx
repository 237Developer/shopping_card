export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-28"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-200 rounded w-24"></div>
            <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-20"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
