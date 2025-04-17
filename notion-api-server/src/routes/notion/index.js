import express from 'express';
import getChildren from './getChildren.js';
import getParents from './getParents.js';
import getSiblings from './getSiblings.js';
import getBlocks from './getBlocks.js';
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