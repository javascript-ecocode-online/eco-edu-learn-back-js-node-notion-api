import express from 'express';
import {
  getAllParentPages,
  getSiblingPages,
  getChildrenPages,
} from '../../services/notion/index.js';
import { notion } from '../../config/notionClient.js';
import { buildNavBlocks } from '../../services/notion/navBuilder.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const pageId = req.body.pageId;
  if (!pageId) return res.status(400).json({ error: 'Missing pageId' });

  try {
    const [parents, friends, children] = await Promise.all([
      getAllParentPages(pageId),
      getSiblingPages(pageId),
      getChildrenPages(pageId),
    ]);

    const blocks = buildNavBlocks({ parents, friends, children });

    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });

    res.json({ success: true, insertedBlocks: blocks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;