import { Router } from "express";
import { getStockProducto } from '../controllers/stock';
import validateToken from './validate-token';

const router = Router();
router.get('/',getStockProducto);

export default router;