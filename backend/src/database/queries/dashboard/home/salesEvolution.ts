import { toDateKey } from "../../../../utils/dashboard/date.js";
import { getSalesSince } from "./helpers";

export type SalesPeriod = "7days" | "month" | "year";
export type SalesPoint = { label: string; amount: number; profit: number };

export async function getSalesEvolution(
  period: SalesPeriod,
): Promise<SalesPoint[]> {
  const now = new Date();

  // 7 derniers jours : un point par jour
  if (period === "7days") {
    const days: {
      key: string;
      label: string;
      amount: number;
      profit: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push({
        key: toDateKey(d),
        label: d.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
        amount: 0,
        profit: 0,
      });
    }

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6,
    );
    const sales = await getSalesSince(startDate);

    const amountByDay = new Map<string, number>();
    const profitByDay = new Map<string, number>();
    for (const sale of sales) {
      const key = toDateKey(new Date(sale.orderDate));
      amountByDay.set(key, (amountByDay.get(key) ?? 0) + sale.amount);
      profitByDay.set(key, (profitByDay.get(key) ?? 0) + sale.profit);
    }

    return days.map((day) => ({
      label: day.label,
      amount: amountByDay.get(day.key) ?? 0,
      profit: profitByDay.get(day.key) ?? 0,
    }));
  }

  // 4 dernières semaines : un point par semaine
  if (period === "month") {
    const weeks: SalesPoint[] = [
      { label: "Il y a 3 sem.", amount: 0, profit: 0 },
      { label: "Il y a 2 sem.", amount: 0, profit: 0 },
      { label: "La semaine dern.", amount: 0, profit: 0 },
      { label: "Cette semaine", amount: 0, profit: 0 },
    ];

    const startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const sales = await getSalesSince(startDate);

    for (const sale of sales) {
      const orderDate = new Date(sale.orderDate);
      const diffTime = now.getTime() - orderDate.getTime();
      const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

      if (diffWeeks >= 0 && diffWeeks < 4) {
        const index = 3 - diffWeeks;
        weeks[index].amount += sale.amount;
        weeks[index].profit += sale.profit;
      }
    }

    return weeks;
  }

  // 12 derniers mois : un point par mois
  const monthLabels = [
    "Janv",
    "Févr",
    "Mars",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sept",
    "Oct",
    "Nov",
    "Déc",
  ];

  const points: SalesPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    points.push({
      label: monthLabels[d.getMonth()],
      amount: 0,
      profit: 0,
    });
  }

  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const sales = await getSalesSince(startDate);

  for (const sale of sales) {
    const orderDate = new Date(sale.orderDate);
    const monthDiff =
      (now.getFullYear() - orderDate.getFullYear()) * 12 +
      (now.getMonth() - orderDate.getMonth());
    const index = 11 - monthDiff;
    if (index >= 0 && index < 12) {
      points[index].amount += sale.amount;
      points[index].profit += sale.profit;
    }
  }

  return points;
}
