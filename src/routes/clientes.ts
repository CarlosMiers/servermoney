import { Router } from "express";
import { UpdateClientes, getTodos,getIdCliente, NewCliente } from '../controllers/clientes';
import validateToken from './validate-token';

const router = Router();

router.put('/id',validateToken,UpdateClientes);
router.post('/id',validateToken,getIdCliente);
router.post('/',validateToken, NewCliente);
router.get('/',validateToken, getTodos)

export default router;