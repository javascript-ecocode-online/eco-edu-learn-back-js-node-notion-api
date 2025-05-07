import express from 'express';
import getChildren from './routers/notion-router-page-children.js';
import getParents from './routers/notion-router-page-parents.js';
import getSiblings from './routers/notion-router-page-siblings.js';
import getInfo from './routers/notion-router-page-info.js';
import getBlocks from './routers/notion-router-page-blocks.js';
import getRelations from './routers/notion-router-page-relations.js'; // thêm dòng này
import buildPage from './routers/notion-router-build-page.js';
import getQuestionsWrite from './routers/notion-router-page-questions-write.js';

const router = express.Router();

router.use('/info', getInfo);
router.use('/children', getChildren);
router.use('/parents', getParents);
router.use('/friends', getSiblings);
router.use('/blocks', getBlocks);
router.use('/relations', getRelations); // thêm dòng này
router.use('/build-page', buildPage);
router.use('/questions-write', getQuestionsWrite);
export default router;