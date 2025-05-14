import express from 'express'
import { ExportWQuestionsController } from '../controllers/export-controller-questions-write.js';



const router = express.Router()
const controller = new ExportWQuestionsController({ name: 'ExportWQuestionsController' });

router.post('/:tk/:pageId',controller.exportWQuestions);


export default router
