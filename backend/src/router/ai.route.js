import { Router } from "express";
import { AiRespond } from "../controllers/ai.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected AI endpoint - requires authenticated user
router.post("/respond", UserVerify, AiRespond);

export default router;
