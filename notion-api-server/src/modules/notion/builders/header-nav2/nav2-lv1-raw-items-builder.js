import { EcoNotionBuilderLv1DataText as Base } from '../base/builder-lv1-data-text.js'
import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
//import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { EcoNotionNav2Lv1EndComparer } from './nav2-lv1-end-comparer.js'
import { EcoNotionNav2Lv1EndItemsBuilder } from './nav2-lv1-end-items-builder.js'
// Lớp này chịu trách nhiêm tạo dữ liệu cho dòng text nav1 lv1
export class EcoNotionNav2Lv1RawItemsBuilder extends Base {
  _pageId
  _pageBlocks
  _parents
  _children
  _friends
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav2Lv1RawItemsBuilder',
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

  #getEndBlockComparer () {
    const textBuilder = new EcoNotionNav2Lv1EndItemsBuilder()
    const cp = new EcoNotionNav2Lv1EndComparer()
    cp.setTextBuilder(textBuilder).prepare()
    return cp
  }

  //Override
  getMenuItemData () {
    const me = this
    const helper = NotionJsonArrayHelper
    const backPage = helper.getBackPageId(
      me._pageId,
      me._friends,
      me._parents
    )
    const backPageId = backPage?.id
    const isBackPageParent = backPage?.isParent

    const nextPage = helper.getNextPageId(
      me._pageId,
      me._friends,
      me._parents
    )
    const nextPageId = nextPage?.id
    const isNextPageParent = nextPage?.isParent

    const childPageId = helper.getFirstChildPageId(me._children)

    const comparer = me.#getEndBlockComparer()
    const endBlockId = helper.getEndNavBlockId(me._pageBlocks, comparer)
    //const pageId = me._pageId
    const tpl = EcoNotionTemplateLv1.nav2Template
    const backUrl = backPageId ? nUrl.getNotionUrl(backPageId) : undefined
    const endUrl = endBlockId ? nUrl.getNotionBlockUrl(me._pageId, endBlockId) : undefined
    let chidUrl = childPageId ? nUrl.getNotionUrl(childPageId) : undefined
    const nextUrl = nextPageId ? nUrl.getNotionUrl(nextPageId) : undefined

    let ischildPageEnd = false
    if (!chidUrl) {
      chidUrl = endUrl
      ischildPageEnd = true
    }
    //const cleanId = nId.cleanId(pageId)
    const items = [
      {
        emoji: isBackPageParent? tpl.back.parent : tpl.back.emoji,
        label: tpl.back.label,
        url: backUrl,
      },
      {
        emoji: tpl.end.emoji,
        label: tpl.end.label,
        url: endUrl,
      },
      {
        emoji: ischildPageEnd? tpl.chid.parent: tpl.chid.emoji,
        label: tpl.chid.label,
        url: chidUrl,
      },
      {
        emoji: isNextPageParent? tpl.next.parent: tpl.next.emoji,
        label: tpl.next.label,
        url: nextUrl,
      },
    ]
    return items
  }
}
