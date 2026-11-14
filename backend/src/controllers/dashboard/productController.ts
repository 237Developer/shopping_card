import { Request, Response } from "express";
import {
  getProductsList,
  getProductPageStats,
  getTotalProductsWithEvolution,
  getFeaturedProductsStats,
  getStarProductsStats,
  getLowStockProductsStats,
  getTopSellingProducts,
  getFeaturedProductsList,
  getStarProductsList,
  getLowStockProductsList,
  getPaginatedProductsList,
  getCategoriesList,
  deleteProduct,
  toggleProductVisibility,
  toggleProductStatus,
  createProduct,
} from "../../database/queries/dashboard/product";
import { uploadImageToCloudinary } from "../../services/dashboard/cloudinary";

export async function getProductsListController(_req: Request, res: Response) {
  try {
    const products = await getProductsList();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProductPageStatsController(
  _req: Request,
  res: Response,
) {
  try {
    const stats = await getProductPageStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching product page stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProductStatsFullController(
  _req: Request,
  res: Response,
) {
  try {
    const total = await getTotalProductsWithEvolution();
    const featured = await getFeaturedProductsStats();
    const star = await getStarProductsStats();
    const lowStock = await getLowStockProductsStats();
    res.json({ total, featured, star, lowStock });
  } catch (error) {
    console.error("Error fetching full product stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTopProductsController(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const topProducts = await getTopSellingProducts(limit);
    res.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFeaturedProductsListController(
  _req: Request,
  res: Response,
) {
  try {
    const featured = await getFeaturedProductsList();
    res.json(featured);
  } catch (error) {
    console.error("Error fetching featured products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStarProductsListController(
  _req: Request,
  res: Response,
) {
  try {
    const starProducts = await getStarProductsList();
    res.json(starProducts);
  } catch (error) {
    console.error("Error fetching star products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getLowStockProductsListController(
  _req: Request,
  res: Response,
) {
  try {
    const lowStock = await getLowStockProductsList();
    res.json(lowStock);
  } catch (error) {
    console.error("Error fetching low stock products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPaginatedProductsController(
  req: Request,
  res: Response,
) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    const result = await getPaginatedProductsList({
      page,
      limit,
      category,
      status,
      search,
      sortBy,
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCategoriesListController(
  _req: Request,
  res: Response,
) {
  try {
    const categoriesList = await getCategoriesList();
    res.json(categoriesList);
  } catch (error) {
    console.error("Error fetching categories list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const productId = typeof id === "string" ? id : id[0];
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const deleted = await deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function toggleProductVisibilityController(
  req: Request,
  res: Response,
) {
  try {
    const id = req.params.id;
    const productId = typeof id === "string" ? id : id[0];
    const { isActive } = req.body;
    if (!productId || typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ error: "Product ID and boolean isActive are required" });
    }
    const updated = await toggleProductVisibility(productId, isActive);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, updated });
  } catch (error) {
    console.error("Error toggling product visibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function toggleProductStatusController(
  req: Request,
  res: Response,
) {
  try {
    const id = req.params.id;
    const productId = typeof id === "string" ? id : id[0];
    const { statusLabel, active } = req.body;
    if (!productId || !statusLabel || typeof active !== "boolean") {
      return res
        .status(400)
        .json({
          error: "Product ID, statusLabel, and boolean active are required",
        });
    }
    await toggleProductStatus(productId, statusLabel, active);
    res.json({ success: true });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addProductController(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      category,
      price,
      purchasePrice,
      stockQuantity,
      threshold,
      rating,
    } = req.body;
    const file = (req as Request & { file?: { buffer: Buffer } }).file;
    let imageUrl: string | undefined = undefined;

    if (file && file.buffer) {
      imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    const newProduct = await createProduct({
      name,
      description,
      category: category || "Smartphones",
      imageUrl,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
      purchasePrice,
      threshold: threshold ? Number(threshold) : 10,
      price,
      rating: rating || "5.0",
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
