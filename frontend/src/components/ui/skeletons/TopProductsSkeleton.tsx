export function TopProductsSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-28"></div>
        <div className="h-3 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-200"></div>
              <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
              <div className="space-y-1">
                <div className="h-3 bg-slate-200 rounded w-24"></div>
                <div className="h-2.5 bg-slate-100 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-slate-200 rounded w-16"></div>
              <div className="h-3 bg-slate-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
