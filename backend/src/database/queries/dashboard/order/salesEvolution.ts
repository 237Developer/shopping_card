import { toDateKey } from "../../../../utils/date.js";
import { db } from "../../../db";
import { orders } from "../../../schema";
import { gte } from "drizzle-orm";

export type SalesPeriod = "7days" | "month" | "year";
export type SalesPoint = { label: string; amount: number };

export async function getOrderSalesEvolution(
  period: SalesPeriod,
): Promise<SalesPoint[]> {
  const now = new Date();

  const getOrdersSince = async (startDate: Date) => {
    return await db
      .select({
        orderDate: orders.orderDate,
      })
      .from(orders)
      .where(gte(orders.orderDate, startDate));
  };

  // 7 derniers jours
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
    const orderRows = await getOrdersSince(startDate);

    const countByDay = new Map<string, number>();
    for (const row of orderRows) {
      const key = toDateKey(new Date(row.orderDate));
      countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
    }

    return days.map((day) => ({
      label: day.label,
      amount: countByDay.get(day.key) ?? 0,
    }));
  }

  // 4 dernières semaines
  if (period === "month") {
    const weeks: SalesPoint[] = [
      { label: "Il y a 3 sem.", amount: 0 },
      { label: "Il y a 2 sem.", amount: 0 },
      { label: "La semaine dern.", amount: 0 },
      { label: "Cette semaine", amount: 0 },
    ];

    const startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const orderRows = await getOrdersSince(startDate);

    for (const row of orderRows) {
      const orderDate = new Date(row.orderDate);
      const diffTime = now.getTime() - orderDate.getTime();
      const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

      if (diffWeeks >= 0 && diffWeeks < 4) {
        const index = 3 - diffWeeks;
        weeks[index].amount += 1;
      }
    }

    return weeks;
  }

  // 12 derniers mois
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
      label: `${monthLabels[d.getMonth()]} ${d.getFullYear()}`,
      amount: 0,
    });
  }

  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const orderRows = await getOrdersSince(startDate);

  for (const row of orderRows) {
    const orderDate = new Date(row.orderDate);
    const monthDiff =
      (now.getFullYear() - orderDate.getFullYear()) * 12 +
      (now.getMonth() - orderDate.getMonth());
    const index = 11 - monthDiff;
    if (index >= 0 && index < 12) {
      points[index].amount += 1;
    }
  }

  return points;
}
