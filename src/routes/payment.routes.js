import { Router } from "express";
import { createPayment, executePayment } from "../app/controllers/paypal.controller.js";


const router = Router();


router.post("/create",createPayment);
router.get("/success", executePayment)

export default router;