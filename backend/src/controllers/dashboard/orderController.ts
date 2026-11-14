import { Request, Response } from "express";
import {
  getTotalOrders,
  getPreparingOrders,
  getShippedOrders,
  getTotalRevenue,
  getNetProfit,
  getOrderSalesEvolution,
  getPaginatedOrdersList,
  updateOrderStatus,
} from "../../database/queries/dashboard/order";
import { SalesPeriod } from "../../database/queries/dashboard/order/salesEvolution";
import { OrderStatus } from "../../database/queries/dashboard/order/changeStatus";
import { sendOrderStatusEmail } from "../../services/dashboard/email";
import { OrderStatus as EmailOrderStatus } from "../../services/dashboard/orderMessages";

function mapStatusToEmailStatus(status: string): EmailOrderStatus {
  switch (status) {
    case "en_attente":
      return "confirmed";
    case "en_préparation":
      return "preparing";
    case "expédiée":
      return "shipped";
    case "livrée":
      return "delivered";
    case "annulée":
      return "cancelled";
    default:
      return "confirmed";
  }
}

export async function getOrderStatsFullController(
  _req: Request,
  res: Response,
) {
  try {
    const totalOrders = await getTotalOrders();
    const preparingOrders = await getPreparingOrders();
    const shippedOrders = await getShippedOrders();
    const revenue = await getTotalRevenue();
    const netProfit = await getNetProfit();
    res.json({
      totalOrders,
      preparingOrders,
      shippedOrders,
      revenue,
      netProfit,
    });
  } catch (error) {
    console.error("Error fetching order full stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getOrderSalesEvolutionController(
  req: Request,
  res: Response,
) {
  try {
    const period = (req.query.period as SalesPeriod) || "7days";
    const evolution = await getOrderSalesEvolution(period);
    res.json(evolution);
  } catch (error) {
    console.error("Error fetching order sales evolution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPaginatedOrdersController(
  req: Request,
  res: Response,
) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const status = req.query.status as string | undefined;
    const frequency = req.query.frequency as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    const result = await getPaginatedOrdersList({
      page,
      limit,
      status,
      frequency,
      search,
      sortBy,
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching paginated orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateOrderStatusController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: OrderStatus };

    const orderId = typeof id === "string" ? id : id[0];

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ error: "Order ID and status are required" });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (updatedOrder.customerEmail) {
      try {
        await sendOrderStatusEmail(
          updatedOrder.customerEmail,
          updatedOrder.orderName,
          updatedOrder.orderNumber,
          mapStatusToEmailStatus(updatedOrder.status),
        );
      } catch (emailError) {
        console.error("Error sending order status email:", emailError);
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
