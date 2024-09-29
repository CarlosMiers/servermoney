import { Router } from 'express';
import {getCarteraRentaFijaEmisor} from '../controllers/cartera_renta_fija_emisor';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getCarteraRentaFijaEmisor);

export default router;