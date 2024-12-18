import { Router } from "express";
import { createOrder, orderUserId } from "../app/controllers/order.controllers.js";
import { verifyToken } from "../app/middlewares/tokenAuth.js";


const router = Router();



router.post("/create",verifyToken,createOrder);
router.get("/:id",verifyToken,orderUserId);


export default router;