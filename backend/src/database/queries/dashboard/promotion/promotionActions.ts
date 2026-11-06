import { db } from "../../../db";
import { promotions, productPromotions } from "../../../schema";
import { eq } from "drizzle-orm";

export async function deletePromotion(promotionId: string) {
  await db.delete(productPromotions).where(eq(productPromotions.promotionId, promotionId));
  const [deleted] = await db.delete(promotions).where(eq(promotions.id, promotionId)).returning();
  return deleted;
}

export async function togglePromotionVisibility(promotionId: string, isVisible: boolean) {
  const [updated] = await db
    .update(promotions)
    .set({ isVisible })
    .where(eq(promotions.id, promotionId))
    .returning();
  return updated;
}
