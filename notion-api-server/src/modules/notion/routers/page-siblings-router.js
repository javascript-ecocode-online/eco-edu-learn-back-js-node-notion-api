import express from 'express';
import { EcoPageSiblingsController } from '../controllers/page-siblings-controller.js';

const router = express.Router();
const controller = new EcoPageSiblingsController({ name: 'EcoPageSiblingsController' });

router.get('/:pageId', controller.getSiblings);

export default router;