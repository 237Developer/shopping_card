import { Router } from "express";
import homeRouter from "./home/homeRouter";
import productRouter from "./products/productRouter";
import orderRouter from "./orders/orderRouter";
import promotionRouter from "./promotions/promotionRouter";
import clientRouter from "./clients/clientRouter";
import authRouter from "./auth/authRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/promotions", promotionRouter);
router.use("/clients", clientRouter);

export default router;
