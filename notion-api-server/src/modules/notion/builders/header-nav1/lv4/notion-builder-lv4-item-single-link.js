import { NotionBuilderLv4ItemBase as Base } from './notion-builder-lv4-item-base.js'
import { EcoNotionBuilderObjectText } from '../../blocks/notion-builder-object-text.js'
import { EcoNotionBuilderBlockParagraph } from '../../blocks/notion-builder-block-paragraph.js'

export class NotionBuilderLv4ItemSingleLink extends Base {
  constructor (logConfig = 'NotionBuilderLv4ItemSingleLink') {
    super(logConfig)
  }
  #getLinkLv4ToggleRichRTextItem (emoji, content, url) {
    const emojiObj = new EcoNotionBuilderObjectText().setContent(emoji).oObjSafe
    const linkObj = new EcoNotionBuilderObjectText()
      .setContent(content)
      .setLink(url).oObjSafe
    return [emojiObj, linkObj]
  }
  #getLinkLv4ToggleBlock (emoji, content, url) {
    const me = this
    const arr = me.#getLinkLv4ToggleRichRTextItem(emoji, content, url)
    const blockLv4 = new EcoNotionBuilderBlockParagraph().setRichTextArray(
      arr
    ).oBlockRaw
    return blockLv4
  }
  async _appendLinkToggleBlock (blockLv3Id, emoji, content, url) {
    const me = this
    try {
      const blockLv4 = me.#getLinkLv4ToggleBlock(emoji, content, url)
      return blockLv4 ? await me._appendToggleBlock(blockLv3Id, blockLv4) : null
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  async _hasChildWithImageLink (children, emj, linkText) {
    if (this._isResetChildren) return false

    if (!children) return false // Không có block con nào trùng text
    // Duyệt qua từng block con và so sánh text
    for (const block of children) {
      if (
        block.type === 'paragraph' && // hoặc kiểm tra type khác nếu cần
        block.paragraph &&
        block.paragraph.rich_text &&
        block.paragraph.rich_text.length > 0
      ) {
        const fullText = block.paragraph.rich_text
          .map(rt => rt.plain_text)
          .join('')

        const cleaned = fullText.replace(new RegExp(emj, 'g'), '').trim()
        //console.log(`---> 🍒: "${cleaned}" vs "${linkText}"`)
        if (cleaned === linkText) {
          return true // Đã tồn tại block có nội dung trùng
        }
      }
    }

    return false // Không có block con nào trùng text
  }
}
