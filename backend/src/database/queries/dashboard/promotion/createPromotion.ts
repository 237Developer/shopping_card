import { db } from "../../../db";
import { promotions, productPromotions } from "../../../schema";

interface NewPromotionData {
  name: string;
  percentage: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  productIds: string[];
}

export async function createPromotion(data: NewPromotionData) {
  const startDate = new Date(data.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(data.endDate);
  endDate.setHours(23, 59, 59, 999);

  const [createdPromo] = await db
    .insert(promotions)
    .values({
      name: data.name,
      percentage: data.percentage,
      startDate,
      endDate,
      imageUrl: data.imageUrl,
      isVisible: true,
    })
    .returning();

  if (!createdPromo) {
    throw new Error("Failed to create promotion");
  }

  if (data.productIds && data.productIds.length > 0) {
    for (const productId of data.productIds) {
      await db
        .insert(productPromotions)
        .values({
          promotionId: createdPromo.id,
          productId,
        })
        .onConflictDoNothing();
    }
  }

  return createdPromo;
}
