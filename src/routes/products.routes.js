import { Router } from "express";
import { productController } from "../app/controllers/products.controllers.js";

const router = Router();


//El posicionamiento de las rutas es importante, porque si pones la ruta /:id al comienzo, /paginated tendra problemas
router.get('/',productController.getProducts);
router.get('/paginated', productController.getProductPaginated);
router.get('/:id',productController.getProductById);
router.get('/category/:id',productController.getProductCategoryId);


export default router;