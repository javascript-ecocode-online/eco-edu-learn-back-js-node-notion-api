import express from 'express';
import { getSiblingPages } from '../../services/notion/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const siblings = await getSiblingPages(req.query.pageId);
    res.json(siblings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;