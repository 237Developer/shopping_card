import { db } from "../../../db";
import { products, categories } from "../../../schema";
import { eq, desc } from "drizzle-orm";

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
