import { Lv0Builder } from '../base/lv0Builder.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionBuilderObjectMentionPage } from '../blocks/notion-builder-object-mention-page.js'

export class EcoNotionBuilderNav1Lv3 extends Lv0Builder {
  constructor () {
    super({ name: 'EcoNotionBuilderNav1Lv3', isDebug: false, level: 'info' })
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
      me._cleanId(pageId) == me._cleanId(itemId)
    const content = isCurrent ? ' ✨' : ' 🔗'
    const textObj = new EcoNotionBuilderObjectText().setContent(content).oObjSafe
    return textObj
  }

}
