import express from 'express';
import { EcoPageBlocksController } from '../controllers/page-blocks-controller.js';

const router = express.Router();
const controller = new EcoPageBlocksController({ name: 'EcoPageBlocksController' });

router.get('/:pageId', controller.getPageBlocks);

export default router;