import express from 'express';
import {
  getChildrenPages,
  getAllParentPages,
  getSiblingPages,
  getPageBlocks,
} from '../services/notionService.js';

const router = express.Router();

router.get('/children', async (req, res) => {
  const { pageId } = req.query;
  try {
    const children = await getChildrenPages(pageId);
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/parents', async (req, res) => {
  const { pageId } = req.query;
  try {
    const parents = await getAllParentPages(pageId);
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/friends', async (req, res) => {
  const { pageId } = req.query;
  try {
    const siblings = await getSiblingPages(pageId);
    res.json(siblings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 API mới: GET /api/notion/blocks?pageId=...
router.get('/blocks', async (req, res) => {
  const { pageId } = req.query;
  try {
    const blocks = await getPageBlocks(pageId);
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;