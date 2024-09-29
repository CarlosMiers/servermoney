import { Router } from "express";
import { getTodos } from '../controllers/ofertas';
import validateToken from './validate-token';

const router = Router();

//router.get('/renta', validateToken, getOfertas)
//router.get('/id', validateToken, getOfertasId)
    
router.get('/',validateToken,getTodos)
//router.get('/',validateToken,getOfertasId);


export default router;