import { Router } from 'express';
import { getListadoVentas,createVenta } from '../controllers/ventas';
import validateToken from './validate-token';

const router = Router();

router.post('/', validateToken, createVenta);
//router.put('/:id', validateToken, update);
//router.get('/id/:id', validateToken, getByNumero);
router.get('/', validateToken, getListadoVentas);

export default router;