import express from 'express';
import {
  getChildrenPages,
  getAllParentPages,
  getSiblingPages,
  getPageBlocks
} from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { pageId } = req.query;
  if (!pageId) {
    return res.status(400).json({ error: 'Missing pageId' });
  }

  try {
    const [children, parents, friends, blocks] = await Promise.all([
      getChildrenPages(pageId),
      getAllParentPages(pageId),
      getSiblingPages(pageId),
      getPageBlocks(pageId)
    ]);

    res.json({
      pageId,
      children,
      parents,
      friends,
      blocks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;