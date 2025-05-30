import { Router } from "express";
import { getUsuarios, newUser, loginUser } from '../controllers/users';
import validateToken from './validate-token';

const router = Router();

router.get('/', validateToken, getUsuarios)
router.post('/', newUser)
router.post('/login', loginUser)


export default router;