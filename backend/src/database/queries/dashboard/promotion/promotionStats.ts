import { getPromotionsList } from "./promotionsList";

export async function getPromotionStats() {
  const promotionsList = await getPromotionsList();
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  let activePromotions = 0;
  let expiredPromotions = 0;
  let scheduledPromotions = 0;
  let endingSoonPromotions = 0;

  for (const promo of promotionsList) {
    if (promo.status === "active") {
      activePromotions++;
    } else if (promo.status === "terminée") {
      expiredPromotions++;
    } else if (promo.status === "programmée") {
      scheduledPromotions++;
    }

    const end = new Date(promo.endDate);
    if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
      end.setHours(23, 59, 59, 999);
    }

    if (end >= now && end <= threeDaysFromNow) {
      endingSoonPromotions++;
    }
  }

  return {
    activePromotions,
    expiredPromotions,
    scheduledPromotions,
    endingSoonPromotions,
  };
}
