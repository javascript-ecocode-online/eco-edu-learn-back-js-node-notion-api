import express from 'express';
import getChildren from './routers/notion-router-page-children.js';
import getParents from './routers/notion-router-page-parents.js';
import getSiblings from './routers/notion-router-page-siblings.js';
import getInfo from './routers/notion-router-page-info.js';
import getBlocks from './routers/notion-router-page-blocks.js';
import getRelations from './routers/notion-router-page-relations.js'; // thêm dòng này
import buildPage from './routers/notion-router-page-build.js';
import getQuestionsWrite from './routers/notion-router-db-questions-write.js';
import getQuestionsDbs from './routers/notion-router-db-questions-dbs.js';
import getPageQuestions from './routers/notion-router-page-questions.js';
import getPageWriteQuestions from './routers/notion-router-page-write-questions.js';

const router = express.Router();

router.use('/info', getInfo);
router.use('/children', getChildren);
router.use('/parents', getParents);
router.use('/friends', getSiblings);
router.use('/blocks', getBlocks);
router.use('/relations', getRelations); // thêm dòng này
router.use('/build-page', buildPage);
router.use('/get-page-questions', getPageQuestions);
router.use('/get-page-write-questions', getPageWriteQuestions);
router.use('/get-questions-dbs', getQuestionsDbs);
router.use('/get-questions-write', getQuestionsWrite);

export default router;