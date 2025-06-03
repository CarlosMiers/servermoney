import { Router } from "express";
import { UpdateCajas, getTodos, getIdCaja, NewCaja, getTodosPaginado } from '../controllers/cajas';
import validateToken from './validate-token';

const router = Router();

router.put('/id', validateToken, UpdateCajas);
router.post('/id', validateToken, getIdCaja);
router.post('/', validateToken, NewCaja);
router.get('/', validateToken, getTodosPaginado);
router.get('/', validateToken, getTodos);

export default router;