import express from 'express';
import { NotionQueryChildren } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nqc = NotionQueryChildren.instance
    const reason = 'api-get-blocks'
    const blocks = await nqc.getPageBlocks(reason, req.query.pageId);
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;