import { db } from "../../../db";
import {
  products,
  categories,
  productStatuses,
  statuses,
  orderItems,
  orders,
} from "../../../schema";
import { eq, desc, asc, lte, and, sql } from "drizzle-orm";
import { getStartOfMonth } from "../../../../utils/dashboard/date.js";

export async function getPaginatedProductsList({
  page = 1,
  limit = 8,
  category,
  status,
  search,
  sortBy,
}: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
}) {
  const offset = (page - 1) * limit;
  const now = new Date();
  const startOfCurrentMonth = getStartOfMonth(now);

  const unitsSold =
    sql<number>`coalesce(sum(case when ${orders.orderDate} >= ${startOfCurrentMonth} and ${orders.orderDate} <= ${now} and ${orders.status} not in ('en_attente', 'annulée') then ${orderItems.quantity} else 0 end), 0)`.mapWith(
      Number,
    );
  const isStar =
    sql<boolean>`EXISTS (SELECT 1 FROM ${productStatuses} ps JOIN ${statuses} s ON ps.status_id = s.id WHERE ps.product_id = ${products.id} AND s.label = 'star')`.mapWith(
      Boolean,
    );
  const isFeatured =
    sql<boolean>`EXISTS (SELECT 1 FROM ${productStatuses} ps JOIN ${statuses} s ON ps.status_id = s.id WHERE ps.product_id = ${products.id} AND s.label = 'en vedette')`.mapWith(
      Boolean,
    );

  const conditions = [];

  if (category && category !== "all" && category !== "Toutes les catégories") {
    conditions.push(eq(categories.name, category));
  }

  if (status && status !== "all" && status !== "Tous les statuts") {
    if (status === "en stock" || status === "en_stock") {
      conditions.push(sql`${products.stockQuantity} > ${products.threshold}`);
    } else if (status === "faible" || status === "low_stock") {
      conditions.push(lte(products.stockQuantity, products.threshold));
    } else if (status === "visible") {
      conditions.push(eq(products.isActive, true));
    } else if (status === "pas visible" || status === "pas_visible") {
      conditions.push(eq(products.isActive, false));
    } else if (status === "en vedette" || status === "star") {
      conditions.push(eq(statuses.label, status));
    }
  }

  if (search && search.trim() !== "") {
    conditions.push(sql`${products.name} ILIKE ${`%${search.trim()}%`}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const isStatusSpecial = status === "en vedette" || status === "star";

  let countBase = db
    .select({
      count: sql<number>`count(distinct ${products.id})`.mapWith(Number),
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(orders, eq(orderItems.orderId, orders.id));

  if (isStatusSpecial) {
    countBase = countBase
      .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
      .innerJoin(statuses, eq(productStatuses.statusId, statuses.id));
  }

  const [countResult] = await countBase.where(whereClause);

  const total = Number(countResult?.count ?? 0);
  const totalPages = Math.ceil(total / limit) || 1;

  let rowsBase = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      category: categories.name,
      imageUrl: products.imageUrl,
      stockQuantity: products.stockQuantity,
      threshold: products.threshold,
      isActive: products.isActive,
      purchasePrice: products.purchasePrice,
      price: products.price,
      createdAt: products.createdAt,
      unitsSold,
      isStar,
      isFeatured,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(orders, eq(orderItems.orderId, orders.id));

  if (isStatusSpecial) {
    rowsBase = rowsBase
      .innerJoin(productStatuses, eq(products.id, productStatuses.productId))
      .innerJoin(statuses, eq(productStatuses.statusId, statuses.id));
  }

  let orderByClause = desc(products.createdAt);
  if (sortBy === "plus vendue" || sortBy === "plus vendus") {
    orderByClause = desc(unitsSold);
  } else if (sortBy === "en stock") {
    orderByClause = desc(products.stockQuantity);
  } else if (sortBy === "en stock faible") {
    orderByClause = asc(products.stockQuantity);
  }

  const rows = await rowsBase
    .where(whereClause)
    .groupBy(
      products.id,
      products.name,
      products.description,
      categories.name,
      products.imageUrl,
      products.stockQuantity,
      products.threshold,
      products.isActive,
      products.purchasePrice,
      products.price,
      products.createdAt,
      isStar,
      isFeatured,
    )
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return {
    products: rows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      stockQuantity: p.stockQuantity,
      threshold: p.threshold,
      isActive: p.isActive,
      purchasePrice: `${Number(p.purchasePrice).toLocaleString("fr-FR")} FCFA`,
      rawPurchasePrice: Number(p.purchasePrice),
      price: `${Number(p.price).toLocaleString("fr-FR")} FCFA`,
      rawPrice: Number(p.price),
      createdAt: p.createdAt,
      unitsSold: p.unitsSold,
      isStar: p.isStar,
      isFeatured: p.isFeatured,
    })),
    total,
    totalPages,
    currentPage: page,
  };
}
