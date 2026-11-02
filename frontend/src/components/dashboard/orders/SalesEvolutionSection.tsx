"use client";

import { useState, useEffect } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { getOrderSalesEvolution } from "@/lib/dashboard/actions/dashboard/order";

type SalesPoint = { label: string; amount: number };
type SalesPeriod = "7days" | "month" | "year";

// Spline Catmull-Rom : la courbe passe exactement par chaque point
function buildSmoothPath(
  pts: { x: number; y: number }[],
  minY: number,
  maxY: number,
): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;

  // Empêche la courbe de sortir de la zone du graphique
  const clampY = (y: number) => Math.min(maxY, Math.max(minY, y));

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

export function SalesEvolutionSection() {
  const [period, setPeriod] = useState<SalesPeriod>("7days");
  const [salesData, setSalesData] = useState<SalesPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvolution() {
      setIsLoading(true);
      const data = await getOrderSalesEvolution(period);
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

  const rawMax = Math.max(...salesData.map((d) => d.amount), 0);
  const maxVal = Math.max(4, Math.ceil(rawMax / 4) * 4);

  const chartHeight = 180;
  const chartWidth = 900;
  const paddingX = 40;
  const paddingY = 20;

  const points = salesData.map((d, index) => {
    const x =
      salesData.length === 1
        ? chartWidth / 2
        : paddingX +
          (index / (salesData.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      (d.amount / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = buildSmoothPath(points, paddingY, chartHeight - paddingY);
  const firstPt = points[0] || { x: paddingX, y: chartHeight - paddingY };
  const lastPt = points[points.length - 1] || {
    x: chartWidth - paddingX,
    y: chartHeight - paddingY,
  };
  const areaD = `${pathD} L ${lastPt.x} ${chartHeight - paddingY} L ${firstPt.x} ${chartHeight - paddingY} Z`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0475FE]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Évolution des commandes
            </h2>
            <p className="text-xs text-gray-500">
              Nombre de commandes sur la période sélectionnée
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {period === "7days"
              ? "7 derniers jours"
              : period === "month"
                ? "Ce mois"
                : "Cette année"}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1">
              <button
                onClick={() => {
                  setPeriod("7days");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                7 derniers jours
              </button>
              <button
                onClick={() => {
                  setPeriod("month");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Ce mois
              </button>
              <button
                onClick={() => {
                  setPeriod("year");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cette année
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          Chargement du graphique...
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-[200px] overflow-visible"
          >
            <defs>
              <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0475FE" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0475FE" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              const val = Math.round(maxVal * (1 - ratio));
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#F3F4F6"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    fontSize="10"
                    fill="#9CA3AF"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            <path d={areaD} fill="url(#orderGrad)" />
            <path
              d={pathD}
              fill="none"
              stroke="#0475FE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((pt, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#0475FE"
                  strokeWidth="2.5"
                />
                <text
                  x={pt.x}
                  y={chartHeight - 4}
                  fontSize="11"
                  fill="#6B7280"
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
