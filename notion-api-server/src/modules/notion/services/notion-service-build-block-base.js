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
    me._logLines('🔥 Start _appendChild ...', blockId, child)
    const rs = await me._children.append({
      block_id: blockId,
      children: [].concat(child),
    })
    if (rs.results?.length) {
      const finalRs = rs.results[0]
      me._logLines('🔥 Block appened:', finalRs)
      return finalRs
    }
    me._logLines('🔥 No block appened!')
    return null
  }
  async _appendChildren (blockId, children) {
    const me = this
    me._logLines('🔥 Start _appendChildren ...', blockId, children)
    const rs = await me._children.append({
      block_id: blockId,
      children: children,
    })
    if (rs.results?.length) {
      const finalRs = rs.results[0]
      me._logLines('🔥 Block appened:', finalRs)
      return finalRs
    }
    me._logLines('🔥 No block appened!')
    return null
  }
  //toggle
  async _updateRichText (type, blockId, richTextArr) {
    const me = this
    me._logLines('🔥 Start update block rich text ...', richTextArr)
    const data = {
      block_id: blockId,
    }
    data[type] = {
      rich_text: richTextArr,
    }
    try {
      
      const response = await me._blocks.update(data)
      me._logLines('🔥 Block rich text updated:', response)
      //console.log(`> ${type} rich text:`, response?.toggle?.rich_text)
      return response
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật block ${type}:`, error)
      throw error
    }
  }

  async deleteBlock (id) {
    const me = this
    me._logLines('🔥 Start delete block...', id)
    const rs = await me._blocks.update({
      block_id: id,
      archived: true,
    })
    me._logLines('🔥 Deleted block:', rs)
    return rs
  }

  async removeBlockAndChildren (block) {
    const me = this
    me._logLines('🔥 Start removeBlockAndChildren ...', block)

    const id = block.id
    const hasChildren = block.has_children
    if (hasChildren) {
      await me.deleteAllChildBlocks(id)
    }
    const removedBlock = await me.deleteBlock(id)
    me._logLines('🔥 Removed result: ', removedBlock)
    return removedBlock
  }

  /**
   * Xóa tất cả block con của một toggle block
   * @param {string} blockId - ID của toggle block
   */
  async deleteAllChildBlocks (blockId) {
    const me = this
    me._logLines('🔥 Start deleteAllChildBlocks ...', blockId)
    let cursor = undefined
    let hasMore = true

    while (hasMore) {
      const response = await me._children.list({
        block_id: blockId,
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

    me._logLines('🔥 Đã xóa toàn bộ block con của block:', blockId)
    return await me._blocks.retrieve({ block_id: blockId })
  }
}
