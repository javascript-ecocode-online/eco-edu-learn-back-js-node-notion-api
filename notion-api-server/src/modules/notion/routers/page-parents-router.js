import express from 'express';
import { EcoPageParentsController } from '../controllers/page-parents-controller.js';

const router = express.Router();
const controller = new EcoPageParentsController({ name: 'EcoPageParentsController' });

router.get('/:pageId', controller.getParents);

export default router;