import { Router } from 'express';
import { getListadoVentas,createVenta,getByFactura,updateVenta } from '../controllers/ventas';
import validateToken from './validate-token';

const router = Router();

router.post('/', validateToken, createVenta);
router.put('/:id', validateToken, updateVenta);
router.get('/id/:id', validateToken, getByFactura);
router.get('/', validateToken, getListadoVentas);

export default router;