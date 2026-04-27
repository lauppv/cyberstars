import { Router } from "express";
import * as codeController from "../controllers/codeController.js";

const router = Router();

router.post("/", codeController.executeCode);

export default router;
