import { Request, Response, NextFunction } from "express";
import { db } from "../../database/db";
import { orders } from "../../database/schema";
import { eq } from "drizzle-orm";

export async function validateOrderStatusTransition(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body as { status: string };

    const orderId = typeof id === "string" ? id : id?.[0];

    if (!orderId || !newStatus) {
      return res.status(400).json({ error: "ID de commande et statut requis" });
    }

    const [order] = await db
      .select({ id: orders.id, status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    const currentStatus = order.status;

    // If status is not changing, allow (or return success)
    if (currentStatus === newStatus) {
      return next();
    }

    // Rules validation:
    // - en_attente -> en_préparation, expédiée, livrée, annulée
    // - en_préparation -> expédiée, livrée (CANNOT cancel, CANNOT go back to en_attente)
    // - expédiée -> livrée (CANNOT go back, CANNOT cancel)
    // - livrée or annulée -> no transitions allowed

    let isValid = false;

    if (currentStatus === "en_attente") {
      if (
        newStatus === "en_préparation" ||
        newStatus === "expédiée" ||
        newStatus === "livrée" ||
        newStatus === "annulée"
      ) {
        isValid = true;
      }
    } else if (currentStatus === "en_préparation") {
      if (newStatus === "expédiée" || newStatus === "livrée") {
        isValid = true;
      }
    } else if (currentStatus === "expédiée") {
      if (newStatus === "livrée") {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(400).json({
        error: `Impossible de changer le statut de "${currentStatus}" à "${newStatus}". Transition non autorisée.`,
      });
    }

    next();
  } catch (error) {
    console.error("Error in validateOrderStatusTransition middleware:", error);
    res.status(500).json({ error: "Erreur interne du serveur lors de la validation du statut" });
  }
}
