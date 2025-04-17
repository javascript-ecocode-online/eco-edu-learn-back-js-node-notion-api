import express from 'express';
import { getAllParentPages } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const parents = await getAllParentPages(req.query.pageId);
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;