import { Router } from 'express';
import { getCobranzasCabecera } from '../controllers/cobranzas';
import validateToken from './validate-token';

const router = Router();

/*router.post('/', validateToken, create);
router.put('/:id', validateToken, update);
router.get('/id/:id', validateToken, getByNumero);*/
router.get('/', validateToken, getCobranzasCabecera);

export default router;