import express from 'express';
import getChildren from './getChildren.js';
import getParents from './getParents.js';
import getSiblings from './getSiblings.js';
import getBlocks from './getBlocks.js';

const router = express.Router();

router.use('/children', getChildren);
router.use('/parents', getParents);
router.use('/friends', getSiblings);
router.use('/blocks', getBlocks);

export default router;