import express from 'express';
import { EcoNotionControllerQuestionsDbs } from '../controllers/notion-controller-db-questions-dbs.js';

const router = express.Router();
const controller = new EcoNotionControllerQuestionsDbs({ name: 'EcoNotionControllerQuestionsDbs' });

router.get('/:tk/:pageId', controller.getDbId);

export default router;