import { Router } from "express";
import { productController } from "../app/controllers/products.controllers.js";

const router = Router();



router.get('/',productController.getProducts);
router.get('/:id',productController.getProductById);
router.get('/category/:id',productController.getProductCategoryId);

export default router;