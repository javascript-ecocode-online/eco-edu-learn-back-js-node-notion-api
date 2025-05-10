import express from 'express';
import { EcoNotionControllerPageWriteQuestions } from '../controllers/notion-controller-page-write-questions.js';

const router = express.Router();
const controller = new EcoNotionControllerPageWriteQuestions({ name: 'EcoNotionControllerPageQuestions' });

router.get('/:tk/:pageId', controller.getPageWriteQuestions);

export default router;