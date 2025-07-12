import { Router } from "express";
import { UpdateCajas, getTodos, getIdCaja, NewCaja, getTodosPaginado, UpdateCajaFactura,UpdateCajaImpresora } from '../controllers/cajas';
import validateToken from './validate-token';

const router = Router();

router.put('/id', validateToken, UpdateCajas);
router.post('/id', validateToken, getIdCaja);
router.post('/', validateToken, NewCaja);
router.get('/', validateToken, getTodosPaginado);
router.get('/', validateToken, getTodos);
router.put("/update-factura", validateToken,UpdateCajaFactura);
router.put("/update-impresora", validateToken,UpdateCajaImpresora);

export default router;