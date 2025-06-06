import { EcoNotionBuilderLv1DataText as Base } from '../base/level/builder-lv1-data-text.js'
import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
//import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { EcoNotionTopComparer } from '../header-nav/top-comparer.js'
import { EcoNotionTopItemsBuilder } from '../header-nav/top-items-builder.js'
// Lớp này chịu trách nhiêm tạo dữ liệu cho dòng text nav1 lv1
export class EcoNotionNav3Lv1RawItemsBuilder extends Base {
  _pageId
  _pageBlocks
  _parents
  _children
  _friends
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav3Lv1RawItemsBuilder',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
    return me
  }
  setPageBlocks (pageBlocks) {
    const me = this
    me._pageBlocks = pageBlocks
    return me
  }
  setParents (parents) {
    const me = this
    me._parents = parents
    return me
  }
  setFriends (friends) {
    const me = this
    me._friends = friends
    return me
  }
  setChildren (children) {
    const me = this
    me._children = children
    return me
  }

  #getTopBlockComparer () {
    const textBuilder = new EcoNotionTopItemsBuilder()
    const cp = new EcoNotionTopComparer()
    cp.setTextBuilder(textBuilder).prepare()
    return cp
  }

  //Override
  getMenuItemData () {
    const me = this
    
    const helper = NotionJsonArrayHelper
    const backPage = helper.getBackPageId(me._pageId, me._friends, me._parents)
    const backPageId = backPage?.id
    const isBackPageParent = backPage?.isParent

    const nextPage = helper.getNextPageId(me._pageId, me._friends, me._parents)
    const nextPageId = nextPage?.id
    const isNextPageParent = nextPage?.isParent

    const childPageId = helper.getFirstChildPageId(me._children)

    const comparer = me.#getTopBlockComparer()
    //console.log('### 🐠 Begin: topBlockId')
    const topBlockId = helper.getTopNavBlockId(me._pageBlocks, comparer)
    //const topBlockId = null
    //console.log('### 🐠 End: topBlockId', topBlockId)
    //const pageId = me._pageId
    const tpl = EcoNotionTemplateLv1.nav3Template
    const backUrl = backPageId ? nUrl.getNotionUrl(backPageId) : undefined
    const topUrl = topBlockId
      ? nUrl.getNotionBlockUrl(me._pageId, topBlockId)
      : undefined
    let chidUrl = childPageId ? nUrl.getNotionUrl(childPageId) : undefined
    const nextUrl = nextPageId ? nUrl.getNotionUrl(nextPageId) : undefined

    let ischildPageEnd = false
    if (!chidUrl) {
      chidUrl = topUrl
      ischildPageEnd = true
    }
    //const cleanId = nId.cleanId(pageId)
    const items = [
      {
        emoji: isBackPageParent ? tpl.back.parent : tpl.back.emoji,
        label: tpl.back.label,
        url: backUrl,
      },
      {
        emoji: tpl.top.emoji,
        label: tpl.top.label,
        url: topUrl,
      },
      {
        emoji: ischildPageEnd ? tpl.child.parent : tpl.child.emoji,
        label: tpl.child.label,
        url: chidUrl,
      },
      {
        emoji: isNextPageParent ? tpl.next.parent : tpl.next.emoji,
        label: tpl.next.label,
        url: nextUrl,
      },
    ]
   
    return items
  }
}
