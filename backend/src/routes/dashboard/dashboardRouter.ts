import { Router } from "express";
import homeRouter from "./home/homeRouter";
import productRouter from "./products/productRouter";
import orderRouter from "./orders/orderRouter";

const router = Router();

router.use("/home", homeRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);

export default router;
