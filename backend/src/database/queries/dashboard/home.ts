import { db } from "../../db";
import {
  products,
  orders,
  orderItems,
  customers,
  categories,
} from "../../schema";
import {
  eq,
  desc,
  asc,
  lte,
  gte,
  lt,
  and,
  notInArray,
  inArray,
  sql,
  count,
} from "drizzle-orm";
import { toDateKey, getStartOfMonth } from "../../../utils/date.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Statuts qui ne comptent pas comme une vente réalisée
const EXCLUDED_STATUSES = ["en_attente", "annulée"];

// Montant d'une ligne de commande : prix x quantité, additionné
const revenueSum =
  sql<number>`coalesce(sum(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`.mapWith(
    Number,
  );

// Ventes réalisées (montant par commande) à partir d'une date
async function getSalesSince(startDate: Date) {
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

// Chiffre d'affaires entre deux dates (start inclus, end inclus)
async function getRevenueBetween(start?: Date, end?: Date): Promise<number> {
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

// ---------------------------------------------------------------------------
// Top produits du mois
// ---------------------------------------------------------------------------

export async function getTopProducts(limit?: number) {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  console.log("[DB DEBUG] getTopProducts startOfMonth:", startOfCurrentMonth);

  const unitsSold =
    sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const query = db
    .select({
      id: products.id,
      name: products.name,
      category: categories.name,
      imageUrl: products.imageUrl,
      unitsSold,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(orderItems, eq(products.id, orderItems.productId))
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        gte(orders.orderDate, startOfCurrentMonth),
        lte(orders.orderDate, now),
        notInArray(orders.status, EXCLUDED_STATUSES),
      ),
    )
    .groupBy(products.id, products.name, categories.name, products.imageUrl)
    .orderBy(desc(unitsSold));

  let results;
  if (limit !== undefined) {
    results = await query.limit(limit);
  } else {
    results = await query;
  }

  const productIds = results.map((product) => product.id);
  const prevMonthUnitsMap = new Map<string, number>();

  if (productIds.length > 0) {
    const prevMonthSales = await db
      .select({
        productId: orderItems.productId,
        units: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(
          Number,
        ),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          gte(orders.orderDate, startOfPrevMonth),
          lt(orders.orderDate, startOfCurrentMonth),
          notInArray(orders.status, EXCLUDED_STATUSES),
          inArray(orderItems.productId, productIds),
        ),
      )
      .groupBy(orderItems.productId);

    for (const row of prevMonthSales) {
      if (row.productId) {
        prevMonthUnitsMap.set(row.productId, row.units);
      }
    }
  }

  const finalResults = results.map((product) => {
    const currentUnits = product.unitsSold;
    const prevUnits = prevMonthUnitsMap.get(product.id) ?? 0;

    let growthNumber = 0;
    if (prevUnits === 0) {
      growthNumber = currentUnits > 0 ? 100 : 0;
    } else {
      growthNumber = Math.round(((currentUnits - prevUnits) / prevUnits) * 100);
    }

    const growth = `${growthNumber >= 0 ? "+" : ""} ${growthNumber}%`;

    return {
      ...product,
      growth,
    };
  });

  console.log(
    "[DB DEBUG] getTopProducts results count:",
    finalResults.length,
    finalResults,
  );
  return finalResults;
}

// ---------------------------------------------------------------------------
// Produits en faible stock (quantité <= threshold)
// ---------------------------------------------------------------------------

export async function getLowStockProducts(limit?: number) {
  const query = db
    .select({
      id: products.id,
      name: products.name,
      imageUrl: products.imageUrl,
      stockQuantity: products.stockQuantity,
      threshold: products.threshold,
    })
    .from(products)
    .where(lte(products.stockQuantity, products.threshold))
    .orderBy(asc(products.stockQuantity));

  if (limit !== undefined) {
    return await query.limit(limit);
  }
  return await query;
}

// ---------------------------------------------------------------------------
// Dernières commandes
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Évolution des ventes
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Statistiques : total + tendance du mois
// ---------------------------------------------------------------------------

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

  // Croissance en % par rapport au mois précédent
  let trend = 0;
  if (prevMonthRevenue === 0) {
    trend = currentMonthRevenue > 0 ? 100 : 0; // évite la division par zéro
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
