import { db } from "../../../db";
import { promotions } from "../../../schema";
import { lte, gte, and, sql, count } from "drizzle-orm";

export async function getPromotionStats() {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const [activeResult] = await db
    .select({ count: count() })
    .from(promotions)
    .where(and(lte(promotions.startDate, now), gte(promotions.endDate, now)));

  const [expiredResult] = await db
    .select({ count: count() })
    .from(promotions)
    .where(sql`${promotions.endDate} < ${now}`);

  const [endingSoonResult] = await db
    .select({ count: count() })
    .from(promotions)
    .where(
      and(
        gte(promotions.endDate, now),
        lte(promotions.endDate, threeDaysFromNow),
      ),
    );

  return {
    activePromotions: activeResult?.count ?? 0,
    expiredPromotions: expiredResult?.count ?? 0,
    endingSoonPromotions: endingSoonResult?.count ?? 0,
  };
}
