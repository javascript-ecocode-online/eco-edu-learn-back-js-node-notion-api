import express from 'express';
import { EcoNotionControllerPageInfo } from '../controllers/notion-controller-page-info.js';

const router = express.Router();
const controller = new EcoNotionControllerPageInfo({ name: 'EcoNotionControllerPageInfo' });

router.get('/:tk/:pageId', controller.getPageInfo);

export default router;