import { db } from "../../../db";
import { products } from "../../../schema";
import { asc, lte } from "drizzle-orm";

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
