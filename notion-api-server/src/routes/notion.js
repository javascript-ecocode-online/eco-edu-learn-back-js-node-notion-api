const express = require("express");
const router = express.Router();
const { notion } = require("../services/notionService");

// Get children of a page
router.get("/children/:pageId", async (req, res) => {
  const { pageId } = req.params;
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    res.json(response.results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;