import { db } from "../../../db";
import { orders, customers } from "../../../schema";
import { eq } from "drizzle-orm";

export type OrderStatus =
  | "en_attente"
  | "en_préparation"
  | "expédiée"
  | "livrée"
  | "annulée";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const [updatedOrder] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    .returning();

  if (!updatedOrder) return null;

  const [customer] = await db
    .select({ email: customers.email })
    .from(customers)
    .where(eq(customers.id, updatedOrder.customerId));

  return {
    ...updatedOrder,
    customerEmail: customer?.email || "",
  };
}
