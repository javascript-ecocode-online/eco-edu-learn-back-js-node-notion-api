import { notion } from '../../../../config/notionClient.js'
import { Lv0Builder } from '../../lv0Builder.js'

export class Nav1Lv4Builder extends Lv0Builder {
  constructor () {
    super('Nav1Lv4Builder')
  }
  #getToggleMentionPageId (block) {
    const rs = block?.toggle?.rich_text
      .filter(
        textItem =>
          textItem.type === 'mention' && textItem.mention.type === 'page'
      )
      .map(textItem => {
        //console.log('>: ', textItem)
        return textItem.mention.page.id
      })
      .join('')

    return rs
  }
  /**
   * Thêm 1 text block vào trong 1 toggle block đã tồn tại
   * @param {string} toggleBlockId - ID của toggle block
   * @param {string} text - Nội dung văn bản muốn thêm vào
   */
  async #appendTextToToggleBlock (toggleBlockId, text) {
    try {
      const response = await notion.blocks.children.append({
        block_id: toggleBlockId,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: text,
                  },
                },
              ],
            },
          },
        ],
      })

      console.log(
        `✅ Text block ${text} đã được thêm vào toggle block ${toggleBlockId}!`
      )
      return response
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  init (lv3Block) {
    this._lv3Block = lv3Block
    return this
  }
  async #hasChildWithText (toggleBlockId, idText) {
    const nqc = this._nqc
    // Lấy danh sách block con của toggle block
    const reason = `${this._name} #hasChildWithText`
    const children = await nqc.getAllChildrenById(reason, toggleBlockId)
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
        if (fullText === idText) {
          return true // Đã tồn tại block có nội dung trùng
        }
      }
    }

    return false // Không có block con nào trùng text
  }
  async execute () {
    const me = this
    const block = me._lv3Block
    const blockId = block.id
    //console.log('====================')
    //console.log('block.id: ', block.id)
    //const toggleText = getToggleRichText(block)
    const targetBlockId = me.#getToggleMentionPageId(block)
    //console.log(toggleText, targetBlockId)
    const idText = `🔑 ${targetBlockId}`
    const hasChild = await me.#hasChildWithText(blockId, idText)
    if (hasChild) {
      console.log(`🔥 Block ${blockId} đã tồn tại block con ${idText}!`)
    } else {
      await me.#appendTextToToggleBlock(blockId, idText)
    }
  }
}
