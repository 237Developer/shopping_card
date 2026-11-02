import { toDateKey, getStartOfMonth } from "../../../../utils/date.js";
import { getSalesSince } from "./helpers";

export type SalesPeriod = "7days" | "month" | "year";
export type SalesPoint = { label: string; amount: number };

export async function getSalesEvolution(
  period: SalesPeriod,
): Promise<SalesPoint[]> {
  const now = new Date();

  // 7 derniers jours : un point par jour
  if (period === "7days") {
    const days: { key: string; label: string; amount: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push({
        key: toDateKey(d),
        label: d.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
        amount: 0,
      });
    }

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6,
    );
    const sales = await getSalesSince(startDate);

    const amountByDay = new Map<string, number>();
    for (const sale of sales) {
      const key = toDateKey(new Date(sale.orderDate));
      amountByDay.set(key, (amountByDay.get(key) ?? 0) + sale.amount);
    }

    return days.map((day) => ({
      label: day.label,
      amount: amountByDay.get(day.key) ?? 0,
    }));
  }

  // Mois en cours : un point par semaine (jours 1-7, 8-14, 15-21, ...)
  if (period === "month") {
    const startOfMonth = getStartOfMonth(now);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    const weeks: SalesPoint[] = Array.from(
      { length: Math.ceil(daysInMonth / 7) },
      (_, i) => ({ label: `Semaine ${i + 1}`, amount: 0 }),
    );

    const sales = await getSalesSince(startOfMonth);

    for (const sale of sales) {
      const dayOfMonth = new Date(sale.orderDate).getDate();
      weeks[Math.floor((dayOfMonth - 1) / 7)].amount += sale.amount;
    }

    return weeks;
  }

  // Année en cours : un point par mois
  const startOfYear = new Date(now.getFullYear(), 0, 1);
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
  const monthAmounts = new Array<number>(12).fill(0);

  const sales = await getSalesSince(startOfYear);

  for (const sale of sales) {
    monthAmounts[new Date(sale.orderDate).getMonth()] += sale.amount;
  }

  return monthLabels.map((label, index) => ({
    label,
    amount: monthAmounts[index],
  }));
}
