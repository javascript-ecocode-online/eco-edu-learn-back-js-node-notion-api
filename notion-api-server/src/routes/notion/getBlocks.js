import express from 'express';
import { getPageBlocks } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const blocks = await getPageBlocks(req.query.pageId);
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;