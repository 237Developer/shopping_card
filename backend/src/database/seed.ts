import { db } from "./db";
import { customers, categories, products, orders, orderItems, statuses, productStatuses } from "./schema";

async function seed() {
  console.log("Seeding database with mock data...");

  // 1. Insert Categories
  const categoryNames = [
    "Téléphones & Tablettes",
    "Vêtements homme",
    "Accessoires femme",
    "Sport & Loisirs",
    "Accessoires",
  ];

  const categoryMap = new Map<string, string>(); // name -> id

  for (const catName of categoryNames) {
    const [inserted] = await db
      .insert(categories)
      .values({
        name: catName,
        description: `Catégorie ${catName}`,
      })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      categoryMap.set(catName, inserted.id);
    } else {
      const existing = await db.query.categories.findFirst({
        where: (c, { eq }) => eq(c.name, catName),
      });
      if (existing) {
        categoryMap.set(catName, existing.id);
      }
    }
  }

  // 2. Insert Products
  const topProductsData = [
    {
      name: "iPhone 15",
      category: "Téléphones & Tablettes",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80",
      sku: "IPH15-001",
      stockQuantity: 25,
      threshold: 5,
    },
    {
      name: "T-shirt oversize",
      category: "Vêtements homme",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80",
      sku: "TSH-OVR-002",
      stockQuantity: 12,
      threshold: 15,
    },
    {
      name: "Sac à main",
      category: "Accessoires femme",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80",
      sku: "BAG-WHT-003",
      stockQuantity: 10,
      threshold: 5,
    },
    {
      name: "Chaussures Nike",
      category: "Sport & Loisirs",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80",
      sku: "NK-SHOE-004",
      stockQuantity: 14,
      threshold: 5,
    },
    {
      name: "Montre connectée",
      category: "Accessoires",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
      sku: "WAT-CON-005",
      stockQuantity: 20,
      threshold: 5,
    },
    {
      name: "Casque Bluetooth",
      category: "Accessoires",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80",
      sku: "HP-BT-101",
      stockQuantity: 3,
      threshold: 5,
    },
  ];

  const productMap = new Map<string, string>(); // name -> id

  for (const p of topProductsData) {
    const catId = categoryMap.get(p.category) ?? categoryMap.get("Accessoires")!;
    const [inserted] = await db
      .insert(products)
      .values({
        name: p.name,
        categoryId: catId,
        imageUrl: p.imageUrl,
        sku: p.sku,
        stockQuantity: p.stockQuantity,
        threshold: p.threshold,
        price: "15000",
        createdAt: new Date("2026-10-10T10:00:00Z"),
      } as any)
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      productMap.set(p.name, inserted.id);
    } else {
      const existing = await db.query.products.findFirst({
        where: (prod, { eq }) => eq(prod.sku, p.sku),
      });
      if (existing) {
        productMap.set(p.name, existing.id);
      }
    }
  }

  // 2.5 Insert Status Definitions and Product Status Assignments
  const statusLabels = ["en vedette", "star", "en promotion", "top produit"];
  const statusMap = new Map<string, number>(); // label -> id

  for (const label of statusLabels) {
    const [inserted] = await db
      .insert(statuses)
      .values({ label })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      statusMap.set(label, inserted.id);
    } else {
      const existing = await db.query.statuses.findFirst({
        where: (s, { eq }) => eq(s.label, label),
      });
      if (existing) {
        statusMap.set(label, existing.id);
      }
    }
  }

  const productStatusAssignments = [
    { productName: "iPhone 15", statuses: ["en vedette", "top produit"] },
    { productName: "T-shirt oversize", statuses: ["en promotion"] },
    { productName: "Sac à main", statuses: ["en vedette"] },
    { productName: "Chaussures Nike", statuses: ["star", "top produit"] },
    { productName: "Montre connectée", statuses: ["en promotion", "star"] },
    { productName: "Casque Bluetooth", statuses: ["en promotion"] },
  ];

  for (const assignment of productStatusAssignments) {
    const prodId = productMap.get(assignment.productName);
    if (!prodId) continue;

    for (const label of assignment.statuses) {
      const statId = statusMap.get(label);
      if (!statId) continue;

      await db
        .insert(productStatuses)
        .values({
          productId: prodId,
          statusId: statId,
        })
        .onConflictDoNothing();
    }
  }

  // 3. Insert Customers
  const customerData = [
    { name: "Marie N'Goma", email: "marie.ngoma@example.com" },
    { name: "Jean Dupont", email: "jean.dupont@example.com" },
    { name: "Paul Moukengue", email: "paul.moukengue@example.com" },
    { name: "Aminata Diallo", email: "aminata.diallo@example.com" },
    { name: "Éric Tchoua", email: "eric.tchoua@example.com" },
  ];

  const customerMap = new Map<string, string>(); // name -> id

  for (const c of customerData) {
    const [inserted] = await db
      .insert(customers)
      .values({
        name: c.name,
        email: c.email,
        createdAt: new Date("2026-10-10T10:00:00Z"),
      })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      customerMap.set(c.name, inserted.id);
    } else {
      const existing = await db.query.customers.findFirst({
        where: (cust, { eq }) => eq(cust.email, c.email),
      });
      if (existing) {
        customerMap.set(c.name, existing.id);
      }
    }
  }

  // 4. Insert Recent Orders & Order Items with different products & October 2026 dates
  const ordersData = [
    {
      customer: "Marie N'Goma",
      productName: "iPhone 15",
      quantity: 2,
      date: new Date("2026-10-22T10:00:00Z"),
      status: "expédiée",
      orderPhone: "+237600000001",
      orderName: "Marie N'Goma",
      totalAmount: 96000,
    },
    {
      customer: "Jean Dupont",
      productName: "T-shirt oversize",
      quantity: 3,
      date: new Date("2026-10-21T14:30:00Z"),
      status: "en_préparation",
      orderPhone: "+237600000002",
      orderName: "Jean Dupont",
      totalAmount: 45000,
    },
    {
      customer: "Paul Moukengue",
      productName: "Sac à main",
      quantity: 1,
      date: new Date("2026-10-20T09:15:00Z"),
      status: "payée",
      orderPhone: "+237600000003",
      orderName: "Paul Moukengue",
      totalAmount: 25500,
    },
    {
      customer: "Aminata Diallo",
      productName: "Chaussures Nike",
      quantity: 1,
      date: new Date("2026-10-18T16:45:00Z"),
      status: "livrée",
      orderPhone: "+237600000004",
      orderName: "Aminata Diallo",
      totalAmount: 35000,
    },
    {
      customer: "Éric Tchoua",
      productName: "Montre connectée",
      quantity: 1,
      date: new Date("2026-10-16T11:20:00Z"),
      status: "payée",
      orderPhone: "+237600000005",
      orderName: "Éric Tchoua",
      totalAmount: 20000,
    },
    {
      customer: "Marie N'Goma",
      productName: "Casque Bluetooth",
      quantity: 1,
      date: new Date("2026-10-15T08:00:00Z"),
      status: "en_attente", // Excluded status test
      orderPhone: "+237600000001",
      orderName: "Marie N'Goma",
      totalAmount: 15000,
    },
    {
      customer: "Jean Dupont",
      productName: "iPhone 15",
      quantity: 1,
      date: new Date("2026-10-15T12:00:00Z"),
      status: "annulée", // Excluded status test
      orderPhone: "+237600000002",
      orderName: "Jean Dupont",
      totalAmount: 48000,
    },
  ];

  for (const o of ordersData) {
    const custId = customerMap.get(o.customer);
    const prodId = productMap.get(o.productName);
    if (!custId || !prodId) continue;

    const [insertedOrder] = await db
      .insert(orders)
      .values({
        customerId: custId,
        orderDate: o.date,
        status: o.status,
        orderPhone: o.orderPhone,
        orderName: o.orderName,
      })
      .returning();

    if (insertedOrder) {
      await db
        .insert(orderItems)
        .values({
          orderId: insertedOrder.id,
          productId: prodId,
          unitPrice: (o.totalAmount / o.quantity).toString(),
          quantity: o.quantity,
        })
        .onConflictDoNothing();
    }
  }

  console.log("Seeding completed successfully with diverse products and October 2026 dates!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
