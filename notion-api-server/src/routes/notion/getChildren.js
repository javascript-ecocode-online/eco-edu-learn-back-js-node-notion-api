import express from 'express';
import { NotionQueryChildren } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nqc = NotionQueryChildren.instance
    const reason = 'api-get-children'
    const children = await nqc.getChildrenPages(reason, req.query.pageId);
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;