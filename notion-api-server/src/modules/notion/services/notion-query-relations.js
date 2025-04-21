import { NotionQueryBase as Base } from './notion-query-base.js'
import { NotionQueryParents } from './notion-query-parents.js'
import { NotionQueryChildren } from './notion-query-children.js'
import { NotionQuerySiblings } from './notion-query-siblings.js'

export class NotionQueryRelations extends Base {
  constructor () {
    super({ name: 'NotionQueryRelations', isDebug: true, level: 'info' })
  }
  async getRelations (reason, pageId) {
    const me = this
    const logName = `> getSiblingPages > ${reason}`
    me._logInfoBegin(logName, pageId)

    const nqc = NotionQueryChildren.instance
    const nqp = NotionQueryParents.instance
    const nqs = NotionQuerySiblings.instance
    const blocks = await nqc.getPageBlocks(reason, pageId)
    const [children, parents, friends] = await Promise.all([
      nqc.getChildrenPages(reason, blocks),
      nqp.getAllParentPages(reason, pageId),
      nqs.getSiblingPages(reason, pageId),
    ])
    const rs = {
      pageId,
      children,
      parents,
      friends,
      blocks,
    }
    me._logInfoEnd(
      logName,
      `children: ${children.length} | parents: ${parents.length} | friends: ${friends.length} | blocks: ${blocks.length}`
    )
    return rs
  }
}
