import { db } from "../../../db";
import { products, productStatuses, statuses } from "../../../schema";
import { eq, lte, gte, lt, and, or, isNull, gt, sql, count } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/date.js";

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
    eq(statuses.label, "en vedette"),
    or(isNull(productStatuses.expiresAt), gt(productStatuses.expiresAt, now)),
  );

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

export async function getStarProductsStats() {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const activeStarCondition = and(
    eq(statuses.label, "star"),
    or(isNull(productStatuses.expiresAt), gt(productStatuses.expiresAt, now)),
  );

  const [totalResult] = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(activeStarCondition);

  const [thisMonthResult] = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .where(
      and(
        activeStarCondition,
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
        activeStarCondition,
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
