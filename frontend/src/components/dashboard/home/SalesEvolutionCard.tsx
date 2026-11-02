"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getSalesEvolution } from "@/lib/dashboard/data/home";
import { SalesPoint, SalesPeriod } from "@/lib/dashboard/placeholder-data";
import { SalesEvolutionSkeleton } from "@/components/ui/skeletons/home/SalesEvolutionSkeleton";

type Pt = { x: number; y: number };

// Spline Catmull-Rom : la courbe passe exactement par chaque point
function buildSmoothPath(pts: Pt[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;

  // Empêche la courbe de dépasser le cadre du graphique (0–100)
  const clampY = (y: number) => Math.min(100, Math.max(0, y));

  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = clampY(p1.y + (p2.y - p0.y) / 6);
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = clampY(p2.y - (p3.y - p1.y) / 6);

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

const formatTick = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : `${Math.round(v / 1000)}k`;

const PERIOD_LABELS: Record<SalesPeriod, string> = {
  "7days": "7 derniers jours",
  month: "Ce mois",
  year: "Cette année",
};

export function SalesEvolutionCard() {
  const [period, setPeriod] = useState<SalesPeriod>("7days");
  const [salesData, setSalesData] = useState<SalesPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvolution() {
      setIsLoading(true);
      const data = await getSalesEvolution(period);
      if (isMounted) {
        setSalesData(data);
        setIsLoading(false);
      }
    }
    fetchEvolution();
    return () => {
      isMounted = false;
    };
  }, [period]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <SalesEvolutionSkeleton />;
  }

  const maxAmount = Math.max(...salesData.map((d) => d.amount), 1);
  const axisMax = Math.ceil(maxAmount / 50000) * 50000;
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((r) => r * axisMax);

  const points: Pt[] = salesData.map((d, i) => ({
    x: salesData.length <= 1 ? 50 : (i / (salesData.length - 1)) * 100,
    y: 100 - (d.amount / axisMax) * 100,
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`
    : "";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-base font-bold text-slate-800">
          Évolution des ventes
        </h2>
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors select-none"
          >
            <span>{PERIOD_LABELS[period]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20">
              {(Object.keys(PERIOD_LABELS) as SalesPeriod[]).map((p) => (
                <div
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    period === p
                      ? "bg-blue-50 text-[#0475FE] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone du graphique */}
      <div className="relative ml-12 mr-4 mt-2 h-52">
        {ticks.map((value) => (
          <div
            key={value}
            className="absolute inset-x-0 border-t border-slate-100"
            style={{ top: `${100 - (value / axisMax) * 100}%` }}
          >
            <span className="absolute -left-12 w-10 -translate-y-1/2 text-right text-[11px] text-slate-400">
              {formatTick(value)}
            </span>
          </div>
        ))}

        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0475FE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0475FE" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#salesGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#0475FE"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {points.map((pt, i) => (
          <div
            key={i}
            title={`${salesData[i].label} : ${new Intl.NumberFormat("fr-FR").format(salesData[i].amount)} FCFA`}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0475FE] bg-white"
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          />
        ))}

        {points.map((pt, i) => (
          <span
            key={i}
            className="absolute top-full mt-2 -translate-x-1/2 text-[11px] font-medium text-slate-400"
            style={{ left: `${pt.x}%` }}
          >
            {salesData[i].label}
          </span>
        ))}
      </div>

      <div className="h-6" />
    </div>
  );
}
