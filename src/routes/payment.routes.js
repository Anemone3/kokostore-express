import { Router } from "express";
import {
  createPayment,
  executePayment,
} from "../app/controllers/paypal.controller.js";
import { verifyToken } from "../app/middlewares/tokenAuth.js";

const router = Router();

router.post("/create", verifyToken, createPayment);
router.get("/success/:id", verifyToken, executePayment);

export default router;
