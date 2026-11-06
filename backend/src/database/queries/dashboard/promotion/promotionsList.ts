import { db } from "../../../db";
import { promotions, productPromotions } from "../../../schema";
import { eq, desc, asc, count } from "drizzle-orm";

export async function getPromotionsList(filters?: { status?: string; search?: string; sort?: string }) {
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
    .orderBy(filters?.sort === "Ancien" ? asc(promotions.startDate) : desc(promotions.createdAt));

  let mapped = results.map((promo) => {
    let status = "active";
    const start = new Date(promo.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(promo.endDate);
    if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
      end.setHours(23, 59, 59, 999);
    }

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

  if (filters?.status && filters.status !== "Tous les statuts") {
    if (filters.status === "Promotions actives") {
      mapped = mapped.filter((p) => p.status === "active");
    } else if (filters.status === "Programmées") {
      mapped = mapped.filter((p) => p.status === "programmée");
    } else if (filters.status === "Terminées") {
      mapped = mapped.filter((p) => p.status === "terminée");
    } else if (filters.status === "Se termine dans 3 jours") {
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      mapped = mapped.filter((p) => {
        const end = new Date(p.endDate);
        if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
          end.setHours(23, 59, 59, 999);
        }
        return p.status === "active" && end >= now && end <= threeDaysFromNow;
      });
    }
  }

  if (filters?.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase();
    mapped = mapped.filter((p) => p.name.toLowerCase().includes(q));
  }

  return mapped;
}
