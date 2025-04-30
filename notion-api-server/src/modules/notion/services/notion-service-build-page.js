import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
import { EcoNotionServiceQueryPage } from './notion-service-query-page.js'

import { EcoNotionServiceQueryParents } from './notion-service-query-parents.js'
import { EcoNotionServiceQueryChildren } from './notion-service-query-children.js'
import { EcoNotionServiceQuerySiblings } from './notion-service-query-siblings.js'
import { EcoNotionNav1Lv1Builder } from '../builders/header-nav1/nav1-lv1-builder.js'

export class EcoNotionServiceBuildPage extends Base {
  constructor () {
    super({ name: 'NotionBuildPage', isDebug: false, level: 'info' })
  }

  async buildPage (reason, pageId) {
    const me = this
    const logName = `> buildPage > ${reason}`
    me._logInfoBegin(logName, pageId)
    const nqPage = EcoNotionServiceQueryPage.instance
    const nQChildren = EcoNotionServiceQueryChildren.instance
    const nQParents = EcoNotionServiceQueryParents.instance
    const nQSiblings = EcoNotionServiceQuerySiblings.instance
    const [parents, friends, children, info] = await Promise.all([
      nQParents.getAllParentPages(reason, pageId),
      nQSiblings.getSiblingPages(reason, pageId),
      nQChildren.getChildrenPages(reason, pageId),
      nqPage.getPageInfo(reason, pageId)
    ])

    const nav1Builder = new EcoNotionNav1Lv1Builder(
      pageId,
      info,
      parents,
      friends,
      children
    )
    const blocks = await nav1Builder.execute()
    const rs = { success: true, 'built block': blocks }

    me._logInfoEnd(logName, blocks)
    return rs
  }
}
