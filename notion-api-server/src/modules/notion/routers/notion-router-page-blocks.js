import express from 'express';
import { EcoNotionControllerPageBlocks } from '../controllers/notion-controller-page-blocks.js';

const router = express.Router();
const controller = new EcoNotionControllerPageBlocks({ name: 'EcoPageBlocksController' });

router.get('/:tk/:pageId', controller.getPageBlocks);

export default router;