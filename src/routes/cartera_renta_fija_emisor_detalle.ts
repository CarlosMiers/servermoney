import { Router } from 'express';
import validateToken from './validate-token';
import { getCarteraRentaFijaEmisorDetallado } from '../controllers/cartera_renta_fija_emisor_detalle';

const router = Router();
router.get('/',validateToken, getCarteraRentaFijaEmisorDetallado);

export default router;