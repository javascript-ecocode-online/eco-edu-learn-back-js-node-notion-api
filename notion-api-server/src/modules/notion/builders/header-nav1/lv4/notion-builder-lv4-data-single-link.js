import { NotionBuilderLv4DataBase as Base } from './notion-builder-lv4-data-base.js'
import { EcoNotionBuilderBlockParagraph } from '../../blocks/notion-builder-block-paragraph.js'
import { EcoNotionBuilderObjectText } from '../../blocks/notion-builder-object-text.js'

export class NotionBuilderLv4DataSingleLink extends Base {
  constructor (logConfig = 'NotionBuilderLv4DataBuildLinks') {
    super(logConfig)
  }
  #getLinkLv4ToggleRichRTextItem (emoji, content, url) {
    const emojiObj = new EcoNotionBuilderObjectText().setContent(emoji).oObjSafe
    const linkObj = new EcoNotionBuilderObjectText()
      .setContent(content)
      .setLink(url).oObjSafe
    return [emojiObj, linkObj]
  }
  _getLinkBlock (emoji, content, url) {
    const me = this
    const arr = me.#getLinkLv4ToggleRichRTextItem(emoji, content, url)
    const blockLv4 = new EcoNotionBuilderBlockParagraph().setRichTextArray(
      arr
    ).oBlockRaw
    return blockLv4
  }
}
