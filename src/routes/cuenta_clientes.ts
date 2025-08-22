import { Router } from "express";
import {consultarCuentasActivas } from '../controllers/cuenta_clientes';
import validateToken from './validate-token';

const router = Router();
router.get('/', validateToken, consultarCuentasActivas);
export default router;