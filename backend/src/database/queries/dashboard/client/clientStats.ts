import { db } from "../../../db";
import { customers, orders } from "../../../schema";
import { and, gte, lte, lt, count } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/dashboard/date.js";

export async function getTotalClients() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db.select({ count: count() }).from(customers);
  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(customers)
    .where(
      and(
        gte(customers.createdAt, startOfCurrentMonth),
        lte(customers.createdAt, now),
      ),
    );
  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(customers)
    .where(
      and(
        gte(customers.createdAt, startOfPrevMonth),
        lt(customers.createdAt, startOfCurrentMonth),
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

export async function getNewClientsThisMonth() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(customers)
    .where(
      and(
        gte(customers.createdAt, startOfCurrentMonth),
        lte(customers.createdAt, now),
      ),
    );

  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(customers)
    .where(
      and(
        gte(customers.createdAt, startOfPrevMonth),
        lt(customers.createdAt, startOfCurrentMonth),
      ),
    );

  const total = Number(thisMonthResult?.count ?? 0);
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

export async function getActiveClients() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Active clients in last 30 days (distinct customerId)
  const activeCurrentResult = await db
    .select({ customerId: orders.customerId })
    .from(orders)
    .where(gte(orders.orderDate, thirtyDaysAgo))
    .groupBy(orders.customerId);

  // Active clients in previous 30 days (60 days ago to 30 days ago)
  const activePrevResult = await db
    .select({ customerId: orders.customerId })
    .from(orders)
    .where(
      and(
        gte(orders.orderDate, sixtyDaysAgo),
        lt(orders.orderDate, thirtyDaysAgo),
      ),
    )
    .groupBy(orders.customerId);

  const total = activeCurrentResult.length;
  const currentCount = activeCurrentResult.length;
  const prevCount = activePrevResult.length;

  let trend = 0;
  if (prevCount === 0) {
    trend = currentCount > 0 ? 100 : 0;
  } else {
    trend = Math.round(((currentCount - prevCount) / prevCount) * 100);
  }

  return { total, trend };
}
