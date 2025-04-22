import { EcoNotionServiceBase as Base } from './notion-service-base.js'

export class EcoNotionServiceBuildBlockBase extends Base {
  constructor (logConfig) {
    super(logConfig)
  }

  get _blocks () {
    //notion.blocks.children.list
    return this._notionClient.blocks
  }
  get _children () {
    //notion.blocks.children.list
    return this._blocks.children
  }
  async _appendChild (blockId, child) {
    const me = this
    const rs = await me._children.append({
      block_id: blockId,
      children: [].concat(child),
    })
    if (rs.results?.length) {
      return rs.results[0]
    }
    return null
  }
  async _appendChildren (blockId, children) {
    const me = this
    const rs = await me._children.append({
      block_id: blockId,
      children: children,
    })
    if (rs.results?.length) {
      return rs.results[0]
    }
    return null
  }
  //toggle
  async _updateRichText (type, blockId, richTextArr) {
    const me = this
    const data = {
      block_id: blockId,
    }
    data[type] = {
      rich_text: richTextArr,
    }
    try {
      const response = await me._blocks.update(data)
      console.log(`✍️ Đã cập nhật block ${type}:`, response)
      console.log(`> ${type} rich text:`, response?.toggle?.rich_text)
      return response
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật block ${type}:`, error)
      throw error
    }
  }

  /**
   * Xóa tất cả block con của một toggle block
   * @param {string} toggleBlockId - ID của toggle block
   */
  async deleteAllChildBlocks (toggleBlockId) {
    const me = this
    let cursor = undefined
    let hasMore = true

    while (hasMore) {
      const response = await me._children.list({
        block_id: toggleBlockId,
        start_cursor: cursor,
      })

      const childBlocks = response.results

      // Xóa từng block con
      for (const block of childBlocks) {
        await me._blocks.update({
          block_id: block.id,
          archived: true,
        })
        console.log(`✅ Đã xóa block ${block.id}`)
      }

      // Kiểm tra phân trang
      hasMore = response.has_more
      cursor = response.next_cursor
    }

    console.log('🎉 Đã xóa toàn bộ block con của block:', toggleBlockId)
    return await me._blocks.retrieve({ block_id: toggleBlockId });
  }
}
