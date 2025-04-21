import express from 'express'
import {
  NotionQueryParents,
  getSiblingPages,
  NotionQueryChildren,
} from '../../services/notion/index.js'
import { Nav1Lv1Builder } from '../../services/build/index.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const pageId = req.body.pageId
  if (!pageId) return res.status(400).json({ error: 'Missing pageId' })

  try {
     const nqc = NotionQueryChildren.instance
     const nqp = NotionQueryParents.instance
    const reason = 'api-get-cache-nav'
    const [parents, friends, children] = await Promise.all([
      nqp.getAllParentPages(reason, pageId),
      getSiblingPages(pageId),
      nqc.getChildrenPages(reason, pageId),
    ])
   
    const nav1Builder = new Nav1Lv1Builder(pageId, parents, friends, children)
    nav1Builder.execute();
  
    
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
