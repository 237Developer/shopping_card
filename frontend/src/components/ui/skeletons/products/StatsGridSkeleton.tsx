export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white py-4 px-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-20"></div>
            <div className="h-5 bg-slate-200 rounded w-12"></div>
            <div className="h-2.5 bg-slate-100 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
