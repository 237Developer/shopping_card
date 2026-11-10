export const PERMISSIONS = {
  VIEW_DASHBOARD: 1 << 0,     // 1
  MANAGE_PRODUCTS: 1 << 1,    // 2
  DELETE_PRODUCTS: 1 << 2,    // 4
  MANAGE_ORDERS: 1 << 3,      // 8
  CANCEL_ORDERS: 1 << 4,      // 16
  MANAGE_PROMOTIONS: 1 << 5,  // 32
  MANAGE_CLIENTS: 1 << 6,     // 64
  MANAGE_USERS: 1 << 7,       // 128
} as const;
