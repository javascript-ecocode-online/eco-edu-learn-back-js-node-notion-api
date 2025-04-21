import express from 'express';
import getChildren from '../../modules/notion/routers/page-children-router.js';
import getParents from '../../modules/notion/routers/page-parents-router.js';
import getSiblings from '../../modules/notion/routers/get-siblings-router.js';
import getBlocks from '../../modules/notion/routers/page-blocks-router.js';
import summaryRoute from './getSummary.js'; // thêm dòng này
import cacheNavRoute from './cacheNav.js';

const router = express.Router();

router.use('/children', getChildren);
router.use('/parents', getParents);
router.use('/friends', getSiblings);
router.use('/blocks', getBlocks);
router.use('/summary', summaryRoute); // thêm dòng này
router.use('/cache-nav', cacheNavRoute);

export default router;