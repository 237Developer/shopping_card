import { db } from "../../../db";
import {
  products,
  categories,
  productStatuses,
  statuses,
  orderItems,
  orders,
} from "../../../schema";
import {
  eq,
  desc,
  asc,
  lte,
  gte,
  lt,
  and,
  or,
  isNull,
  gt,
  notInArray,
  inArray,
  sql,
} from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/dashboard/date.js";
import { EXCLUDED_STATUSES } from "./helpers";

export async function getTopSellingProducts(limit = 5) {
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const unitsSold =
    sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      imageUrl: products.imageUrl,
      price: products.price,
      stockQuantity: products.stockQuantity,
      category: categories.name,
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
    .groupBy(
      products.id,
      products.name,
      categories.name,
      products.imageUrl,
      products.price,
      products.stockQuantity,
    )
    .orderBy(desc(unitsSold))
    .limit(limit);

  const productIds = results.map((p) => p.id);
  const prevMonthUnitsMap = new Map<string, number>();

  if (productIds.length > 0) {
    const prevSales = await db
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
      amount: `${Number(product.price).toLocaleString("fr-FR")} FCFA`,
      stockQuantity: product.stockQuantity,
      category: product.category,
      unitsSold: currentUnits,
      growth,
    };
  });
}

export async function getFeaturedProductsList() {
  const now = new Date();
  const unitsSold =
    sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const results = await db
    .select({
      imageUrl: products.imageUrl,
      name: products.name,
      id: products.id,
      price: products.price,
      stockQuantity: products.stockQuantity,
      category: categories.name,
      unitsSold,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(
      orders,
      and(
        eq(orderItems.orderId, orders.id),
        notInArray(orders.status, EXCLUDED_STATUSES),
      ),
    )
    .where(
      and(
        eq(statuses.label, "en vedette"),
        or(
          isNull(productStatuses.expiresAt),
          gt(productStatuses.expiresAt, now),
        ),
      ),
    )
    .groupBy(
      products.id,
      products.name,
      categories.name,
      products.imageUrl,
      products.price,
      products.stockQuantity,
    );

  return results.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    amount: `${Number(p.price).toLocaleString("fr-FR")} FCFA`,
    stockQuantity: p.stockQuantity,
    category: p.category,
    unitsSold: p.unitsSold,
  }));
}

export async function getStarProductsList() {
  const now = new Date();
  const unitsSold =
    sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number);

  const results = await db
    .select({
      imageUrl: products.imageUrl,
      name: products.name,
      id: products.id,
      price: products.price,
      stockQuantity: products.stockQuantity,
      category: categories.name,
      unitsSold,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
    .innerJoin(statuses, eq(productStatuses.statusId, statuses.id))
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(
      orders,
      and(
        eq(orderItems.orderId, orders.id),
        notInArray(orders.status, EXCLUDED_STATUSES),
      ),
    )
    .where(
      and(
        eq(statuses.label, "star"),
        or(
          isNull(productStatuses.expiresAt),
          gt(productStatuses.expiresAt, now),
        ),
      ),
    )
    .groupBy(
      products.id,
      products.name,
      categories.name,
      products.imageUrl,
      products.price,
      products.stockQuantity,
    );

  return results.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    amount: `${Number(p.price).toLocaleString("fr-FR")} FCFA`,
    stockQuantity: p.stockQuantity,
    category: p.category,
    unitsSold: p.unitsSold,
  }));
}

export async function getLowStockProductsList() {
  const results = await db
    .select({
      imageUrl: products.imageUrl,
      name: products.name,
      stockQuantity: products.stockQuantity,
      price: products.price,
    })
    .from(products)
    .where(lte(products.stockQuantity, products.threshold))
    .orderBy(asc(products.stockQuantity));

  return results.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    amount: `${Number(p.price).toLocaleString("fr-FR")} FCFA`,
    remainingStock: p.stockQuantity,
  }));
}

export async function getCategoriesList() {
  const results = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories);
  return results;
}
