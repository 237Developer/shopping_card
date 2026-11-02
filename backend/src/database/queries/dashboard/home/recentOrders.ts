import { db } from "../../../db";
import { orders, customers, orderItems } from "../../../schema";
import { eq, desc } from "drizzle-orm";
import { revenueSum } from "./helpers";

export async function getRecentOrders(limit?: number) {
  const query = db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customer: customers.name,
      date: orders.orderDate,
      status: orders.status,
      totalAmount: revenueSum,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .groupBy(
      orders.id,
      orders.orderNumber,
      customers.name,
      orders.orderDate,
      orders.status,
    )
    .orderBy(desc(orders.orderDate));

  if (limit !== undefined) {
    return await query.limit(limit);
  }
  return await query;
}
