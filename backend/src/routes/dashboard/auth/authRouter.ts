import { Router } from "express";
import { loginController } from "../../../controllers/dashboard/authController";

const router = Router();

router.post("/login", loginController);

export default router;
