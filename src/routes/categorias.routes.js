import { Router } from "express";
import  categoryController  from "../app/controllers/category.controllers.js"

const router = Router();


router.get('/',categoryController.getCategories);


export default router;