import { Router } from 'express';
import { getCobranzasCabecera,crearCobranza,modificarCobranza } from '../controllers/cobranzas';
import validateToken from './validate-token';

const router = Router();

router.post('/', validateToken, crearCobranza);
router.put('/:id', validateToken, modificarCobranza);
router.get('/', validateToken, getCobranzasCabecera);
export default router;