export type SalesPeriod = "7days" | "month" | "year";
export type SalesPoint = { label: string; amount: number };

export const MOCK_TOP_PRODUCTS = [
  {
    id: "1",
    name: "iPhone 15",
    category: "Téléphones & Tablettes",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80" as string | null,
    unitsSold: 45,
    growth: "+ 12%",
  },
  {
    id: "2",
    name: "T-shirt oversize",
    category: "Vêtements homme",
    imageUrl:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80" as string | null,
    unitsSold: 32,
    growth: "+ 8%",
  },
  {
    id: "3",
    name: "Sac à main",
    category: "Accessoires femme",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80" as string | null,
    unitsSold: 20,
    growth: "+ 5%",
  },
  {
    id: "4",
    name: "Chaussures Nike",
    category: "Sport & Loisirs",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80" as string | null,
    unitsSold: 18,
    growth: "+ 4%",
  },
  {
    id: "5",
    name: "Montre connectée",
    category: "Accessoires",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80" as string | null,
    unitsSold: 15,
    growth: "+ 3%",
  },
];

export const MOCK_LOW_STOCK_PRODUCTS = [
  {
    id: "101",
    name: "Casque Bluetooth",
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80" as string | null,
    stockQuantity: 3,
    threshold: 5,
  },
  {
    id: "102",
    name: "Power Bank",
    imageUrl:
      "https://images.unsplash.com/photo-1609592424104-16d76813e8b0?w=300&auto=format&fit=crop&q=80" as string | null,
    stockQuantity: 5,
    threshold: 10,
  },
  {
    id: "103",
    name: "Lampe LED",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&auto=format&fit=crop&q=80" as string | null,
    stockQuantity: 8,
    threshold: 10,
  },
  {
    id: "104",
    name: "T-shirt oversize",
    imageUrl:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80" as string | null,
    stockQuantity: 12,
    threshold: 15,
  },
  {
    id: "105",
    name: "Chargeur rapide",
    imageUrl:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80" as string | null,
    stockQuantity: 7,
    threshold: 10,
  },
];

export const MOCK_RECENT_ORDERS = [
  {
    id: "1001",
    orderNumber: "SE-1048",
    customer: "Marie N'Goma",
    date: new Date("2025-10-16T10:00:00Z"),
    status: "expédiée",
    totalAmount: 48000,
  },
  {
    id: "1002",
    orderNumber: "SE-1047",
    customer: "Jean Dupont",
    date: new Date("2025-10-15T14:30:00Z"),
    status: "en_préparation",
    totalAmount: 32000,
  },
  {
    id: "1003",
    orderNumber: "SE-1046",
    customer: "Paul Moukengue",
    date: new Date("2025-10-14T09:15:00Z"),
    status: "payée",
    totalAmount: 25500,
  },
  {
    id: "1004",
    orderNumber: "SE-1045",
    customer: "Aminata Diallo",
    date: new Date("2025-10-13T16:45:00Z"),
    status: "livrée",
    totalAmount: 18900,
  },
  {
    id: "1005",
    orderNumber: "SE-1044",
    customer: "Éric Tchoua",
    date: new Date("2025-10-12T11:20:00Z"),
    status: "annulée",
    totalAmount: 12000,
  },
];

export const MOCK_SALES_EVOLUTION: Record<SalesPeriod, SalesPoint[]> = {
  "7days": [
    { label: "Lun", amount: 100000 },
    { label: "Mar", amount: 80000 },
    { label: "Mer", amount: 20000 },
    { label: "Jeu", amount: 1500000 },
    { label: "Ven", amount: 125000 },
    { label: "Sam", amount: 110000 },
    { label: "Dim", amount: 1000000 },
  ],
  month: [
    { label: "Semaine 1", amount: 90000 },
    { label: "Semaine 2", amount: 140000 },
    { label: "Semaine 3", amount: 210000 },
    { label: "Semaine 4", amount: 180000 },
  ],
  year: [
    { label: "Janv", amount: 300000 },
    { label: "Févr", amount: 450000 },
    { label: "Mars", amount: 520000 },
    { label: "Avr", amount: 490000 },
    { label: "Mai", amount: 610000 },
    { label: "Juin", amount: 580000 },
    { label: "Juil", amount: 720000 },
    { label: "Août", amount: 690000 },
    { label: "Sept", amount: 810000 },
    { label: "Oct", amount: 950000 },
    { label: "Nov", amount: 0 },
    { label: "Déc", amount: 0 },
  ],
};

export const MOCK_TOTAL_PRODUCTS = {
  total: 21,
  trend: 2, // +2 ce mois
};

export const MOCK_TOTAL_ORDERS = {
  total: 18,
  trend: 5, // +5 ce mois
};

export const MOCK_TOTAL_CUSTOMERS = {
  total: 12,
  trend: 3, // +3 ce mois
};

export const MOCK_TOTAL_REVENUE = {
  total: 362500,
  trend: 18, // +18% ce mois
};

export const MOCK_TOTAL_PROMOTIONS = {
  total: 6,
  trend: 1, // +1 ce mois
};
