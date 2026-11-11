import { Router } from "express";
import homeRouter from "./home/homeRouter";
import productRouter from "./products/productRouter";
import orderRouter from "./orders/orderRouter";
import promotionRouter from "./promotions/promotionRouter";
import clientRouter from "./clients/clientRouter";
import userRouter from "./users/userRouter";
import authRouter from "./auth/authRouter";
import { verifyToken } from "../../middlewares/dashboard/auth/verifyToken";

const router = Router();

router.use("/auth", authRouter);

// Protect all dashboard business routes with verifyToken
router.use("/home", verifyToken, homeRouter);
router.use("/products", verifyToken, productRouter);
router.use("/orders", verifyToken, orderRouter);
router.use("/promotions", verifyToken, promotionRouter);
router.use("/clients", verifyToken, clientRouter);
router.use("/users", verifyToken, userRouter);

export default router;
