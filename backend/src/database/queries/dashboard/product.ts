import { db } from "../../db";
import {
  products,
  categories,
  productStatuses,
  statuses,
  orderItems,
  orders,
} from "../../schema";
import { eq, desc, asc, lte, gte, lt, and, or, isNull, gt, notInArray, inArray, sql, count } from "drizzle-orm";
import { getStartOfMonth } from "../../../utils/date.js";

const EXCLUDED_STATUSES = ["en_attente", "annulée"];

export async function getProductsList() {
  const results = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      category: categories.name,
      imageUrl: products.imageUrl,
      stockQuantity: products.stockQuantity,
      threshold: products.threshold,
      isActive: products.isActive,
      sku: products.sku,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  return results;
}

export async function getProductPageStats() {
  const [totalResult] = await db.select({ count: count() }).from(products);
  const [activeResult] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.isActive, true));
  const [lowStockResult] = await db
    .select({ count: count() })
    .from(products)
    .where(lte(products.stockQuantity, products.threshold));
  const [outOfStockResult] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.stockQuantity, 0));

  return {
    total: Number(totalResult?.count ?? 0),
    active: Number(activeResult?.count ?? 0),
    lowStock: Number(lowStockResult?.count ?? 0),
    outOfStock: Number(outOfStockResult?.count ?? 0),
  };
}

export async function getTotalProductsWithEvolution() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db.select({ count: count() }).from(products);
  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(and(gte(products.createdAt, startOfCurrentMonth), lte(products.createdAt, now)));
  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(and(gte(products.createdAt, startOfPrevMonth), lt(products.createdAt, startOfCurrentMonth)));

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

export async function getFeaturedProductsStats() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const activeFeaturedCondition = and(
    sql`${statuses.label} IN ('en vedette', 'star')`,
    or(isNull(productStatuses.expiresAt), gt(productStatuses.expiresAt, now)),
  );

  // Featured products linked via productStatuses where status label is 'en vedette' or 'star' and not expired
  const [totalResult] = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(activeFeaturedCondition);

  const [thisMonthResult] = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(
      and(
        activeFeaturedCondition,
        gte(productStatuses.assignedAt, startOfCurrentMonth),
        lte(productStatuses.assignedAt, now),
      ),
    );

  const [prevMonthResult] = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(
      and(
        activeFeaturedCondition,
        gte(productStatuses.assignedAt, startOfPrevMonth),
        lt(productStatuses.assignedAt, startOfCurrentMonth),
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

export async function getLowStockProductsStats() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult] = await db
    .select({ count: count() })
    .from(products)
    .where(lte(products.stockQuantity, products.threshold));

  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        lte(products.stockQuantity, products.threshold),
        gte(products.createdAt, startOfCurrentMonth),
        lte(products.createdAt, now),
      ),
    );

  const [prevMonthResult] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        lte(products.stockQuantity, products.threshold),
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

export async function getTopSellingProducts(limit = 5) {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const unitsSold = sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      imageUrl: products.imageUrl,
      unitsSold,
    })
    .from(products)
    .innerJoin(orderItems, eq(products.id, orderItems.productId))
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        gte(orders.orderDate, startOfCurrentMonth),
        lte(orders.orderDate, now),
        notInArray(orders.status, EXCLUDED_STATUSES),
      ),
    )
    .groupBy(products.id, products.name, products.imageUrl)
    .orderBy(desc(unitsSold))
    .limit(limit);

  const productIds = results.map((p) => p.id);
  const prevMonthUnitsMap = new Map<string, number>();

  if (productIds.length > 0) {
    const prevSales = await db
      .select({
        productId: orderItems.productId,
        units: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number),
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

    for (const row of prevSales) {
      if (row.productId) {
        prevMonthUnitsMap.set(row.productId, row.units);
      }
    }
  }

  return results.map((product) => {
    const currentUnits = product.unitsSold;
    const prevUnits = prevMonthUnitsMap.get(product.id) ?? 0;
    let growthNumber = 0;
    if (prevUnits === 0) {
      growthNumber = currentUnits > 0 ? 100 : 0;
    } else {
      growthNumber = Math.round(((currentUnits - prevUnits) / prevUnits) * 100);
    }
    const growth = `${growthNumber >= 0 ? "+" : ""}${growthNumber}%`;

    return {
      imageUrl: product.imageUrl,
      name: product.name,
      unitsSold: currentUnits,
      growth,
    };
  });
}

export async function getFeaturedProductsList() {
  const now = new Date();
  const results = await db
    .select({
      imageUrl: products.imageUrl,
      name: products.name,
      id: products.id,
      price: products.price,
    })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(
      and(
        sql`${statuses.label} IN ('en vedette', 'star')`,
        or(isNull(productStatuses.expiresAt), gt(productStatuses.expiresAt, now)),
      ),
    )
    .groupBy(products.id, products.name, products.imageUrl, products.price);

  return results.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    amount: `${Number(p.price).toLocaleString("fr-FR")} FCFA`,
  }));
}

export async function getLowStockProductsList() {
  const results = await db
    .select({
      imageUrl: products.imageUrl,
      name: products.name,
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .where(lte(products.stockQuantity, products.threshold))
    .orderBy(asc(products.stockQuantity));

  return results.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    remainingStock: p.stockQuantity,
  }));
}
