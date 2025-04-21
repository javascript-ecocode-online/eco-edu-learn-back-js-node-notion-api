import express from 'express'
import {
  NotionQueryChildren,
  NotionQueryParents,
  getSiblingPages,
} from '../../services/notion/index.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { pageId } = req.query
  if (!pageId) {
    return res.status(400).json({ error: 'Missing pageId' })
  }

  try {
    const nqc = NotionQueryChildren.instance
    const nqp = NotionQueryParents.instance
    const reason = 'api-get-summary'
    const blocks = await nqc.getPageBlocks(reason, pageId)
    const [children, parents, friends] = await Promise.all([
      nqc.getChildrenPages(reason, blocks),
      nqp.getAllParentPages(reason, pageId),
      getSiblingPages(pageId),
    ])

    res.json({
      pageId,
      children,
      parents,
      friends,
      blocks,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
