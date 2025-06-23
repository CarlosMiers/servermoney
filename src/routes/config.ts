import Router from 'express';
import { getConfig } from '../controllers/config';
const router = Router();   

router.get('/', getConfig);

export default router;