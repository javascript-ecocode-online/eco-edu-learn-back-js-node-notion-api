import { Router } from "express";
const router = Router();
import { notion } from "../services/notionService";

// Get children of a page
router.get("/children/:pageId", async (req, res) => {
  const { pageId } = req.params;
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    res.json({pageId: pageId, data: response.results});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;