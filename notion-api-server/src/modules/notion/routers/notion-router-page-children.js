import express from 'express';
import { EcoNotionControllerPageChildren } from '../controllers/notion-controller-page-children.js';

const router = express.Router();
const controller = new EcoNotionControllerPageChildren({ name: 'EcoPageChildrenController' });

router.get('/:pageId', controller.getChildren);

export default router;