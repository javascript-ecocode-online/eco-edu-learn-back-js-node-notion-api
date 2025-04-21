import express from 'express';
import { EcoPageChildrenController } from '../controllers/page-children-controller.js';

const router = express.Router();
const controller = new EcoPageChildrenController({ name: 'EcoPageChildrenController' });

router.get('/:pageId', controller.getChildren);

export default router;