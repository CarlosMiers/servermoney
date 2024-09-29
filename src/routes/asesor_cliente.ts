import { Router } from 'express';
import { getAsesor } from '../controllers/asesor_cliente';
import validateToken from './validate-token';
const router = Router();
router.get('/',validateToken,getAsesor);
//router.get('/',getAsesor);
export default router;