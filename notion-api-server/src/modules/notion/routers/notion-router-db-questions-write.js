import express from 'express';
import { EcoNotionControllerQuestionsWrite } from '../controllers/notion-controller-db-questions-write.js';

const router = express.Router();
const controller = new EcoNotionControllerQuestionsWrite({ name: 'EcoPageChildrenController' });

router.get('/:tk/:pageId', controller.getDbId);

export default router;