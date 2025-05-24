import { Router } from "express";
import { UpdateProductos, getIdProducto, NewProducto, getTodosPaginado,getTodos } from '../controllers/productos';
import validateToken from './validate-token';

const router = Router();

router.put('/id',validateToken,UpdateProductos);
router.post('/id',validateToken,getIdProducto);
router.post('/',validateToken, NewProducto);
router.get('/',validateToken, getTodosPaginado);
router.get('/',validateToken, getTodos);
export default router;