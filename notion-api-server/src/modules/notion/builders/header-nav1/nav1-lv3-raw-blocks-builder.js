import { Lv0Builder } from '../base/lv0Builder.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionBuilderObjectMentionPage } from '../blocks/notion-builder-object-mention-page.js'
import { EcoNotionNav1Lv4RawBlocksBuilder } from './nav1-lv4-raw-blocks-builder.js'
export class EcoNotionNav1Lv3RawBlocksBuilder extends Lv0Builder {
  constructor () {
    super({
      name: 'EcoNotionNav1Lv3RawBlocksBuilder',
      isDebug: false,
      level: 'info',
    })
  }
  async getLv3Blocks (pageId, items) {
    const me = this
    const children = await Promise.all(
      items.map(item => me.#formatItem(pageId, item))
    );
    return children
  }
  async #getChildrenLv4Blocks(relatedPageId){
    const db = EcoNotionNav1Lv4RawBlocksBuilder.instance
    return await db.getNav1Lv4Blocks(relatedPageId)
  }
 async #formatItem (currentPageId, item) {
    const me = this
    //console.log('getLv3Blocks item ', item)
    const relatedPageId = item.id
    const relatedPageTitle = item.title
    const arr = [
      new EcoNotionBuilderObjectMentionPage()
        .setPageId(relatedPageId)
        .setTitle(relatedPageTitle).oObjSafe,
      me.#getRichTextText(currentPageId, relatedPageId),
    ]
    const children = await me.#getChildrenLv4Blocks(relatedPageId)
    const block = new EcoNotionBuilderBlockToggle().setChildrenBlocks(children).setRichTextArray(
      arr
    ).oBlockSafe
    return block
  }

  #getRichTextText (currentPageId, relatedPageId) {
    const me = this
    const isCurrent = me._cleanId(currentPageId) == me._cleanId(relatedPageId)
    const content = isCurrent ? ' ✨' : ' 🔗'
    const textObj = new EcoNotionBuilderObjectText().setContent(
      content
    ).oObjSafe
    return textObj
  }
}
