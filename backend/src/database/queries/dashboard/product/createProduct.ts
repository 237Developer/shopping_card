import { db } from "../../../db";
import { products, categories } from "../../../schema";
import { eq } from "drizzle-orm";

export type NewProductData = {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  stockQuantity?: number;
  isActive?: boolean;
  sku: string;
  threshold?: number;
  price: string | number;
  rating?: string | number;
};

export async function createProduct(productData: NewProductData) {
  let [categoryRecord] = await db
    .select()
    .from(categories)
    .where(eq(categories.name, productData.category));

  if (!categoryRecord) {
    [categoryRecord] = await db
      .insert(categories)
      .values({ name: productData.category })
      .returning();
  }

  const [createdProduct] = await db
    .insert(products)
    .values({
      name: productData.name,
      description: productData.description,
      categoryId: categoryRecord.id,
      imageUrl: productData.imageUrl,
      stockQuantity: Number(productData.stockQuantity ?? 0),
      isActive: productData.isActive ?? true,
      sku: productData.sku,
      threshold: Number(productData.threshold ?? 10),
      price: String(productData.price ?? "0"),
      rating: String(productData.rating ?? "0"),
    })
    .returning();

  return {
    id: createdProduct.id,
    code: createdProduct.sku,
    name: createdProduct.name,
    description: createdProduct.description,
    category: categoryRecord.name,
    imageUrl: createdProduct.imageUrl,
    stockQuantity: createdProduct.stockQuantity,
    threshold: createdProduct.threshold,
    isActive: createdProduct.isActive,
    price: `${Number(createdProduct.price).toLocaleString("fr-FR")} FCFA`,
    rawPrice: Number(createdProduct.price),
    createdAt: createdProduct.createdAt,
    unitsSold: 0,
    isStar: false,
    isFeatured: false,
  };
}
