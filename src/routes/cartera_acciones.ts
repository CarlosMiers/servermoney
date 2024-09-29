import { Router } from 'express';
import {getCarteraAcciones} from '../controllers/cartera_acciones';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getCarteraAcciones);

export default router;