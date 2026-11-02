import { db } from "../../../db";
import { products, productStatuses, statuses } from "../../../schema";
import { eq, and } from "drizzle-orm";

export async function deleteProduct(productId: string) {
  await db.delete(productStatuses).where(eq(productStatuses.productId, productId));
  const [deleted] = await db.delete(products).where(eq(products.id, productId)).returning();
  return deleted;
}

export async function toggleProductVisibility(productId: string, isActive: boolean) {
  const [updated] = await db
    .update(products)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning();
  return updated;
}

export async function toggleProductStatus(productId: string, statusLabel: string, active: boolean) {
  const [statusRecord] = await db
    .select()
    .from(statuses)
    .where(eq(statuses.label, statusLabel));

  if (!statusRecord) {
    throw new Error(`Status ${statusLabel} not found`);
  }

  if (active) {
    await db
      .insert(productStatuses)
      .values({
        productId,
        statusId: statusRecord.id,
      })
      .onConflictDoNothing();
  } else {
    await db
      .delete(productStatuses)
      .where(
        and(
          eq(productStatuses.productId, productId),
          eq(productStatuses.statusId, statusRecord.id)
        )
      );
  }
  return { success: true };
}
