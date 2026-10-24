export function SalesEvolutionSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-slate-200 rounded w-36"></div>
        <div className="h-8 bg-slate-200 rounded-xl w-28"></div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-44 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="h-6"></div>
    </div>
  );
}
