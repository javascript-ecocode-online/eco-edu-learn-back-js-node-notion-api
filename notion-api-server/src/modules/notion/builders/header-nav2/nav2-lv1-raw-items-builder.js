import { EcoNotionBuilderLv1DataText as Base } from '../base/builder-lv1-data-text.js'
import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { NotionIdHelper as nId } from '../../helpers/id/notion-id-helper.js'
// Lớp này chịu trách nhiêm tạo dữ liệu cho dòng text nav1 lv1
export class EcoNotionNav2Lv1RawItemsBuilder extends Base {
  _pageId
  _parents
  _children
  _friends
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav2Lv1RawItemsBuilder',
    level: 'info',
  }) {
    super(logCfg)
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
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

  //Override
  getMenuItemData () {
    const me = this
    const helper = NotionJsonArrayHelper
    const parentId = helper.getFirstBlockId(me._parents)
    const pageId = me._pageId
    const tpl = EcoNotionTemplateLv1.nav2Template
    const cleanId = nId.cleanId(pageId)
    const items = [
      {
        emoji: tpl.back.emoji,
        label: tpl.back.label,
        url: nUrl.getNotionUrl(parentId),
      },
      {
        emoji: tpl.end.emoji,
        label: tpl.end.label,
        url: eUrl.getEcoBuildUrl(cleanId),
      },
      {
        emoji: tpl.chid.emoji,
        label: tpl.chid.label,
        url: '',
      },
      {
        emoji: tpl.next.emoji,
        label: tpl.next.label,
        url: eUrl.getEcoLearnUrl(cleanId),
      },
    ]
    return items
  }
}
