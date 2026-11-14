import { db } from "../../../db";
import { customers, orders, orderItems } from "../../../schema";
import { eq, desc, asc, and, sql, gte, lt, count, max, sum } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/dashboard/date.js";

export async function getPaginatedClientsList({
  page = 1,
  limit = 8,
  filter,
  search,
}: {
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
}) {
  const offset = (page - 1) * limit;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfCurrentMonth = getStartOfMonth(now);

  const customerTotalRevenue =
    sql<number>`coalesce(sum(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`.mapWith(
      Number,
    );
  const totalOrdersCount = sql<number>`count(distinct ${orders.id})`.mapWith(
    Number,
  );
  const lastOrderDateExpr = max(orders.orderDate);
  const phoneExpr = max(orders.orderPhone);

  const conditions = [];

  if (search && search.trim() !== "") {
    conditions.push(
      sql`(${customers.name} ILIKE ${`%${search.trim()}%`} OR ${customers.email} ILIKE ${`%${search.trim()}%`})`,
    );
  }

  if (filter) {
    const normalizedFilter = filter.toLowerCase();
    if (
      normalizedFilter.includes("actifs") &&
      !normalizedFilter.includes("in")
    ) {
      // Active clients: placed an order in the last 30 days
      const activeCustomerIdsSubquery = db
        .select({ customerId: orders.customerId })
        .from(orders)
        .where(gte(orders.orderDate, thirtyDaysAgo))
        .groupBy(orders.customerId);

      conditions.push(
        sql`${customers.id} IN (SELECT customer_id FROM (${activeCustomerIdsSubquery}) as active_cust)`,
      );
    } else if (normalizedFilter.includes("inactifs")) {
      // Inactive clients: NOT placed an order in the last 30 days
      const activeCustomerIdsSubquery = db
        .select({ customerId: orders.customerId })
        .from(orders)
        .where(gte(orders.orderDate, thirtyDaysAgo))
        .groupBy(orders.customerId);

      conditions.push(
        sql`${customers.id} NOT IN (SELECT customer_id FROM (${activeCustomerIdsSubquery}) as active_cust)`,
      );
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Base query for counting total matching customers
  const [countResult] = await db
    .select({
      count: sql<number>`count(distinct ${customers.id})`.mapWith(Number),
    })
    .from(customers)
    .leftJoin(orders, eq(customers.id, orders.customerId))
    .where(whereClause);

  const total = Number(countResult?.count ?? 0);
  const totalPages = Math.ceil(total / limit) || 1;

  // Determine sorting based on filter
  let orderByClause = desc(customers.createdAt);
  if (filter && filter.toLowerCase().includes("gros")) {
    // Top revenue clients this month
    orderByClause = desc(customerTotalRevenue);
  }

  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      createdAt: customers.createdAt,
      phone: phoneExpr,
      totalOrders: totalOrdersCount,
      totalRevenue: customerTotalRevenue,
      lastOrderDate: lastOrderDateExpr,
    })
    .from(customers)
    .leftJoin(orders, eq(customers.id, orders.customerId))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(whereClause)
    .groupBy(customers.id, customers.name, customers.email, customers.createdAt)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return {
    clients: rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "+237 6 00 00 00 00",
      totalOrders: Number(c.totalOrders),
      totalRevenue: `${c.totalRevenue.toLocaleString("fr-FR")} FCFA`,
      rawTotalRevenue: c.totalRevenue,
      lastOrderDate: c.lastOrderDate
        ? new Date(c.lastOrderDate).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Aucune",
    })),
    total,
    totalPages,
    currentPage: page,
  };
}
