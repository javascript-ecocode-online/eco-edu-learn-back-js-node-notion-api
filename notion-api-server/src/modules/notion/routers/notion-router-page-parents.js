import express from 'express';
import { EcoNotionControllerPageParents } from '../controllers/notion-controller-page-parents.js';

const router = express.Router();
const controller = new EcoNotionControllerPageParents({ name: 'EcoPageParentsController' });

router.get('/:tk/:pageId', controller.getParents);

export default router;