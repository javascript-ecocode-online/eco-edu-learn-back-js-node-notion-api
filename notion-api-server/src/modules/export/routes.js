import express from 'express';
import exportWQuestionsRouter from './routers/export_router_questions.js'

const router = express.Router();
router.use('/w-questions', exportWQuestionsRouter);
export default router;