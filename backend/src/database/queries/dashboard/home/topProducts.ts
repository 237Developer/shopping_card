import { db } from "../../../db";
import { products, categories, orders, orderItems } from "../../../schema";
import { eq, desc, gte, lte, lt, and, notInArray, inArray, sql } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/date.js";
import { EXCLUDED_STATUSES } from "./helpers";

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
