import express from 'express';
import { EcoNotionControllerPageSiblings } from '../controllers/notion-controller-page-siblings.js';

const router = express.Router();
const controller = new EcoNotionControllerPageSiblings({ name: 'EcoPageSiblingsController' });

router.get('/:pageId', controller.getSiblings);

export default router;