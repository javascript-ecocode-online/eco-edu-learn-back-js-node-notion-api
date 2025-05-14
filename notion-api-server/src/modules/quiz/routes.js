import express from 'express';
import questionsRouter from './routers/quiz_router_questions.js'

const router = express.Router();
router.use('/questions', questionsRouter);
export default router;