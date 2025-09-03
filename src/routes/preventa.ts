import { Router } from 'express';
import { create, update, getByNumero, getListadoPreventa,getListadoPreventaActivos } from '../controllers/preventa';
import validateToken from './validate-token';

const router = Router();

router.post('/', validateToken, create);
router.put('/:id', validateToken, update);
router.get('/id/:id', validateToken, getByNumero);
router.get('/', validateToken, getListadoPreventa);
router.get('/activos', validateToken, getListadoPreventaActivos); // <- ¡Esta es la nueva línea!
export default router;


