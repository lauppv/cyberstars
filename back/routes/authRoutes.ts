import { Router } from "express";
import { authenticateToken } from "../middleware/authToken.js";
import * as authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authController.me);

export default router;
