import { Router } from "express";
import homeRouter from "./home/homeRouter";
import productRouter from "./products/productRouter";
import orderRouter from "./orders/orderRouter";
import promotionRouter from "./promotions/promotionRouter";

const router = Router();

router.use("/home", homeRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/promotions", promotionRouter);

export default router;
