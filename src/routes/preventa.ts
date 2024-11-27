import { Router } from 'express';
import {create,update,getByNumero, getListadoPreventa} from '../controllers/preventa';
import validateToken from './validate-token';

const router = Router();

router.post('/', validateToken, create);
router.put('/id', validateToken,update);
router.get('/id', validateToken,getByNumero);
//router.get('/preventa-listado/id',validateToken, getListadoPreventa);
router.get('/',validateToken,getListadoPreventa);

export default router;