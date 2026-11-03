import {
  pgTable,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const customers = pgTable("customers", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id", { length: 36 })
    .references(() => categories.id)
    .notNull(),
  imageUrl: text("image_url"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  sku: text("sku").notNull().unique(),
  threshold: integer("threshold").notNull().default(10),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  rating: decimal("rating", {precision: 2, scale:1}).notNull().default("0")
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Compteur géré par PostgreSQL : 1, 2, 3...
  orderSequence: integer("order_sequence")
    .generatedAlwaysAsIdentity()
    .notNull(),

  // Calculé automatiquement : "SE-0001", "SE-0002"...
  orderNumber: text("order_number")
    .generatedAlwaysAs(
      sql`'SE-' || CASE
        WHEN order_sequence < 10000 THEN lpad(order_sequence::text, 4, '0')
        ELSE order_sequence::text
      END`
    )
    .notNull()
    .unique(),

  customerId: varchar("customer_id", { length: 36 })
    .references(() => customers.id)
    .notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  status: text("status").notNull().default("en_attente"),
  orderPhone: text("order_phone").notNull(),
  orderName: text("order_name").notNull(),
  deliveryLocation: text("delivery_location"),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 36 })
      .references(() => orders.id)
      .notNull(),
    
    productId: varchar("product_id", { length: 36 })
      .references(() => products.id, { onDelete: "set null" }),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
  },
);

export const statuses = pgTable("statuses", {
  id: serial("id").primaryKey(),
  label: text("label").notNull().unique(),
});

export const productStatuses = pgTable(
  "product_statuses",
  {
    productId: varchar("product_id", { length: 36 })
      .references(() => products.id)
      .notNull(),
    statusId: integer("status_id")
      .references(() => statuses.id)
      .notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.statusId] }),
  }),
);

export const promotions = pgTable("promotions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
});

export const productPromotions = pgTable("product_promotions", {
  id: serial("id").primaryKey(),
  promotionId: varchar("promotion_id", { length: 36 })
    .references(() => promotions.id, { onDelete: "cascade" })
    .notNull(),
  productId: varchar("product_id", { length: 36 })
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
});

