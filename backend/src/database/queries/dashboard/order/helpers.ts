import { db } from "../../../db";
import { orders, orderItems } from "../../../schema";
import { eq, lte, gte, and, notInArray, sql } from "drizzle-orm";

export const EXCLUDED_STATUSES = ["annulée"];

export const revenueSum =
  sql<number>`coalesce(sum(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`.mapWith(
    Number,
  );

export async function getSalesSince(startDate: Date) {
  return await db
    .select({
      orderDate: orders.orderDate,
      amount: revenueSum,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(
      and(
        gte(orders.orderDate, startDate),
        notInArray(orders.status, EXCLUDED_STATUSES),
      ),
    )
    .groupBy(orders.id, orders.orderDate);
}

export async function getRevenueBetween(start?: Date, end?: Date): Promise<number> {
  const conditions = [notInArray(orders.status, EXCLUDED_STATUSES)];
  if (start) conditions.push(gte(orders.orderDate, start));
  if (end) conditions.push(lte(orders.orderDate, end));

  const [result] = await db
    .select({ total: revenueSum })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(...conditions));

  return result?.total ?? 0;
}
