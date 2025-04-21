import { NotionQueryBase as Base } from './notion-query-base.js'
import { NotionQueryParents } from './notion-query-parents.js'
import { NotionQueryChildren } from './notion-query-children.js'
import { NotionQuerySiblings } from './notion-query-siblings.js'
import { Nav1Lv1Builder } from '../../../services/build/header/nav1/nav1Lv1.js'

export class NotionBuildPage extends Base {
  constructor () {
    super({ name: 'NotionBuildPage', isDebug: true, level: 'info' })
  }
  async buildPage (reason, pageId) {
    const me = this
    const logName = `> buildPage > ${reason}`
    me._logInfoBegin(logName, pageId)

    const nqc = NotionQueryChildren.instance
    const nqp = NotionQueryParents.instance
    const nqs = NotionQuerySiblings.instance
    const [parents, friends, children] = await Promise.all([
      nqp.getAllParentPages(reason, pageId),
      nqs.getSiblingPages(reason, pageId),
      nqc.getChildrenPages(reason, pageId),
    ])

    const nav1Builder = new Nav1Lv1Builder(pageId, parents, friends, children)
    const blocks = await nav1Builder.execute()
    const rs = { success: true, 'new-lv2-block': blocks}

    me._logInfoEnd(logName, blocks)
    return rs
  }
}
