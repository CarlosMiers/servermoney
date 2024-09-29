import { Router } from 'express';
import validateToken from './validate-token';
import { getVencimientoCartera } from '../controllers/vencimiento_cartera'; 

const router = Router();
router.get('/',validateToken, getVencimientoCartera);
//router.get('/', getVencimientoCartera);

export default router;