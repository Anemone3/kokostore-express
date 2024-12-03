import { Router } from "express";
import {getUserById, loginUser, registerUser} from '../app/controllers/users.controllers.js'
import { verifyToken } from "../app/middlewares/tokenAuth.js";

const router = Router();



router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/:id_supabase',verifyToken, getUserById)

export default router;