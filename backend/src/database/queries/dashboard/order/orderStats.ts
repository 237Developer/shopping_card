import { db } from "../../../db";
import { orders } from "../../../schema";
import { and, gte, lte, lt, count, eq } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/dashboard/date.js";
import { getNetProfitBetween, getRevenueBetween } from "./helpers";

export async function getTotalOrders() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db.select({ count: count() }).from(orders);
  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        gte(orders.orderDate, startOfCurrentMonth),
        lte(orders.orderDate, now),
      ),
    );
  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        gte(orders.orderDate, startOfPrevMonth),
        lt(orders.orderDate, startOfCurrentMonth),
      ),
    );

  const total = Number(totalResult?.count ?? 0);
  const currentCount = Number(thisMonthResult?.count ?? 0);
  const prevCount = Number(prevMonthResult?.count ?? 0);

  let trend = 0;
  if (prevCount === 0) {
    trend = currentCount > 0 ? 100 : 0;
  } else {
    trend = Math.round(((currentCount - prevCount) / prevCount) * 100);
  }

  return { total, trend };
}

export async function getPreparingOrders() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "en_préparation"));

  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.status, "en_préparation"),
        gte(orders.orderDate, startOfCurrentMonth),
        lte(orders.orderDate, now),
      ),
    );

  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.status, "en_préparation"),
        gte(orders.orderDate, startOfPrevMonth),
        lt(orders.orderDate, startOfCurrentMonth),
      ),
    );

  const total = Number(totalResult?.count ?? 0);
  const currentCount = Number(thisMonthResult?.count ?? 0);
  const prevCount = Number(prevMonthResult?.count ?? 0);

  let trend = 0;
  if (prevCount === 0) {
    trend = currentCount > 0 ? 100 : 0;
  } else {
    trend = Math.round(((currentCount - prevCount) / prevCount) * 100);
  }

  return { total, trend };
}

export async function getShippedOrders() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "expédiée"));

  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.status, "expédiée"),
        gte(orders.orderDate, startOfCurrentMonth),
        lte(orders.orderDate, now),
      ),
    );

  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.status, "expédiée"),
        gte(orders.orderDate, startOfPrevMonth),
        lt(orders.orderDate, startOfCurrentMonth),
      ),
    );

  const total = Number(totalResult?.count ?? 0);
  const currentCount = Number(thisMonthResult?.count ?? 0);
  const prevCount = Number(prevMonthResult?.count ?? 0);

  let trend = 0;
  if (prevCount === 0) {
    trend = currentCount > 0 ? 100 : 0;
  } else {
    trend = Math.round(((currentCount - prevCount) / prevCount) * 100);
  }

  return { total, trend };
}

export async function getTotalRevenue() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalRevenue = await getRevenueBetween();
  const currentMonthRevenue = await getRevenueBetween(startOfCurrentMonth, now);
  const prevMonthRevenue = await getRevenueBetween(
    startOfPrevMonth,
    startOfCurrentMonth,
  );

  let trend = 0;
  if (prevMonthRevenue === 0) {
    trend = currentMonthRevenue > 0 ? 100 : 0;
  } else {
    trend = Math.round(
      ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100,
    );
  }

  return {
    total: totalRevenue,
    trend,
  };
}

export async function getNetProfit() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalProfit = await getNetProfitBetween();
  const currentMonthProfit = await getNetProfitBetween(
    startOfCurrentMonth,
    now,
  );
  const prevMonthProfit = await getNetProfitBetween(
    startOfPrevMonth,
    startOfCurrentMonth,
  );

  let trend = 0;
  if (prevMonthProfit === 0) {
    trend = currentMonthProfit > 0 ? 100 : 0;
  } else {
    trend = Math.round(
      ((currentMonthProfit - prevMonthProfit) / prevMonthProfit) * 100,
    );
  }

  return {
    total: totalProfit,
    trend,
  };
}
