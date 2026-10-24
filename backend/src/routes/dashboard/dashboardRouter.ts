import { Router } from "express";
import homeRouter from "./home/homeRouter"

const router=Router()

router.use("/home", homeRouter )


export default router