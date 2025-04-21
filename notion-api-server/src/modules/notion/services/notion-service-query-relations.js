import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
import { EcoNotionServiceQueryParents } from './notion-service-query-parents.js'
import { EcoNotionServiceQueryChildren } from './notion-service-query-children.js'
import { EcoNotionServiceQuerySiblings } from './notion-service-query-siblings.js'

export class EcoNotionServiceQueryRelations extends Base {
  constructor () {
    super({ name: 'NotionQueryRelations', isDebug: true, level: 'info' })
  }
  async getRelations (reason, pageId) {
    const me = this
    const logName = `> getSiblingPages > ${reason}`
    me._logInfoBegin(logName, pageId)

    const nqc = EcoNotionServiceQueryChildren.instance
    const nqp = EcoNotionServiceQueryParents.instance
    const nqs = EcoNotionServiceQuerySiblings.instance
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
