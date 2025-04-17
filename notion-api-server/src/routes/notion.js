import express from 'express';
import {
  notion,
  getChildrenPages,
  getPageContent,
} from '../services/notionService.js';

const router = express.Router();

// GET /api/notion/children?pageId=...
router.get('/children', async (req, res) => {
  const { pageId } = req.query;
  try {
    const children = await getChildrenPages(pageId);
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;