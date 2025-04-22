import { EcoBase } from '../../../../base/base.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionBuilderObjectMentionPage } from '../blocks/notion-builder-object-mention-page.js'

export class EcoNotionBuilderNav1Lv3 extends EcoBase {
  constructor () {
    super({ name: 'EcoNotionBuilderNav1Lv3', isDebug: true, level: 'info' })
  }
  getLv3Blocks (pageId, items) {
    const me = this
    const children = items.map(item => me.#formatItem(pageId, item))
    return children
  }
  #formatItem (pageId, item) {
    const me = this
    const itemId = item.id
    const arr = [
      new EcoNotionBuilderObjectMentionPage().setPageId(itemId).oObjSafe,
      me.#getRichTextText(pageId, itemId),
    ]
    const block = new EcoNotionBuilderBlockToggle().setRichTextArray(arr).oBlockSafe
    return block
  }

  
  #getRichTextText (pageId, itemId) {
    const me = this
    const isCurrent =
      me.#getStringOnlyPageId(pageId) == me.#getStringOnlyPageId(itemId)
    const content = isCurrent ? ' ✨' : ' 🔗'
    const textObj = new EcoNotionBuilderObjectText().setContent(content).oObjSafe
    return textObj
  }

  #getStringOnlyPageId (pageId) {
    return pageId.replace(/-/g, '').trim()
  }
}
