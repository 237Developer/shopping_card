import { db } from "./db";
import {
  customers,
  categories,
  products,
  orders,
  orderItems,
  statuses,
  productStatuses,
  promotions,
  productPromotions,
} from "./schema";

// ---------- Utilitaires ----------

// Générateur pseudo-aléatoire déterministe : même seed => mêmes données
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
const randInt = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

async function seed() {
  console.log("Seeding database with mock data...");

  const now = new Date();

  // Date "il y a N jours" à une heure aléatoire (jamais dans le futur)
  const dateDaysAgo = (daysAgo: number): Date => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysAgo,
      randInt(8, 21),
      randInt(0, 59),
      randInt(0, 59),
    );
    if (d.getTime() > now.getTime()) {
      return new Date(now.getTime() - randInt(1, 180) * 60 * 1000);
    }
    return d;
  };

  // Début de la fenêtre "cette année" : 1er jour du mois il y a 11 mois
  const yearStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.ceil((now.getTime() - yearStart.getTime()) / msPerDay);

  // 0. Nettoyage des commandes (mock) pour pouvoir relancer le seed sans doublons
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(productPromotions);
  await db.delete(promotions);

  // 1. Categories
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
      .values({ name: catName, description: `Catégorie ${catName}` })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      categoryMap.set(catName, inserted.id);
    } else {
      const existing = await db.query.categories.findFirst({
        where: (c, { eq }) => eq(c.name, catName),
      });
      if (existing) categoryMap.set(catName, existing.id);
    }
  }

  // 2. Products (images Unsplash)
  const topProductsData = [
    {
      name: "iPhone 15",
      category: "Téléphones & Tablettes",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80",
      sku: "IPH15-001",
      stockQuantity: 25,
      threshold: 5,
      price: "650000",
    },
    {
      name: "T-shirt oversize",
      category: "Vêtements homme",
      imageUrl:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80",
      sku: "TSH-OVR-002",
      stockQuantity: 12,
      threshold: 15,
      price: "12500",
    },
    {
      name: "Sac à main",
      category: "Accessoires femme",
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80",
      sku: "BAG-WHT-003",
      stockQuantity: 10,
      threshold: 5,
      price: "25000",
    },
    {
      name: "Chaussures Nike",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80",
      sku: "NK-SHOE-004",
      stockQuantity: 14,
      threshold: 5,
      price: "45000",
    },
    {
      name: "Montre connectée",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
      sku: "WAT-CON-005",
      stockQuantity: 20,
      threshold: 5,
      price: "35000",
    },
    {
      name: "Casque Bluetooth",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80",
      sku: "HP-BT-101",
      stockQuantity: 3,
      threshold: 5,
      price: "20000",
    },
    {
      name: "Écouteurs Sans Fil",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80",
      sku: "ECO-BT-006",
      stockQuantity: 8,
      threshold: 5,
      price: "15000",
    },
    {
      name: "Chemise Élégante",
      category: "Vêtements homme",
      imageUrl:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&auto=format&fit=crop&q=80",
      sku: "CHM-MEN-007",
      stockQuantity: 2,
      threshold: 5,
      price: "18000",
    },
    {
      name: "Lunettes de Soleil",
      category: "Accessoires femme",
      imageUrl:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&auto=format&fit=crop&q=80",
      sku: "LUN-WHT-008",
      stockQuantity: 18,
      threshold: 5,
      price: "10000",
    },
    {
      name: "Sac à dos Sport",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80",
      sku: "SAC-SPT-009",
      stockQuantity: 6,
      threshold: 5,
      price: "22000",
    },
    {
      name: "Tablette Tactile",
      category: "Téléphones & Tablettes",
      imageUrl:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80",
      sku: "TAB-PRD-010",
      stockQuantity: 4,
      threshold: 5,
      price: "150000",
    },
    {
      name: "Ceinture en Cuir",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop&q=80",
      sku: "CEI-CUI-011",
      stockQuantity: 25,
      threshold: 5,
      price: "8000",
    },
    {
      name: "Samsung Galaxy S24",
      category: "Téléphones & Tablettes",
      imageUrl:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80",
      sku: "SAM-S24-012",
      stockQuantity: 15,
      threshold: 4,
      price: "580000",
    },
    {
      name: "MacBook Pro 14",
      category: "Téléphones & Tablettes",
      imageUrl:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80",
      sku: "MAC-PRO-013",
      stockQuantity: 7,
      threshold: 3,
      price: "1100000",
    },
    {
      name: "AirPods Pro",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80",
      sku: "AIR-PRO-014",
      stockQuantity: 30,
      threshold: 10,
      price: "140000",
    },
    {
      name: "Pantalon Chino",
      category: "Vêtements homme",
      imageUrl:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop&q=80",
      sku: "PAN-CHI-015",
      stockQuantity: 14,
      threshold: 5,
      price: "16000",
    },
    {
      name: "Pull en Laine",
      category: "Vêtements homme",
      imageUrl:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&auto=format&fit=crop&q=80",
      sku: "PUL-LAI-016",
      stockQuantity: 9,
      threshold: 4,
      price: "24000",
    },
    {
      name: "Robe d'Été",
      category: "Accessoires femme",
      imageUrl:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=80",
      sku: "ROB-ETE-017",
      stockQuantity: 11,
      threshold: 5,
      price: "21000",
    },
    {
      name: "Sac à dos Urbain",
      category: "Accessoires femme",
      imageUrl:
        "https://images.unsplash.com/photo-1546938576-6e6a64f317ee?w=300&auto=format&fit=crop&q=80",
      sku: "SAC-URB-018",
      stockQuantity: 16,
      threshold: 5,
      price: "19000",
    },
    {
      name: "Montre Classique",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80",
      sku: "MON-CLS-019",
      stockQuantity: 13,
      threshold: 4,
      price: "50000",
    },
    {
      name: "Baskets de Ville",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80",
      sku: "BAS-VIL-020",
      stockQuantity: 22,
      threshold: 6,
      price: "32000",
    },
    {
      name: "Enceinte Portable",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80",
      sku: "ENC-PRT-021",
      stockQuantity: 19,
      threshold: 5,
      price: "28000",
    },
    {
      name: "Clavier Mécanique",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80",
      sku: "CLV-MEC-022",
      stockQuantity: 10,
      threshold: 3,
      price: "40000",
    },
    {
      name: "Souris Gamer",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80",
      sku: "SOU-GMR-023",
      stockQuantity: 25,
      threshold: 6,
      price: "25000",
    },
    {
      name: "Lampe de Bureau LED",
      category: "Accessoires",
      imageUrl:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80",
      sku: "LMP-LED-024",
      stockQuantity: 17,
      threshold: 5,
      price: "14000",
    },
    {
      name: "Bouteille Isotherme",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80",
      sku: "BOU-ISO-025",
      stockQuantity: 30,
      threshold: 8,
      price: "9000",
    },
    {
      name: "Tapis de Yoga",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&auto=format&fit=crop&q=80",
      sku: "TAP-YOG-026",
      stockQuantity: 12,
      threshold: 4,
      price: "11000",
    },
    {
      name: "Casquette Sport",
      category: "Sport & Loisirs",
      imageUrl:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop&q=80",
      sku: "CAS-SPT-027",
      stockQuantity: 21,
      threshold: 5,
      price: "6000",
    },
  ];

  const productMap = new Map<string, string>(); // name -> id
  const productPrice = new Map<string, string>(); // name -> price

  for (const p of topProductsData) {
    const catId =
      categoryMap.get(p.category) ?? categoryMap.get("Accessoires")!;
    productPrice.set(p.name, p.price);

    const [inserted] = await db
      .insert(products)
      .values({
        name: p.name,
        categoryId: catId,
        imageUrl: p.imageUrl,
        sku: p.sku,
        stockQuantity: p.stockQuantity,
        threshold: p.threshold,
        price: p.price,
        createdAt: yearStart,
      })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      productMap.set(p.name, inserted.id);
    } else {
      const existing = await db.query.products.findFirst({
        where: (prod, { eq }) => eq(prod.sku, p.sku),
      });
      if (existing) productMap.set(p.name, existing.id);
    }
  }

  // 2.5 Statuses & assignations
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
      if (existing) statusMap.set(label, existing.id);
    }
  }

  const productStatusAssignments = [
    { productName: "iPhone 15", statuses: ["en vedette", "top produit"] },
    { productName: "T-shirt oversize", statuses: ["en promotion"] },
    { productName: "Sac à main", statuses: ["en vedette"] },
    { productName: "Chaussures Nike", statuses: ["star", "top produit"] },
    { productName: "Montre connectée", statuses: ["en promotion", "star"] },
    { productName: "Casque Bluetooth", statuses: ["en promotion"] },
    { productName: "Samsung Galaxy S24", statuses: ["en vedette"] },
    { productName: "AirPods Pro", statuses: ["star", "top produit"] },
    { productName: "Baskets de Ville", statuses: ["en promotion"] },
    { productName: "Robe d'Été", statuses: ["en vedette"] },
  ];

  for (const assignment of productStatusAssignments) {
    const prodId = productMap.get(assignment.productName);
    if (!prodId) continue;

    for (const label of assignment.statuses) {
      const statId = statusMap.get(label);
      if (!statId) continue;

      await db
        .insert(productStatuses)
        .values({ productId: prodId, statusId: statId })
        .onConflictDoNothing();
    }
  }

  // 2.6 Promotions & assignations
  const promotionsData = [
    {
      name: "Soldes de Fin d'Année",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
      percentage: "15.00",
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 2, 31),
      isVisible: true,
      products: ["iPhone 15", "Samsung Galaxy S24", "MacBook Pro 14"],
    },
    {
      name: "Super Promo High-Tech",
      imageUrl: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      percentage: "20.00",
      startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      isVisible: true,
      products: ["Montre connectée", "Casque Bluetooth", "AirPods Pro", "Enceinte Portable"],
    },
    {
      name: "Promo Mode & Accessoires",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      percentage: "10.00",
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      isVisible: false,
      products: ["T-shirt oversize", "Sac à main", "Chaussures Nike", "Baskets de Ville"],
    },
    {
      name: "Offre Spéciale Casques Audio",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      percentage: "25.00",
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      isVisible: true,
      products: ["Casque Bluetooth", "AirPods Pro"],
    },
    {
      name: "Promo Été Flash",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      percentage: "30.00",
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      isVisible: false,
      products: ["Robe d'Été", "Montre connectée"],
    },
  ];

  for (const promo of promotionsData) {
    const [insertedPromo] = await db
      .insert(promotions)
      .values({
        name: promo.name,
        imageUrl: promo.imageUrl,
        percentage: promo.percentage,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isVisible: promo.isVisible,
        createdAt: yearStart,
      })
      .returning();

    if (!insertedPromo) continue;

    for (const prodName of promo.products) {
      const prodId = productMap.get(prodName);
      if (!prodId) continue;

      await db
        .insert(productPromotions)
        .values({
          promotionId: insertedPromo.id,
          productId: prodId,
        })
        .onConflictDoNothing();
    }
  }

  // 3. Customers (avec téléphone et ville)
  const customerData = [
    {
      name: "Marie N'Goma",
      email: "marie.ngoma@example.com",
      phone: "+237600000001",
      city: "Douala, Akwa",
    },
    {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "+237600000002",
      city: "Yaoundé, Bastos",
    },
    {
      name: "Paul Moukengue",
      email: "paul.moukengue@example.com",
      phone: "+237600000003",
      city: "Douala, Bonapriso",
    },
    {
      name: "Aminata Diallo",
      email: "aminata.diallo@example.com",
      phone: "+237600000004",
      city: "Garoua, Centre",
    },
    {
      name: "Éric Tchoua",
      email: "eric.tchoua@example.com",
      phone: "+237600000005",
      city: "Bafoussam, Mifi",
    },
    {
      name: "Sandrine Fotso",
      email: "sandrine.fotso@example.com",
      phone: "+237600000006",
      city: "Douala, Bonamoussadi",
    },
    {
      name: "Hervé Kamga",
      email: "herve.kamga@example.com",
      phone: "+237600000007",
      city: "Yaoundé, Mvan",
    },
    {
      name: "Nadège Mbarga",
      email: "nadege.mbarga@example.com",
      phone: "+237600000008",
      city: "Yaoundé, Essos",
    },
    {
      name: "Boris Ndzie",
      email: "boris.ndzie@example.com",
      phone: "+237600000009",
      city: "Douala, Deido",
    },
    {
      name: "Carine Essomba",
      email: "carine.essomba@example.com",
      phone: "+237600000010",
      city: "Kribi, Centre",
    },
    {
      name: "Yannick Tagne",
      email: "yannick.tagne@example.com",
      phone: "+237600000011",
      city: "Bamenda, Commercial Avenue",
    },
    {
      name: "Fatima Bello",
      email: "fatima.bello@example.com",
      phone: "+237600000012",
      city: "Maroua, Domayo",
    },
    {
      name: "Landry Nkoulou",
      email: "landry.nkoulou@example.com",
      phone: "+237600000013",
      city: "Yaoundé, Biyem-Assi",
    },
    {
      name: "Priscille Mballa",
      email: "priscille.mballa@example.com",
      phone: "+237600000014",
      city: "Douala, Makepe",
    },
    {
      name: "Steve Ngassa",
      email: "steve.ngassa@example.com",
      phone: "+237600000015",
      city: "Limbé, Down Beach",
    },
    {
      name: "Mireille Atangana",
      email: "mireille.atangana@example.com",
      phone: "+237600000016",
      city: "Yaoundé, Nlongkak",
    },
    {
      name: "Tachinda Freshnel",
      email: "tatchindafresshnel@gmail.com",
      phone: "+237600000017",
      city: "Bafoussam, Tamdja",
    },
    {
      name: "DJIOGUE Junior",
      email: "djioguejunior3@gmail.com",
      phone: "+237600000018",
      city: "Douala, Logpom",
    },
  ];

  const customerMap = new Map<string, string>(); // name -> id

  for (const c of customerData) {
    const [inserted] = await db
      .insert(customers)
      .values({ name: c.name, email: c.email, createdAt: yearStart })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      customerMap.set(c.name, inserted.id);
    } else {
      const existing = await db.query.customers.findFirst({
        where: (cust, { eq }) => eq(cust.email, c.email),
      });
      if (existing) customerMap.set(c.name, existing.id);
    }
  }

  // 4. Orders : dates relatives à aujourd'hui
  type PlannedOrder = { daysAgo: number; date: Date };
  const planned: PlannedOrder[] = [];

  // 4a. 7 derniers jours (aujourd'hui = 0) : 2 à 9 commandes par jour
  for (let daysAgo = 0; daysAgo <= 6; daysAgo++) {
    const count = randInt(2, 9);
    for (let k = 0; k < count; k++) {
      planned.push({ daysAgo, date: dateDaysAgo(daysAgo) });
    }
  }

  // 4b. Jours 7 à 27 : 1 à 6 commandes par jour (alimente "Ce mois")
  for (let daysAgo = 7; daysAgo <= 27; daysAgo++) {
    const count = randInt(1, 6);
    for (let k = 0; k < count; k++) {
      planned.push({ daysAgo, date: dateDaysAgo(daysAgo) });
    }
  }

  // 4c. Jours 28 à ~12 mois : tendance en croissance + pic fin d'année
  for (let daysAgo = 28; daysAgo < totalDays; daysAgo++) {
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysAgo,
    );
    const progress = 1 - daysAgo / totalDays; // 0 (ancien) -> 1 (récent)
    const seasonal = d.getMonth() >= 10 ? 1.4 : 1; // nov-déc : plus de ventes
    const rate = (0.6 + progress * 1.6) * seasonal;
    const count = Math.floor(rate + rand());
    for (let k = 0; k < count; k++) {
      planned.push({ daysAgo, date: dateDaysAgo(daysAgo) });
    }
  }

  // Produits populaires plus souvent commandés
  const productNames = topProductsData.map((p) => p.name);
  const pickProduct = () =>
    productNames[Math.floor(Math.pow(rand(), 1.8) * productNames.length)];

  // Statut selon l'ancienneté de la commande
  const pickStatus = (daysAgo: number, customerName: string): string => {
    if (customerName === "Tachinda Freshnel" || customerName === "DJIOGUE Junior") {
      return "en_attente";
    }
    const r = rand();
    if (daysAgo <= 2) {
      return r < 0.5 ? "en_préparation" : r < 0.9 ? "expédiée" : "annulée";
    }
    if (daysAgo <= 10) {
      return r < 0.25 ? "expédiée" : r < 0.9 ? "livrée" : "annulée";
    }
    return r < 0.88 ? "livrée" : "annulée";
  };

  let ordersCount = 0;

  for (const plan of planned) {
    const customer = pick(customerData);
    const custId = customerMap.get(customer.name);
    if (!custId) continue;

    const [insertedOrder] = await db
      .insert(orders)
      .values({
        customerId: custId,
        orderDate: plan.date,
        status: pickStatus(plan.daysAgo, customer.name),
        orderPhone: customer.phone,
        orderName: customer.name,
        deliveryLocation: customer.city,
      })
      .returning();

    if (!insertedOrder) continue;
    ordersCount++;

    // 1 à 3 produits différents par commande
    const itemsCount = randInt(1, 3);
    const chosen = new Set<string>();
    while (chosen.size < itemsCount) chosen.add(pickProduct());

    for (const productName of chosen) {
      const prodId = productMap.get(productName);
      if (!prodId) continue;

      await db
        .insert(orderItems)
        .values({
          orderId: insertedOrder.id,
          productId: prodId,
          unitPrice: productPrice.get(productName)!,
          quantity: randInt(1, 3),
        })
        .onConflictDoNothing();
    }
  }

  console.log(
    `Seeding completed: ${customerMap.size} clients, ${productMap.size} produits, ${ordersCount} commandes.`,
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
