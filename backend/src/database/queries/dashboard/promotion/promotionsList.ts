import { db } from "../../../db";
import { promotions, productPromotions } from "../../../schema";
import { eq, desc, count } from "drizzle-orm";

export async function getPromotionsList() {
  const now = new Date();

  const results = await db
    .select({
      id: promotions.id,
      name: promotions.name,
      imageUrl: promotions.imageUrl,
      percentage: promotions.percentage,
      startDate: promotions.startDate,
      endDate: promotions.endDate,
      isVisible: promotions.isVisible,
      createdAt: promotions.createdAt,
      productsCount: count(productPromotions.productId),
    })
    .from(promotions)
    .leftJoin(productPromotions, eq(promotions.id, productPromotions.promotionId))
    .groupBy(
      promotions.id,
      promotions.name,
      promotions.imageUrl,
      promotions.percentage,
      promotions.startDate,
      promotions.endDate,
      promotions.isVisible,
      promotions.createdAt,
    )
    .orderBy(desc(promotions.createdAt));

  return results.map((promo) => {
    let status = "active";
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

    if (now < start) {
      status = "programmée";
    } else if (now > end) {
      status = "terminée";
    } else {
      status = "active";
    }

    return {
      ...promo,
      percentage: Number(promo.percentage),
      status,
    };
  });
}
