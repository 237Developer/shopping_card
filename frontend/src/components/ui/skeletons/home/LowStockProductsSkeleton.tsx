export function LowStockProductsSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-44"></div>
        <div className="h-3 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-slate-100 rounded w-full"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
              <div className="h-3 bg-slate-200 rounded w-28"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
            <div className="h-5 bg-slate-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
