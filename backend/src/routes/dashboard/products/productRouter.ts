import { Router } from "express";
import multer from "multer";
import {
  getProductsListController,
  getProductPageStatsController,
  getProductStatsFullController,
  getTopProductsController,
  getFeaturedProductsListController,
  getStarProductsListController,
  getLowStockProductsListController,
  getPaginatedProductsController,
  getCategoriesListController,
  deleteProductController,
  toggleProductVisibilityController,
  toggleProductStatusController,
  addProductController,
} from "../../../controllers/dashboard/productController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getProductsListController);
router.post("/", upload.single("imageFile"), addProductController);
router.get("/stats", getProductPageStatsController);
router.get("/stats-full", getProductStatsFullController);
router.get("/top", getTopProductsController);
router.get("/featured-list", getFeaturedProductsListController);
router.get("/star-list", getStarProductsListController);
router.get("/low-stock-list", getLowStockProductsListController);
router.get("/paginated", getPaginatedProductsController);
router.get("/categories", getCategoriesListController);
router.delete("/:id", deleteProductController);
router.patch("/:id/visibility", toggleProductVisibilityController);
router.patch("/:id/status", toggleProductStatusController);

export default router;
