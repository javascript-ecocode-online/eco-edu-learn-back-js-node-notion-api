import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
import { EcoNotionServiceQueryParents } from './notion-service-query-parents.js'
import { EcoNotionServiceQueryChildren } from './notion-service-query-children.js'
import { EcoNotionServiceQuerySiblings } from './notion-service-query-siblings.js'
import { EcoNotionBuilderNav1Lv1 } from '../builders/header-nav1/notion-builder-nav1-lv1.js'

export class EcoNotionServiceBuildPage extends Base {
  constructor () {
    super({ name: 'NotionBuildPage', isDebug: true, level: 'info' })
  }
  
  async buildPage (reason, pageId) {
    const me = this
    const logName = `> buildPage > ${reason}`
    me._logInfoBegin(logName, pageId)

    const nqc = EcoNotionServiceQueryChildren.instance
    const nqp = EcoNotionServiceQueryParents.instance
    const nqs = EcoNotionServiceQuerySiblings.instance
    const [parents, friends, children] = await Promise.all([
      nqp.getAllParentPages(reason, pageId),
      nqs.getSiblingPages(reason, pageId),
      nqc.getChildrenPages(reason, pageId),
    ])

    const nav1Builder = new EcoNotionBuilderNav1Lv1(pageId, parents, friends, children)
    const blocks = await nav1Builder.execute()
    const rs = { success: true, 'new-lv2-block': blocks}

    me._logInfoEnd(logName, blocks)
    return rs
  }
}
