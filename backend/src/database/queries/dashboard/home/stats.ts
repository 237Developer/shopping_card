import { db } from "../../../db";
import { products, orders, customers } from "../../../schema";
import { and, gte, lte, lt, count } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/date.js";
import { getRevenueBetween } from "./helpers";

export async function getTotalProducts() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db.select({ count: count() }).from(products);
  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        gte(products.createdAt, startOfCurrentMonth),
        lte(products.createdAt, now),
      ),
    );
  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        gte(products.createdAt, startOfPrevMonth),
        lt(products.createdAt, startOfCurrentMonth),
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

export async function getTotalCustomers() {
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
