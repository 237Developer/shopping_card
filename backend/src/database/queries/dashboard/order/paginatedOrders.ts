import { db } from "../../../db";
import { orders, orderItems, customers } from "../../../schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";

export async function getPaginatedOrdersList({
  page = 1,
  limit = 8,
  status,
  frequency,
  search,
  sortBy,
}: {
  page?: number;
  limit?: number;
  status?: string;
  frequency?: string;
  search?: string;
  sortBy?: string;
}) {
  const offset = (page - 1) * limit;

  const orderTotalAmount = sql<number>`coalesce(sum(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`.mapWith(Number);
  const itemsCount = sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const conditions = [];

  if (status && status !== "all" && status !== "Tous les statuts") {
    conditions.push(eq(orders.status, status));
  }

  if (frequency && frequency !== "all" && frequency !== "Toutes les fréquences") {
    const currentDate = new Date();
    if (frequency === "today" || frequency === "Aujourd'hui") {
      const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      conditions.push(sql`${orders.orderDate} >= ${startOfToday.toISOString()}`);
    } else if (frequency === "week" || frequency === "Cette semaine") {
      const dayOfWeek = currentDate.getDay() || 7;
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      conditions.push(sql`${orders.orderDate} >= ${startOfWeek.toISOString()}`);
    } else if (frequency === "month" || frequency === "Ce mois") {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      conditions.push(sql`${orders.orderDate} >= ${startOfMonth.toISOString()}`);
    }
  }

  if (search && search.trim() !== "") {
    conditions.push(
      sql`(${orders.orderName} ILIKE ${`%${search.trim()}%`} OR ${orders.orderNumber} ILIKE ${`%${search.trim()}%`} OR ${customers.email} ILIKE ${`%${search.trim()}%`})`,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(distinct ${orders.id})`.mapWith(Number) })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(whereClause);

  const total = Number(countResult?.count ?? 0);
  const totalPages = Math.ceil(total / limit) || 1;

  let orderByClause = desc(orders.orderDate);
  const normalizedSortBy = sortBy?.toLowerCase();
  if (normalizedSortBy === "plus ancien") {
    orderByClause = asc(orders.orderDate);
  } else if (normalizedSortBy === "montant élevé" || normalizedSortBy === "plus élevé") {
    orderByClause = desc(orderTotalAmount);
  } else if (normalizedSortBy === "montant bas" || normalizedSortBy === "moins élevé") {
    orderByClause = asc(orderTotalAmount);
  }

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      orderDate: orders.orderDate,
      status: orders.status,
      orderPhone: orders.orderPhone,
      orderName: orders.orderName,
      customerEmail: customers.email,
      deliveryLocation: orders.deliveryLocation,
      totalAmount: orderTotalAmount,
      itemsCount,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(whereClause)
    .groupBy(
      orders.id,
      orders.orderNumber,
      orders.orderDate,
      orders.status,
      orders.orderPhone,
      orders.orderName,
      customers.email,
      orders.deliveryLocation,
    )
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return {
    orders: rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      orderDate: o.orderDate,
      status: o.status,
      orderPhone: o.orderPhone,
      orderName: o.orderName,
      customerEmail: o.customerEmail || "client@example.com",
      deliveryLocation: o.deliveryLocation || "Non spécifié",
      totalAmount: `${o.totalAmount.toLocaleString("fr-FR")} FCFA`,
      rawTotalAmount: o.totalAmount,
      itemsCount: o.itemsCount,
    })),
    total,
    totalPages,
    currentPage: page,
  };
}
