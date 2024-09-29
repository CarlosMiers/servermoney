import { Router } from 'express';
import validateToken from './validate-token';
import { getCarteraAccionesDetallado } from '../controllers/cartera_acciones_detalle';

const router = Router();
router.get('/',validateToken, getCarteraAccionesDetallado);

export default router;