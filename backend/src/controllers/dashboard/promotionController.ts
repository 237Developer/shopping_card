import { Request, Response } from "express";
import {
  getPromotionStats,
  getPromotionsList,
  createPromotion,
  deletePromotion,
  togglePromotionVisibility,
} from "../../database/queries/dashboard/promotion";
import { uploadImageToCloudinary } from "../../services/dashboard/cloudinary";

export async function getPromotionStatsController(
  _req: Request,
  res: Response,
) {
  try {
    const stats = await getPromotionStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching promotion stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPromotionsListController(req: Request, res: Response) {
  try {
    const { status, search, sort } = req.query;
    const list = await getPromotionsList({
      status: typeof status === "string" ? status : undefined,
      search: typeof search === "string" ? search : undefined,
      sort: typeof sort === "string" ? sort : undefined,
    });
    res.json(list);
  } catch (error) {
    console.error("Error fetching promotions list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createPromotionController(req: Request, res: Response) {
  try {
    const { name, percentage, startDate, endDate, productIds } = req.body;
    const file = (req as Request & { file?: { buffer: Buffer } }).file;
    let imageUrl: string | undefined = undefined;

    if (file && file.buffer) {
      imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    let parsedProductIds: string[] = [];
    if (productIds) {
      try {
        parsedProductIds =
          typeof productIds === "string" ? JSON.parse(productIds) : productIds;
      } catch {
        parsedProductIds = [];
      }
    }

    const newPromotion = await createPromotion({
      name,
      percentage: percentage || "0",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      imageUrl,
      productIds: parsedProductIds,
    });

    res.status(201).json(newPromotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deletePromotionController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const promotionId = typeof id === "string" ? id : id[0];
    if (!promotionId) {
      return res.status(400).json({ error: "Promotion ID is required" });
    }
    const deleted = await deletePromotion(promotionId);
    if (!deleted) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    res.json({ success: true, deleted });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function togglePromotionVisibilityController(
  req: Request,
  res: Response,
) {
  try {
    const id = req.params.id;
    const promotionId = typeof id === "string" ? id : id[0];
    const { isVisible } = req.body;
    if (!promotionId || typeof isVisible !== "boolean") {
      return res
        .status(400)
        .json({ error: "Promotion ID and boolean isVisible are required" });
    }
    const updated = await togglePromotionVisibility(promotionId, isVisible);
    if (!updated) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    res.json({ success: true, updated });
  } catch (error) {
    console.error("Error toggling promotion visibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
