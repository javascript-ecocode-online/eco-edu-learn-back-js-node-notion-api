import express from 'express';
import { EcoNotionControllerPageQuestions } from '../controllers/notion-controller-page-questions.js';

const router = express.Router();
const controller = new EcoNotionControllerPageQuestions({ name: 'EcoNotionControllerPageQuestions' });

router.get('/:tk/:pageId', controller.getPageQuestions);

export default router;