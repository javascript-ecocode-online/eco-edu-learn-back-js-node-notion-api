import express from 'express';
import { getChildrenPages } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const children = await getChildrenPages(req.query.pageId);
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;