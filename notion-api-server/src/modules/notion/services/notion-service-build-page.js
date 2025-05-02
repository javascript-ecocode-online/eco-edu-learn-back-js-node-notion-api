import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
import { EcoNotionServiceQueryPage } from './notion-service-query-page.js'

import { EcoNotionServiceQueryParents } from './notion-service-query-parents.js'
import { EcoNotionServiceQueryChildren } from './notion-service-query-children.js'
import { EcoNotionServiceQuerySiblings } from './notion-service-query-siblings.js'
import { EcoNotionNav1Lv1Builder } from '../builders/header-nav1/nav1-lv1-builder.js'
import { EcoNotionNav2Lv1Builder } from '../builders/header-nav2/nav2-lv1-builder.js'
import { EcoNotionNav3Lv1Builder } from '../builders/header-nav3/nav3-lv1-builder.js'
import { EcoNotionParagraphLv0Builder } from '../builders/content/paragraph-lv0-builder.js'

export class EcoNotionServiceBuildPage extends Base {
  constructor () {
    super({ name: 'NotionBuildPage', isDebug: false, level: 'info' })
  }

  async buildPage (reason, pageId, options) {
    const me = this
    const logName = `> buildPage > ${reason}`
    me._logInfoBegin(logName, pageId)
    const nqPage = EcoNotionServiceQueryPage.instance
    const nQChildren = EcoNotionServiceQueryChildren.instance
    const nQParents = EcoNotionServiceQueryParents.instance
    const nQSiblings = EcoNotionServiceQuerySiblings.instance
    const [parents, friends, children, info, pageBlocks] = await Promise.all([
      nQParents.getAllParentPages(reason, pageId),
      nQSiblings.getSiblingPages(reason, pageId),
      nQChildren.getChildrenPages(reason, pageId),
      nqPage.getPageInfo(reason, pageId),
      nQChildren.getPageBlocks(reason, pageId),
    ])
    const obj = {}
    if (options.buildNav1) {
      console.log('👉 ----- Start build Nav1...')
      const nav1Builder = new EcoNotionNav1Lv1Builder(
        pageId,
        info,
        parents,
        friends,
        children,
        pageBlocks
      )
      obj['nav1'] = await nav1Builder.execute()
      console.log('👍 ----- Build Nav1 done!')
    }

    if (options.buildNav2) {
      console.log('👉 ----- Start build Nav2...')
      //const nav1Blocks = []
      const nav2Builder = new EcoNotionNav2Lv1Builder(
        pageId,
        info,
        parents,
        friends,
        children,
        pageBlocks
      )
      obj['nav2'] = await nav2Builder.execute()
      console.log('👍 ----- Build Nav2 done!')
    }

    if (options.buildNav3) {
      console.log('👉 ----- Start build Nav3...')
      //const nav1Blocks = []
      const nav3Builder = new EcoNotionNav3Lv1Builder(
        pageId,
        info,
        parents,
        friends,
        children,
        pageBlocks
      )
      obj['nav3'] = await nav3Builder.execute()
      console.log('👍 ----- Build Nav3 done!')
    }

    if (options.buildParagraphs) {
      console.log('👉 ----- Start build Paragraphs...')
      const paragrapsBuilder = new EcoNotionParagraphLv0Builder(
        pageId,
        pageBlocks
      )
      obj['paragraps'] = await paragrapsBuilder.execute()
      console.log('👍 ----- Build Paragraphs done!')
    }

    //const nav2Blocks = []
    const rs = { success: true, result: obj }

    me._logInfoEnd(logName, rs)
    return rs
  }
}
