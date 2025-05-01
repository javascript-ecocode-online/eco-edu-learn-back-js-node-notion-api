import { EcoNotionBuilderLv1DataText as Base } from '../base/level/builder-lv1-data-text.js'
import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { NotionIdHelper as nId } from '../../helpers/id/notion-id-helper.js'
// Lớp này chịu trách nhiêm tạo dữ liệu cho dòng text nav1 lv1
export class EcoNotionNav1Lv1RawItemsBuilder extends Base {
  _pageId
  _parents
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav1Lv1RawItemsBuilder',
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

  //Override
  getMenuItemData () {
    const me = this
    const helper = NotionJsonArrayHelper
    const parentId = helper.getFirstBlockId(me._parents)
    const pageId = me._pageId
    const tpl = EcoNotionTemplateLv1.nav1Template
    const cleanId = nId.cleanId(pageId)
    const items = [
      {
        emoji: tpl.parent.emoji,
        label: tpl.parent.label,
        url: nUrl.getNotionUrl(parentId),
      },
      {
        emoji: tpl.build.emoji,
        label: tpl.build.label,
        url: eUrl.getEcoBuildUrl(cleanId),
      },
      {
        emoji: tpl.learn.emoji,
        label: tpl.learn.label,
        url: eUrl.getEcoLearnUrl(cleanId),
      },
    ]
    return items
  }
}
