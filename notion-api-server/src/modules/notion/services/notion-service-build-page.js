import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
import { EcoNotionServiceQueryPage } from './notion-service-query-page.js'

import { EcoNotionServiceQueryParents } from './notion-service-query-parents.js'
import { EcoNotionServiceQueryChildren } from './notion-service-query-children.js'
import { EcoNotionServiceQuerySiblings } from './notion-service-query-siblings.js'
import { EcoNotionBuilderNav1Lv1 } from '../builders/header-nav1/notion-builder-nav1-lv1.js'

export class EcoNotionServiceBuildPage extends Base {
  constructor () {
    super({ name: 'NotionBuildPage', isDebug: false, level: 'info' })
  }

  async buildPage (reason, pageId, buildCfg) {
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

    const nav1Builder = new EcoNotionBuilderNav1Lv1(
      pageId,
      info,
      parents,
      friends,
      children,
      buildCfg
    )
    const blocks = await nav1Builder.execute()
    const rs = { success: true, 'new-lv2-block': blocks }

    me._logInfoEnd(logName, blocks)
    return rs
  }
}
