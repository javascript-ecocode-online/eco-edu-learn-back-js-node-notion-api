import { notion } from '../../../../config/notionClient.js'

export class Nav1Lv4Builder {
  // constructor(){

  // }
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
  async #appendTextToToggleBlock(toggleBlockId, text) {
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
      });
  
      console.log(`✅ Text block ${text} đã được thêm vào toggle block ${toggleBlockId}!`);
      return response;
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error);
    }
  }
  init (lv3Block) {
    this._lv3Block = lv3Block
    return this;
  }
  async execute () {
    const me = this
    const block = me._lv3Block
    //console.log('====================')
    //console.log('block.id: ', block.id)
    //const toggleText = getToggleRichText(block)
    const targetBlockId = me.#getToggleMentionPageId(block)
    //console.log(toggleText, targetBlockId)
    const idText = `🔑 ${targetBlockId}`
    await me.#appendTextToToggleBlock(block.id, idText)
  }
}
