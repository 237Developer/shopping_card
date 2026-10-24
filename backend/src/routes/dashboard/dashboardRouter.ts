import { Router } from "express";
import homeRouter from "./home/homeRouter"
import productRouter from "./products/productRouter"

const router=Router()

router.use("/home", homeRouter )
router.use("/products", productRouter)

export default router