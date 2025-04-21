import express from 'express';
import getChildren from './routers/page-children-router.js';
import getParents from './routers/page-parents-router.js';
import getSiblings from './routers/page-siblings-router.js';
import getBlocks from './routers/page-blocks-router.js';
import getRelations from './routers/page-relations-router.js'; // thêm dòng này
import cacheNavRoute from './routers/build-page-router.js';

const router = express.Router();

router.use('/children', getChildren);
router.use('/parents', getParents);
router.use('/friends', getSiblings);
router.use('/blocks', getBlocks);
router.use('/relations', getRelations); // thêm dòng này
router.use('/build-page', cacheNavRoute);

export default router;